require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/analyze", async (req, res) => {
  const { age, income, products, lifeEvent, behaviour, activity } = req.body;

  const prompt = `You are the AI engine powering RBC's Next Best Action (NBA) system — the same system that drives NOMI Insights and hyper-personalized banking recommendations for 17 million RBC clients across Canada.

Analyze this customer profile and return a single JSON object only. No markdown, no explanation, no backticks. Only raw JSON.

Customer Profile:
- Age: ${age}
- Annual Income: ${income}
- Current RBC Products: ${products}
- Life Event: ${lifeEvent}
- Banking Behaviour: ${behaviour}
- Recent Activity / Notes: ${activity || "None provided"}

RBC's real product catalogue to choose from:
ACCOUNTS: RBC Day to Day Banking, RBC Signature No Limit Banking, RBC VIP Banking, RBC Student Banking, RBC Newcomer Advantage
SAVINGS: TFSA (Tax-Free Savings Account, $7,000/yr limit 2025), RRSP (Registered Retirement Savings Plan), FHSA (First Home Savings Account, $8,000/yr), RESP (Registered Education Savings Plan - CESG 20% match up to $2,500/yr), RDSP (Registered Disability Savings Plan), GIC (Guaranteed Investment Certificate), RBC High Interest eSavings
CREDIT CARDS: RBC Avion Visa Infinite (premium travel, $120/yr fee), RBC Avion Visa Platinum (mid-tier travel), RBC Cash Back Mastercard (no fee), RBC Rewards+ Visa (everyday rewards), RBC British Airways Visa Infinite (travel), RBC ION Visa (no fee everyday)
BORROWING: RBC Mortgage, RBC Homeline Plan (HELOC - up to 65% home equity), RBC Personal Loan, RBC Line of Credit, RBC Student Line of Credit, RBC RRSP Loan, RBC Auto Financing
INVESTING: RBC Direct Investing, RBC InvestEase (robo-advisor), RBC Mutual Funds, RBC Dominion Securities, RBC Wealth Management
INSURANCE: RBC Creditor Insurance, RBC Life Insurance, RBC Travel Insurance, RBC Home & Auto Insurance
RETIREMENT: RRIF (Registered Retirement Income Fund - converts from RRSP), RBC Annuity, RBC Pension Solutions

Return ONLY this JSON:
{
  "recommended_product": "exact RBC product name from catalogue above",
  "product_category": "one of: Savings | Credit | Borrowing | Investing | Insurance | Retirement | Accounts",
  "reason": "2-3 sentences personalised specifically to this customer's profile - reference their age, income, life event and current products directly",
  "nomi_insight": "one sentence written as if NOMI is speaking directly to the customer in the app - conversational, warm, first-person eg 'Based on your recent activity, it looks like...'",
  "talking_points": ["point 1 specific to this customer", "point 2 specific to this customer", "point 3 with a real number or stat"],
  "urgency": "High or Medium or Low",
  "urgency_reason": "one sentence explaining why now",
  "confidence": "percentage between 72% and 96%",
  "revenue_potential": "High or Medium or Low",
  "experiment_hypothesis": "one sentence - how RBC's NBA team would frame an A/B test for this recommendation eg 'Customers aged X-Y with Z behaviour who receive this offer will show Y% higher conversion than control group'",
  "next_action": "specific action the RBC advisor should take this week",
  "cross_sell": "one additional RBC product from the catalogue and why in one sentence",
  "risk_flag": "none or a brief flag if this customer may be over-extended, near retirement, student debt risk etc"
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.75,
        max_tokens: 1500,
      }),
    });

    const data = await response.json();
    console.log("Groq response status:", response.status);
    console.log("Groq data:", JSON.stringify(data).slice(0, 500));

    if (!response.ok) {
      throw new Error(`Groq API error ${response.status}: ${data.error?.message || JSON.stringify(data)}`);
    }

    const raw = data.choices?.[0]?.message?.content || "";
    console.log("Raw LLM output:", raw.slice(0, 300));

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}") + 1;

    if (start === -1 || end === 0) {
      throw new Error("LLM did not return valid JSON. Raw output: " + raw.slice(0, 200));
    }

    const jsonStr = raw.slice(start, end);
    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (parseErr) {
      // Fix truncated JSON
      let fixed = jsonStr.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
      const ob = (fixed.match(/{/g)||[]).length, cb = (fixed.match(/}/g)||[]).length;
      const oa = (fixed.match(/\[/g)||[]).length, ca = (fixed.match(/\]/g)||[]).length;
      for(let i=0;i<oa-ca;i++) fixed+="]";
      for(let i=0;i<ob-cb;i++) fixed+="}";
      try {
        parsed = JSON.parse(fixed);
      } catch (finalErr) {
        console.error("Failed to parse even after repair. jsonStr:", jsonStr.slice(0, 300));
        throw new Error("Could not parse LLM response as JSON: " + finalErr.message);
      }
    }
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3001, () => console.log("RBC NBA Backend running on http://localhost:3001"));
