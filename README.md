# RBC Next Best Action Intelligence Engine

A full-stack demo app mirroring what RBC's real NBA team builds — powered by Groq LLaMA-3 70B.

---

## ⚡ Setup in 3 Steps

### Step 1 — Add your Groq API Key
Open `backend/server.js` and replace line 7:
```
const GROQ_API_KEY = "YOUR_GROQ_API_KEY_HERE";
```
Get a free key at: https://console.groq.com

---

### Step 2 — Start the Backend
```bash
cd backend
npm install
npm start
```
Backend runs on http://localhost:3001

---

### Step 3 — Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
Frontend opens at http://localhost:3000

---

## What It Does

**Landing Page:**
- Animated velora glass UI with floating particles and 3D hover effect
- Real RBC NBA stats (17M clients, 1.1B NOMI insights, $700M AI value target)
- Overview of what the NBA team actually does (data verified from public sources)

**Engine Page:**
- Customer profile input: age slider, income, products, life event, behaviour, notes
- Animated loading screen with real pipeline steps
- AI recommendation includes:
  - Recommended RBC product (from real 2025 catalogue)
  - Personalised reason tied to their exact profile
  - NOMI Insights message (written as if appearing in the RBC mobile app)
  - Urgency, Confidence %, Revenue Potential
  - 3 Banker Talking Points
  - A/B Test Hypothesis (shows how RBC's NBA team frames experiments)
  - Next Action for the advisor
  - Cross-sell opportunity
  - Risk flag if applicable

---

## Tech Stack
- **Frontend:** React 18, inline styles, Google Fonts (Syne + DM Sans)
- **Backend:** Node.js + Express
- **AI:** Groq API (llama3-70b-8192) — free tier, very fast
- **No database** — stateless, session only

---

## Demo Script (for interview)
1. Open http://localhost:3000
2. Say: *"I built something this week that mirrors what your NBA team actually does — can I share my screen?"*
3. Walk through the landing page — point out the stats, explain the NBA team overview
4. Click "Launch Engine"
5. Enter a profile live: Age 34, $80k-120k, only Chequing, Life Event: "New baby"
6. Walk through the recommendation as it loads
7. Point to the A/B Test Hypothesis: *"This is how I understand your team actually frames experiments — I built that in because I read about RBC's measurement culture"*

That last point will make them stop and take notice.
