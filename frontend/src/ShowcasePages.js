import React, { useState, useEffect, useRef } from 'react';
import RBCShield from './RBCShield';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED ATOMS
// ─────────────────────────────────────────────────────────────────────────────
const SC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

    /* ── velora-style eased entrance ── */
    @keyframes vUp   { from{opacity:0;transform:translateY(36px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes vLeft { from{opacity:0;transform:translateX(-32px)} to{opacity:1;transform:translateX(0)} }
    @keyframes vFade { from{opacity:0} to{opacity:1} }
    @keyframes vPop  { 0%{opacity:0;transform:scale(0.85)} 70%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1)} }

    /* ── continuous ── */
    @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes floatYR { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
    @keyframes spinSlow{ to{transform:rotate(360deg)} }
    @keyframes spinCCW { to{transform:rotate(-360deg)} }
    @keyframes pulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
    @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes scan    { 0%{top:-4px} 100%{top:100%} }
    @keyframes glow    { 0%,100%{opacity:.35} 50%{opacity:.9} }
    @keyframes drift1  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-28px)} 66%{transform:translate(-24px,36px)} }
    @keyframes drift2  { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-30px,22px)} 66%{transform:translate(26px,-34px)} }
    @keyframes hexFade { 0%,100%{opacity:.04} 50%{opacity:.09} }
    @keyframes barFill { from{width:0} to{width:var(--w)} }
    @keyframes typeIn  { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
    @keyframes nodePop { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
    @keyframes ringOut { 0%{opacity:.8;transform:scale(.8)} 100%{opacity:0;transform:scale(2)} }
    @keyframes ticker  { 0%{transform:translateY(0)} 50%{transform:translateY(-3px)} 100%{transform:translateY(0)} }
    @keyframes dataFlow{ 0%{transform:translateX(-110%)} 100%{transform:translateX(420%)} }
    @keyframes eyeL    { 0%,100%{transform:translateX(0)} 30%{transform:translateX(3px)} 70%{transform:translateX(-3px)} }
    @keyframes robotWork{ 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
    @keyframes smileDone{ from{d:path('M44 62 Q60 62 76 62')} to{d:path('M44 60 Q60 70 76 60')} }
    @keyframes particleX{ 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--px),var(--py)) scale(0)} }
  `}</style>
);

function Orbs({ c1='rgba(0,93,170,0.09)', c2='rgba(255,210,0,0.04)' }) {
  return <>
    <div style={{position:'fixed',width:640,height:640,borderRadius:'50%',filter:'blur(110px)',background:c1,top:-160,left:-180,zIndex:0,animation:'drift1 20s ease-in-out infinite',pointerEvents:'none'}}/>
    <div style={{position:'fixed',width:520,height:520,borderRadius:'50%',filter:'blur(100px)',background:c2,bottom:-120,right:-120,zIndex:0,animation:'drift2 16s ease-in-out infinite',pointerEvents:'none'}}/>
  </>;
}

function ScanBeam({ color='rgba(0,93,170,0.3)' }) {
  return <div style={{position:'fixed',left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`,zIndex:1,animation:'scan 7s linear infinite',pointerEvents:'none'}}/>;
}

function NavBar({ accent, label, onBack, onNext, nextLabel='Next', onHome }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:44,animation:'vUp .7s cubic-bezier(.22,1,.36,1) both'}}>
      <button onClick={onHome} style={{display:'flex',alignItems:'center',gap:10,background:'none',border:'none',cursor:'pointer',padding:0,textAlign:'left'}}>
        <RBCShield size={36}/>
        <div style={{fontSize:10,letterSpacing:'.2em',textTransform:'uppercase',color:accent,fontFamily:"'DM Sans',sans-serif"}}>{label}</div>
      </button>
      <div style={{display:'flex',gap:10}}>
        <button onClick={onBack} style={{padding:'8px 18px',borderRadius:8,border:'1px solid rgba(255,255,255,0.09)',background:'transparent',color:'rgba(232,234,240,.4)',cursor:'pointer',fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:'all .2s'}}>← Back</button>
        {onNext && <button onClick={onNext} style={{padding:'8px 20px',borderRadius:8,border:`1px solid ${accent}55`,background:`${accent}15`,color:accent,cursor:'pointer',fontSize:12,fontFamily:"'DM Sans',sans-serif",transition:'all .2s'}}>{nextLabel} →</button>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 - ML PIPELINE  (blue theme)
// ─────────────────────────────────────────────────────────────────────────────
export function PipelinePage({ onNext, onBack, onHome }) {
  const [active, setActive]    = useState(-1);
  const [done, setDone]        = useState([]);
  const [running, setRunning]  = useState(false);
  const [finished, setFinished]= useState(false);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  const stages = [
    { icon:'🌊', label:'Ingest',      tech:'Kafka · SQS',       desc:'17M client event streams ingested in real-time from mobile, ATM, branch touchpoints.',       color:'#38bdf8', x:8.3  },
    { icon:'⚙️', label:'Transform',   tech:'Apache Spark',       desc:'Distributed PySpark jobs transform raw events into 200+ ML features across a cluster.',     color:'#34d399', x:25   },
    { icon:'🧠', label:'Train',       tech:'Vertex AI · MLflow', desc:'XGBoost + neural net ensembles trained on labelled campaign-response data with MLflow runs.', color:'#a78bfa', x:41.7 },
    { icon:'⚡', label:'Score',       tech:'FastAPI · Docker',   desc:'Sub-100 ms batch + real-time propensity scoring via containerised REST endpoints.',          color:'#fb923c', x:58.3 },
    { icon:'🚀', label:'Serve',       tech:'K8s · Helm',         desc:'Auto-scaling inference pods, blue-green deploys, health checks - zero downtime.',            color:'#f472b6', x:75   },
    { icon:'📊', label:'Monitor',     tech:'Datadog · Airflow',  desc:'Drift detection, accuracy dashboards and auto-retraining DAGs triggered on threshold breach.',color:'#FFD200', x:91.7 },
  ];

  const burst = (idx) => {
    const newP = Array.from({length:8},(_,i)=>({
      id:Date.now()+i, x:`${stages[idx]?.x||50}%`,
      px:`${(Math.random()-.5)*80}px`, py:`${(Math.random()-.5)*80}px`,
      color: stages[idx]?.color||'#fff',
    }));
    setParticles(p=>[...p,...newP]);
    setTimeout(()=>setParticles(p=>p.filter(x=>!newP.find(n=>n.id===x.id))),800);
  };

  const run = () => {
    if(running) return;
    setRunning(true); setDone([]); setActive(0); setFinished(false);
    let i=0;
    timerRef.current = setInterval(()=>{
      burst(i);
      setActive(i);
      setDone(prev=>[...prev,i-1]);
      i++;
      if(i>=stages.length){
        clearInterval(timerRef.current);
        setTimeout(()=>{setActive(-1);setDone(stages.map(s=>s.id===undefined?stages.indexOf(s):stages.indexOf(s)));setRunning(false);setFinished(true);},900);
      }
    },900);
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#03080f 0%,#071525 55%,#03080f 100%)',position:'relative',overflow:'hidden',fontFamily:"'DM Sans',sans-serif",color:'#e8eaf0'}}>
      <SC/><Orbs/><ScanBeam color='rgba(56,189,248,0.35)'/>
      {/* Hex grid */}
      <div style={{position:'fixed',inset:0,zIndex:0,animation:'hexFade 5s ease-in-out infinite',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 70L4 54V22L30 6l26 16v32z' fill='none' stroke='%2338bdf8' stroke-width='1'/%3E%3C/svg%3E")`,backgroundSize:'60px 104px'}}/>

      {/* Particles */}
      {particles.map(p=>(
        <div key={p.id} style={{position:'fixed',top:'40%',left:p.x,width:6,height:6,borderRadius:'50%',background:p.color,zIndex:20,pointerEvents:'none',animation:'particleX .8s ease-out forwards','--px':p.px,'--py':p.py,boxShadow:`0 0 8px ${p.color}`}}/>
      ))}

      <div style={{position:'relative',zIndex:2,maxWidth:1140,margin:'0 auto',padding:'38px 28px'}}>
        <NavBar accent='#38bdf8' label='Skill Showcase 01 - Big Data + MLOps ' onBack={onBack} onNext={onNext} onHome={onHome}/>

        <div style={{animation:'vUp .8s cubic-bezier(.22,1,.36,1) .1s both'}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(30px,4.5vw,54px)',lineHeight:1.08,marginBottom:10,background:'linear-gradient(130deg,#fff 0%,#38bdf8 45%,#005DAA 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>ML Pipeline<br/>Architecture</h1>
          <p style={{fontSize:13,color:'rgba(232,234,240,.38)',marginBottom:40}}>Python · Java · SQL · Apache Spark · Airflow · Kafka · Batch + Real-time · MLOps</p>
        </div>

        {/* ── Pipeline canvas ── */}
        <div style={{background:'rgba(7,18,33,.85)',border:'1px solid rgba(56,189,248,.15)',borderRadius:22,padding:'36px 28px 28px',marginBottom:24,backdropFilter:'blur(24px)',position:'relative',overflow:'hidden',animation:'vUp .8s cubic-bezier(.22,1,.36,1) .2s both'}}>

          {/* connecting SVG */}
          <svg style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}} preserveAspectRatio="none">
            <defs>
              {stages.slice(0,-1).map((s,i)=>(
                <linearGradient key={i} id={`lg${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={s.color} stopOpacity={done.includes(i)?'.8':'0'}/>
                  <stop offset="100%" stopColor={stages[i+1].color} stopOpacity={done.includes(i)?'.8':'0'}/>
                </linearGradient>
              ))}
            </defs>
            {stages.slice(0,-1).map((s,i)=>(
              <line key={i} x1={`${s.x+3.5}%`} y1="38%" x2={`${stages[i+1].x-3.5}%`} y2="38%"
                stroke={done.includes(i)?`url(#lg${i})`:'rgba(255,255,255,.05)'}
                strokeWidth="2.5" strokeDasharray={done.includes(i)?'none':'8 5'}
                style={{transition:'stroke .6s ease'}}/>
            ))}
            {/* data packet animation */}
            {running && active>=0 && active<stages.length-1 && (
              <circle r="5" fill={stages[active]?.color||'#fff'} opacity=".9" style={{filter:`drop-shadow(0 0 6px ${stages[active]?.color})`}}>
                <animateMotion dur="0.85s" repeatCount="1" path={`M ${stages[active].x+3.5}% 0 L ${stages[active+1]?.x-3.5}% 0`}/>
              </circle>
            )}
          </svg>

          {/* Stage nodes */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,position:'relative',zIndex:1}}>
            {stages.map((s,idx)=>{
              const isA=active===idx, isDone=done.includes(idx);
              return (
                <div key={idx} onClick={()=>!running&&setActive(active===idx?-1:idx)}
                  style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,cursor:'pointer'}}>
                  <div style={{position:'relative',width:68,height:68,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,
                    background:isA?`radial-gradient(circle,${s.color}30,${s.color}08)`:isDone?`${s.color}14`:'rgba(255,255,255,.02)',
                    border:`2px solid ${isA?s.color:isDone?s.color+'55':'rgba(255,255,255,.07)'}`,
                    boxShadow:isA?`0 0 32px ${s.color}66,0 0 64px ${s.color}22`:isDone?`0 0 14px ${s.color}33`:'none',
                    transition:'all .45s ease',animation:isA?'nodePop .9s ease infinite':'none'}}>
                    {s.icon}
                    {isA && <>
                      <div style={{position:'absolute',inset:-10,borderRadius:'50%',border:`1.5px solid ${s.color}`,animation:'ringOut 1.2s ease infinite'}}/>
                      <div style={{position:'absolute',inset:-20,borderRadius:'50%',border:`1px solid ${s.color}44`,animation:'ringOut 1.2s ease infinite .4s'}}/>
                    </>}
                    {isDone&&<div style={{position:'absolute',top:-4,right:-4,width:18,height:18,borderRadius:'50%',background:'#34d399',color:'#03080f',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'}}>✓</div>}
                  </div>
                  <div style={{textAlign:'center'}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:11,color:isDone||isA?s.color:'rgba(232,234,240,.4)',transition:'color .4s'}}>{s.label}</div>
                    <div style={{fontSize:9,color:'rgba(232,234,240,.25)',letterSpacing:'.05em',marginTop:2}}>{s.tech}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail card */}
          {active>=0 && stages[active] && (
            <div style={{marginTop:28,padding:'16px 20px',borderRadius:14,background:`${stages[active].color}0a`,border:`1px solid ${stages[active].color}30`,animation:'vFade .3s ease both',display:'flex',gap:14}}>
              <span style={{fontSize:26}}>{stages[active].icon}</span>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:stages[active].color,marginBottom:4}}>{stages[active].label} - {stages[active].tech}</div>
                <div style={{fontSize:12,color:'rgba(232,234,240,.5)',lineHeight:1.65}}>{stages[active].desc}</div>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{display:'flex',alignItems:'center',gap:16,justifyContent:'center',marginBottom:32}}>
          <button onClick={run} disabled={running} style={{padding:'13px 36px',borderRadius:12,border:'none',cursor:running?'not-allowed':'pointer',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.07em',background:running?'rgba(255,255,255,.05)':'linear-gradient(135deg,#005DAA,#003d73)',color:running?'rgba(232,234,240,.25)':'#fff',boxShadow:running?'none':'0 4px 28px rgba(0,93,170,.45)',transition:'all .3s'}}>
            {running?'↻  Pipeline running…':'▶  Run Full Pipeline'}
          </button>
          {finished&&<span style={{fontSize:12,color:'#34d399',animation:'vFade .4s ease both'}}>✓ All 6 stages complete - {(stages.length*.9).toFixed(1)}s</span>}
        </div>

        {/* Tech grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {[
            {label:'Languages',items:['Python 3.11','Java 17','SQL','Scala'],color:'#38bdf8'},
            {label:'Big Data',items:['Apache Spark','Airflow DAGs','Kafka','AWS SQS','Flink'],color:'#34d399'},
            {label:'Cloud + MLOps',items:['AWS Lambda','GCP Vertex AI','Azure ML','Docker','Kubernetes','Terraform','Jenkins CI/CD','MLflow'],color:'#a78bfa'},
          ].map((g,i)=>(
            <div key={i} style={{background:'rgba(7,18,33,.75)',border:`1px solid ${g.color}18`,borderRadius:16,padding:'18px 16px',animation:`vUp .6s cubic-bezier(.22,1,.36,1) ${.35+i*.1}s both`}}>
              <div style={{fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',color:g.color,marginBottom:12,fontFamily:"'Syne',sans-serif"}}>{g.label}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {g.items.map(item=>(
                  <span key={item} style={{padding:'4px 10px',borderRadius:20,fontSize:11,background:`${g.color}0e`,border:`1px solid ${g.color}2a`,color:g.color}}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 8px',fontSize:10,color:'rgba(232,234,240,0.18)',letterSpacing:'0.12em',textTransform:'uppercase'}}>© Sathosh Ai RBC-NBA</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 - LIVE MONITORING DASHBOARD  (green theme)
// ─────────────────────────────────────────────────────────────────────────────
export function DashboardPage({ onNext, onBack, onHome }) {
  const [m, setM]         = useState({clients:17432891,insights:1143200042,acc:91.4,lat:87,campaigns:342,drift:2.3});
  const [chart, setChart] = useState(Array.from({length:24},(_,i)=>70+Math.random()*22));
  const [events, setEvents]= useState([]);
  const [tick, setTick]   = useState(0);

  const evTpl = [
    {t:'NBA',  msg:'Customer #8821 - TFSA propensity 94% - push notification fired',    c:'#34d399'},
    {t:'DRIFT',msg:'Feature "avg_txn_7d" drift +1.2σ - retraining DAG queued',          c:'#fb923c'},
    {t:'INFER',msg:'Batch job complete - 42,891 customers scored in 3.2 s via Spark',   c:'#38bdf8'},
    {t:'CAMP', msg:'Campaign "RESP Spring 25" launched - 18,400 targets identified',    c:'#a78bfa'},
    {t:'MODEL',msg:'Model v2.4.1 promoted to prod - A/B test initialised (50/50 split)',c:'#FFD200'},
    {t:'ALERT',msg:'Latency spike on /score endpoint - K8s auto-scaled 3 → 6 pods',    c:'#f87171'},
    {t:'NBA',  msg:'Customer #22104 - "New baby" event - RESP recommendation fired',   c:'#34d399'},
    {t:'INFER',msg:'Kafka consumer lag 0 - real-time scoring at 1,240 events/s',        c:'#38bdf8'},
    {t:'SQL',  msg:'Nightly ETL complete - PostgreSQL updated 4.2M rows in 18 s',      c:'#60a5fa'},
  ];

  useEffect(()=>{
    const t=setInterval(()=>{
      setTick(n=>n+1);
      setM(prev=>({
        clients:  prev.clients+Math.floor(Math.random()*3),
        insights: prev.insights+Math.floor(Math.random()*600+300),
        acc:      Math.min(99,Math.max(85,prev.acc+(Math.random()-.48)*.12)),
        lat:      Math.min(130,Math.max(55,prev.lat+(Math.random()-.5)*5)),
        campaigns:prev.campaigns+(Math.random()>.97?1:0),
        drift:    Math.min(5,Math.max(.1,prev.drift+(Math.random()-.5)*.18)),
      }));
      setChart(prev=>[...prev.slice(1),70+Math.random()*25]);
      if(Math.random()>.55){
        const ev=evTpl[Math.floor(Math.random()*evTpl.length)];
        setEvents(prev=>[{...ev,id:Date.now(),time:new Date().toLocaleTimeString('en-CA',{hour12:false})},...prev.slice(0,7)]);
      }
    },1300);
    return ()=>clearInterval(t);
  },[]);

  const maxY=Math.max(...chart), minY=Math.min(...chart);
  const pts=chart.map((y,i)=>{
    const cx=(i/(chart.length-1))*100;
    const cy=100-((y-minY)/(maxY-minY+.01))*78;
    return `${cx},${cy}`;
  }).join(' ');
  const areaPath=`M ${chart.map((y,i)=>{const cx=(i/(chart.length-1))*100;const cy=100-((y-minY)/(maxY-minY+.01))*78;return`${cx} ${cy}`;}).join(' L ')} L 100 100 L 0 100 Z`;

  const kpis=[
    {label:'Clients Scored', v:m.clients.toLocaleString(),    icon:'👥', color:'#34d399'},
    {label:'NOMI Insights',  v:(m.insights/1e9).toFixed(3)+'B',icon:'💡', color:'#38bdf8'},
    {label:'Model Accuracy', v:m.acc.toFixed(1)+'%',           icon:'🎯', color:'#a78bfa'},
    {label:'Avg Latency',    v:Math.round(m.lat)+'ms',          icon:'⚡', color:m.lat>105?'#f87171':'#34d399'},
    {label:'Campaigns',      v:m.campaigns,                     icon:'📣', color:'#FFD200'},
    {label:'Feature Drift',  v:m.drift.toFixed(2)+'%',          icon:'📈', color:m.drift>3?'#f87171':'#34d399'},
  ];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#03080f 0%,#071510 55%,#03080f 100%)',position:'relative',overflow:'hidden',fontFamily:"'DM Sans',sans-serif",color:'#e8eaf0'}}>
      <SC/><Orbs c1='rgba(52,211,153,.07)' c2='rgba(56,189,248,.03)'/><ScanBeam color='rgba(52,211,153,.35)'/>
      <div style={{position:'fixed',inset:0,zIndex:0,opacity:.03,backgroundImage:'linear-gradient(rgba(52,211,153,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(52,211,153,.5) 1px,transparent 1px)',backgroundSize:'42px 42px'}}/>

      <div style={{position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',padding:'38px 28px'}}>
        <NavBar accent='#34d399' label='Skill Showcase 02 - Real-time Systems + Observability' onBack={onBack} onNext={onNext} onHome={onHome}/>

        <div style={{animation:'vUp .7s cubic-bezier(.22,1,.36,1) .1s both',marginBottom:36}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(28px,4vw,50px)',lineHeight:1.08,background:'linear-gradient(130deg,#fff 0%,#34d399 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>Live NBA<br/>Monitoring Dashboard</h1>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:7,height:7,borderRadius:'50%',background:'#34d399',animation:'pulse 1.4s infinite'}}/>
            <span style={{fontSize:11,color:'#34d399',letterSpacing:'.07em'}}>STREAMING LIVE - Datadog · MLflow · Airflow · Grafana</span>
          </div>
        </div>

        {/* KPI row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:12,marginBottom:22}}>
          {kpis.map((k,i)=>(
            <div key={i} style={{background:'rgba(7,18,33,.88)',border:`1px solid ${k.color}1a`,borderRadius:14,padding:'15px 10px',textAlign:'center',animation:`vUp .5s cubic-bezier(.22,1,.36,1) ${i*.06}s both`}}>
              <div style={{fontSize:20,marginBottom:6}}>{k.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:15,color:k.color,animation:'ticker .3s ease',animationPlayState:tick?'running':'paused'}}>{k.v}</div>
              <div style={{fontSize:9,color:'rgba(232,234,240,.28)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:4}}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1.65fr 1fr',gap:20,marginBottom:20}}>

          {/* Chart */}
          <div style={{background:'rgba(7,18,33,.88)',border:'1px solid rgba(52,211,153,.14)',borderRadius:18,padding:'22px 20px',animation:'vLeft .7s cubic-bezier(.22,1,.36,1) .25s both'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:3}}>Model Accuracy - Live Stream</div>
                <div style={{fontSize:10,color:'rgba(232,234,240,.3)'}}>Refreshing via MLflow tracking server every 1.3 s</div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:'#34d399'}}>{m.acc.toFixed(2)}%</div>
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%',height:160,display:'block'}}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity=".35"/>
                  <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#cg)"/>
              <polyline points={pts} fill="none" stroke="#34d399" strokeWidth=".9" vectorEffect="non-scaling-stroke" style={{filter:'drop-shadow(0 0 3px #34d399)'}}/>
              {chart.map((_,i)=>i%5===0&&(
                <circle key={i} cx={(i/(chart.length-1))*100} cy={100-((_-minY)/(maxY-minY+.01))*78} r="1.4" fill="#34d399" vectorEffect="non-scaling-stroke"/>
              ))}
            </svg>
            {/* Data flow bar */}
            <div style={{marginTop:14,height:2,background:'rgba(52,211,153,.08)',borderRadius:2,overflow:'hidden',position:'relative'}}>
              <div style={{position:'absolute',width:'30%',height:'100%',background:'linear-gradient(90deg,transparent,#34d399,transparent)',animation:'dataFlow 1.8s linear infinite'}}/>
            </div>
            <div style={{fontSize:10,color:'rgba(52,211,153,.5)',marginTop:5,textAlign:'center',letterSpacing:'.06em'}}>LIVE - Kafka consumer · 1,240 events/s</div>
          </div>

          {/* Event log */}
          <div style={{background:'rgba(7,18,33,.88)',border:'1px solid rgba(255,255,255,.06)',borderRadius:18,padding:'22px 18px',animation:'vLeft .7s cubic-bezier(.22,1,.36,1) .35s both',overflow:'hidden'}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#34d399',animation:'pulse 1s infinite'}}/>
              Live Event Stream
            </div>
            {events.slice(0,6).map((ev)=>(
              <div key={ev.id} style={{padding:'8px 10px',borderRadius:8,marginBottom:7,background:`${ev.c}08`,border:`1px solid ${ev.c}1a`,animation:'typeIn .35s ease both'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                  <span style={{fontSize:9,fontWeight:700,color:ev.c,letterSpacing:'.1em'}}>{ev.t}</span>
                  <span style={{fontSize:9,color:'rgba(232,234,240,.22)'}}>{ev.time}</span>
                </div>
                <div style={{fontSize:10,color:'rgba(232,234,240,.48)',lineHeight:1.55}}>{ev.msg}</div>
              </div>
            ))}
            {events.length===0&&<div style={{color:'rgba(232,234,240,.18)',fontSize:11,paddingTop:16,textAlign:'center'}}>Waiting for events…</div>}
          </div>
        </div>

        {/* Bottom stack */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {[
            {label:'Database Stack', icon:'🗄️', items:['PostgreSQL','MySQL','DynamoDB','FAISS Vector DB','MongoDB','Redis'],      color:'#38bdf8'},
            {label:'Cloud',          icon:'☁️', items:['AWS Lambda','GCP Vertex AI','Azure ML','OpenShift','S3','BigQuery'],       color:'#a78bfa'},
            {label:'CI/CD + MLOps',  icon:'🔁', items:['Jenkins','Terraform','Docker','Kubernetes','MLflow','Weights & Biases'],  color:'#fb923c'},
            {label:'Observability',  icon:'📊', items:['Datadog','Grafana','ELK Stack','PagerDuty','Prometheus','Airflow UI'],    color:'#FFD200'},
          ].map((g,i)=>(
            <div key={i} style={{background:'rgba(7,18,33,.82)',border:`1px solid ${g.color}16`,borderRadius:14,padding:'16px 14px',animation:`vUp .55s cubic-bezier(.22,1,.36,1) ${.4+i*.08}s both`}}>
              <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:10}}>
                <span style={{fontSize:16}}>{g.icon}</span>
                <span style={{fontSize:10,letterSpacing:'.13em',textTransform:'uppercase',color:g.color,fontFamily:"'Syne',sans-serif",fontWeight:700}}>{g.label}</span>
              </div>
              {g.items.map(item=>(
                <div key={item} style={{fontSize:11,color:'rgba(232,234,240,.42)',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,.025)',display:'flex',alignItems:'center',gap:6}}>
                  <span style={{color:g.color,fontSize:8}}>▸</span>{item}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 8px',fontSize:10,color:'rgba(232,234,240,0.18)',letterSpacing:'0.12em',textTransform:'uppercase'}}>© Sathosh Ai RBC-NBA</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 - AGENTIC AI TERMINAL  (purple theme)
// ─────────────────────────────────────────────────────────────────────────────
export function AgentPage({ onBack, onLaunch, onHome }) {
  const [msgs,   setMsgs]   = useState([]);
  const [running,setRunning]= useState(false);
  const [done,   setDone]   = useState(false);
  const [mood,   setMood]   = useState('idle');   // idle | thinking | working | done
  const scrollRef = useRef(null);

  const moodColor = {idle:'#005DAA', thinking:'#a78bfa', working:'#34d399', done:'#FFD200'};

  const steps = [
    {d:0,    type:'sys',   text:'[ATOM Agent v2.4.1] Booting - RBC Next Best Action reasoning engine…'},
    {d:800,  type:'sys',   text:'[Tool: connect_db] Establishing connection to PostgreSQL data warehouse…'},
    {d:1700, type:'sql',   text:'SELECT c.age, c.income_band, p.products,\n       t.txn_90d, t.avg_txn_amt\nFROM   customers c\nJOIN   products   p ON c.id = p.cid\nJOIN   transactions t ON c.id = t.cid\nWHERE  c.id = 82291;'},
    {d:2700, type:'out',   text:'↳ age=34  income=$80k-$120k  products=[Chequing, TFSA]\n  txn_90d=47  avg_txn=$340  last_login=today'},
    {d:3500, type:'sys',   text:'[Tool: spark_features] Submitting PySpark feature-extraction job to cluster…'},
    {d:4400, type:'out',   text:'↳ travel_intent=0.82  savings_propensity=0.71\n  credit_ready=0.68  life_stage="growth"'},
    {d:5200, type:'sys',   text:'[Tool: vector_search] FAISS semantic search - finding top-3 lookalike customers…'},
    {d:6100, type:'out',   text:'↳ Lookalike #1 → converted Avion Visa (3 mo ago)\n  Lookalike #2 → converted Avion Visa (1 mo ago)\n  Lookalike #3 → converted RRSP\n  Signal: HIGH conversion likelihood for Avion'},
    {d:7000, type:'sys',   text:'[Tool: ml_score] Running 14 product propensity models in parallel…'},
    {d:8000, type:'out',   text:'↳ RBC Avion Visa Infinite  → 0.91 ★\n  RRSP Contribution         → 0.74\n  RBC InvestEase            → 0.69\n  RBC FHSA                  → 0.52'},
    {d:9000, type:'sys',   text:'[Tool: experiment_engine] Checking active A/B tests for this segment…'},
    {d:9800, type:'out',   text:'↳ Assigned: Campaign "Avion Spring 2025" Variant B\n  Channel: personalised push + email at 09:00 local'},
    {d:10800,type:'agent', text:'━━ ATOM REASONING COMPLETE ━━\n\nRecommended Action:  RBC Avion Visa Infinite\nChannel:             Push notification + Email\nUrgency:             HIGH  (active travel signals)\nConfidence:          91 %\nExperiment:          Variant B - "Avion Spring 2025"\n\nFiring recommendation to campaign orchestration engine…'},
    {d:12000,type:'sys',   text:'[Airflow DAG] nba_campaign_trigger - task queued ✓  Done.'},
  ];

  const typeColors = {sys:'rgba(232,234,240,.32)',sql:'#38bdf8',out:'#34d399',agent:'#FFD200'};
  const typeLabels = {sys:'SYS',sql:'SQL',out:'OUT',agent:'NBA'};

  const runAgent = () => {
    setMsgs([]); setRunning(true); setDone(false); setMood('thinking');
    steps.forEach((s,i)=>{
      setTimeout(()=>{
        setMsgs(p=>[...p,{...s,id:Date.now()+i}]);
        if(s.type==='sql') setMood('working');
        if(s.type==='agent') setMood('done');
        if(scrollRef.current) scrollRef.current.scrollTop=scrollRef.current.scrollHeight;
      }, s.d);
    });
    setTimeout(()=>{setRunning(false);setDone(true);},steps[steps.length-1].d+600);
  };

  useEffect(()=>{if(scrollRef.current)scrollRef.current.scrollTop=scrollRef.current.scrollHeight;},[msgs]);

  const progress = msgs.length/steps.length;

  /* ── Robot SVG ── */
  const Robot = () => {
    const ec = moodColor[mood];
    return (
      <svg width="140" height="190" viewBox="0 0 140 190"
        style={{animation:mood==='working'?'robotWork 1s ease-in-out infinite':mood==='done'?'floatY 3s ease-in-out infinite':'floatYR 4s ease-in-out infinite',filter:`drop-shadow(0 0 18px ${ec}66)`,transition:'filter .5s'}}>

        {/* rings - only when active */}
        {mood!=='idle'&&[1,2].map(r=>(
          <circle key={r} cx="70" cy="95" r={55+r*22} fill="none" stroke={ec} strokeWidth=".6" opacity={.12-r*.04}
            style={{animation:`spinSlow ${8+r*4}s linear infinite`}}/>
        ))}

        {/* antenna */}
        <line x1="70" y1="10" x2="70" y2="30" stroke={ec} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="70" cy="7" r="5.5" fill={ec} style={{animation:'glow 1.5s ease-in-out infinite'}}/>

        {/* head */}
        <rect x="36" y="30" width="68" height="52" rx="14" fill="#0d2545"/>
        <rect x="40" y="34" width="60" height="44" rx="11" fill="rgba(0,12,30,.9)" stroke={`${ec}2a`} strokeWidth="1"/>

        {/* eyes */}
        <rect x="46" y="46" width="16" height="11" rx="5" fill={ec} style={{filter:`drop-shadow(0 0 7px ${ec})`,animation:mood==='working'?'eyeL 1s ease-in-out infinite':'none'}}/>
        <rect x="78" y="46" width="16" height="11" rx="5" fill={ec} style={{filter:`drop-shadow(0 0 7px ${ec})`,animation:mood==='working'?'eyeL 1s ease-in-out infinite .5s':'none'}}/>
        <circle cx="54" cy="51.5" r="4" fill="white" opacity=".85"/>
        <circle cx="86" cy="51.5" r="4" fill="white" opacity=".85"/>
        <circle cx="54" cy="51.5" r="2" fill="#001a3a"/>
        <circle cx="86" cy="51.5" r="2" fill="#001a3a"/>

        {/* mouth */}
        <path d={mood==='done'?'M48 68 Q70 78 92 68':mood==='thinking'?'M48 70 Q70 70 92 70':'M48 70 Q70 66 92 70'}
          fill="none" stroke={ec} strokeWidth="2.2" strokeLinecap="round" style={{transition:'d .5s'}}/>

        {/* neck */}
        <rect x="62" y="82" width="16" height="11" rx="4" fill={ec} opacity=".8"/>

        {/* body */}
        <rect x="26" y="93" width="88" height="68" rx="15" fill="#0d2545"/>
        <rect x="30" y="97" width="80" height="60" rx="12" fill="rgba(0,12,30,.82)" stroke={`${ec}1a`} strokeWidth="1"/>

        {/* chest panel */}
        <path d="M52 104 L88 104 L88 148 Q70 156 52 148 Z" fill={ec} opacity=".1" stroke={ec} strokeWidth="1"/>
        <text x="70" y="132" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="9" fill={ec}>RBC</text>

        {/* progress lights */}
        {[0,1,2,3].map(i=>(
          <circle key={i} cx={38+i*10} cy="110" r="3.5"
            fill={progress>(i/4)?ec:'#1a2c40'}
            style={{transition:'fill .4s ease',boxShadow:progress>(i/4)?`0 0 6px ${ec}`:'none'}}/>
        ))}

        {/* arms */}
        <rect x="8"  y="97" width="16" height="46" rx="8" fill="#0d2545"/>
        <rect x="116" y="97" width="16" height="46" rx="8" fill="#0d2545"/>
        <circle cx="16"  cy="148" r="9" fill="#0d2545" stroke={`${ec}22`} strokeWidth="1"/>
        <circle cx="124" cy="148" r="9" fill="#0d2545" stroke={`${ec}22`} strokeWidth="1"/>

        {/* legs */}
        <rect x="44" y="161" width="20" height="26" rx="9" fill="#0d2545"/>
        <rect x="76" y="161" width="20" height="26" rx="9" fill="#0d2545"/>
        <rect x="38" y="180" width="32" height="10" rx="5" fill="#0d2545" stroke={`${ec}22`} strokeWidth="1"/>
        <rect x="70" y="180" width="32" height="10" rx="5" fill="#0d2545" stroke={`${ec}22`} strokeWidth="1"/>
      </svg>
    );
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(150deg,#03080f 0%,#0e0718 55%,#03080f 100%)',position:'relative',overflow:'hidden',fontFamily:"'DM Sans',sans-serif",color:'#e8eaf0'}}>
      <SC/><Orbs c1='rgba(124,58,237,.07)' c2='rgba(167,139,250,.04)'/><ScanBeam color='rgba(167,139,250,.3)'/>
      <div style={{position:'fixed',inset:0,zIndex:0,animation:'hexFade 5s ease-in-out infinite',backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='76'%3E%3Cpath d='M22 54L4 44V24L22 14l18 10v20z' fill='none' stroke='%23a78bfa' stroke-width='1'/%3E%3C/svg%3E")`,backgroundSize:'44px 76px'}}/>

      <div style={{position:'relative',zIndex:2,maxWidth:1200,margin:'0 auto',padding:'38px 28px'}}>
        <NavBar accent='#a78bfa' label='Skill Showcase 03 - Agentic AI + LLMs ' onBack={onBack}
          onNext={onLaunch} nextLabel='Launch NBA Engine' onHome={onHome}/>

        <div style={{animation:'vUp .7s cubic-bezier(.22,1,.36,1) .1s both',marginBottom:36}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(28px,4vw,50px)',lineHeight:1.08,background:'linear-gradient(130deg,#fff 0%,#a78bfa 55%,#38bdf8 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',marginBottom:8}}>ATOM<br/>Agentic Reasoning Engine</h1>
          <p style={{fontSize:12,color:'rgba(232,234,240,.35)'}}>LLM orchestration · SQL tool · Spark features · Vector DB · ML scoring · Experiment engine - all in one agent</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'260px 1fr',gap:24}}>

          {/* ── Robot panel ── */}
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{background:'rgba(7,18,33,.92)',border:`1px solid ${moodColor[mood]}2a`,borderRadius:20,padding:'26px 18px',textAlign:'center',transition:'border-color .5s',animation:'vLeft .7s cubic-bezier(.22,1,.36,1) .2s both'}}>
              <div style={{position:'relative',display:'inline-block',marginBottom:10}}>
                <div style={{position:'absolute',inset:-20,borderRadius:'50%',background:`radial-gradient(circle,${moodColor[mood]}1a,transparent)`,animation:'pulse 2s ease-in-out infinite'}}/>
                <Robot/>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13,color:moodColor[mood],marginBottom:3,transition:'color .5s'}}>ATOM Agent</div>
              <div style={{fontSize:10,color:'rgba(232,234,240,.3)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:12}}>
                {mood==='idle'?'Ready':mood==='thinking'?'Planning…':mood==='working'?'Executing tools':'Recommendation ready'}
              </div>
              <div style={{height:3,borderRadius:2,background:'rgba(255,255,255,.06)',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:2,background:moodColor[mood],width:`${progress*100}%`,transition:'width .5s ease,background .5s',boxShadow:`0 0 8px ${moodColor[mood]}`}}/>
              </div>
              <div style={{fontSize:10,color:'rgba(232,234,240,.22)',marginTop:6}}>{msgs.length} / {steps.length} steps</div>
            </div>

            {/* Tool status */}
            <div style={{background:'rgba(7,18,33,.85)',border:'1px solid rgba(167,139,250,.14)',borderRadius:16,padding:'16px 14px',animation:'vLeft .7s cubic-bezier(.22,1,.36,1) .35s both'}}>
              <div style={{fontSize:10,letterSpacing:'.14em',textTransform:'uppercase',color:'#a78bfa',marginBottom:12,fontFamily:"'Syne',sans-serif"}}>Tools</div>
              {[
                {name:'PostgreSQL Query', color:'#38bdf8', key:'sql'},
                {name:'Spark Features',  color:'#34d399', key:'spark'},
                {name:'FAISS Vector DB', color:'#fb923c', key:'vector'},
                {name:'ML Scoring',      color:'#a78bfa', key:'ml'},
                {name:'Campaign Engine', color:'#FFD200', key:'campaign'},
              ].map((t,i)=>{
                const fired = msgs.some(m=>m.type==='sql'&&t.key==='sql' || (m.text||'').toLowerCase().includes(t.key));
                return(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,.03)'}}>
                    <div style={{width:7,height:7,borderRadius:'50%',background:fired?t.color:'#1a2840',transition:'background .4s ease',boxShadow:fired?`0 0 8px ${t.color}`:'none'}}/>
                    <span style={{fontSize:11,color:fired?t.color:'rgba(232,234,240,.22)',transition:'color .4s'}}>{t.name}</span>
                    {fired&&<span style={{marginLeft:'auto',fontSize:9,color:t.color}}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Terminal ── */}
          <div style={{background:'rgba(3,8,18,.97)',border:'1px solid rgba(167,139,250,.18)',borderRadius:20,overflow:'hidden',display:'flex',flexDirection:'column',animation:'vUp .8s cubic-bezier(.22,1,.36,1) .25s both'}}>

            {/* title bar */}
            <div style={{padding:'11px 18px',borderBottom:'1px solid rgba(255,255,255,.05)',display:'flex',alignItems:'center',gap:8,background:'rgba(7,18,33,.9)'}}>
              {['#f87171','#FFD200','#34d399'].map(c=><div key={c} style={{width:11,height:11,borderRadius:'50%',background:c}}/>)}
              <span style={{fontSize:11,color:'rgba(232,234,240,.28)',marginLeft:10,fontFamily:"'DM Mono',monospace",letterSpacing:'.06em'}}>atom-agent - nba-reasoning-engine v2.4.1</span>
              {running&&<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,fontSize:10,color:'#a78bfa'}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#a78bfa',animation:'pulse 1s infinite'}}/>
                running
              </div>}
            </div>

            {/* output */}
            <div ref={scrollRef} style={{flex:1,padding:'18px 18px',overflowY:'auto',minHeight:380,maxHeight:440,fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:1.75}}>
              {msgs.length===0&&(
                <div style={{color:'rgba(232,234,240,.22)'}}>
                  <span>$ atom-agent --mode nba --customer 82291 --verbose</span>
                  <span style={{animation:'blink 1s infinite',marginLeft:4,color:'#a78bfa'}}>█</span>
                </div>
              )}
              {msgs.map((m)=>(
                <div key={m.id} style={{marginBottom:11,animation:'typeIn .3s ease both'}}>
                  <span style={{fontSize:9,letterSpacing:'.1em',marginRight:10,padding:'2px 7px',borderRadius:4,background:`${typeColors[m.type]}14`,border:`1px solid ${typeColors[m.type]}30`,color:typeColors[m.type],fontFamily:"'DM Mono',monospace"}}>
                    {typeLabels[m.type]}
                  </span>
                  <span style={{color:typeColors[m.type],whiteSpace:'pre-wrap'}}>{m.text}</span>
                </div>
              ))}
              {running&&msgs.length>0&&<span style={{animation:'blink 1s infinite',color:'#a78bfa'}}>█</span>}
            </div>

            {/* footer */}
            <div style={{padding:'15px 18px',borderTop:'1px solid rgba(255,255,255,.04)',display:'flex',gap:14,alignItems:'center',background:'rgba(7,18,33,.7)'}}>
              <button onClick={runAgent} disabled={running} style={{padding:'10px 26px',borderRadius:10,border:'none',cursor:running?'not-allowed':'pointer',fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,letterSpacing:'.07em',background:running?'rgba(255,255,255,.04)':'linear-gradient(135deg,#7c3aed,#a78bfa)',color:running?'rgba(232,234,240,.2)':'#fff',boxShadow:running?'none':'0 4px 22px rgba(124,58,237,.4)',transition:'all .3s'}}>
                {running?'↻  Agent running…':done?'↺  Run again':'▶  Run ATOM Agent'}
              </button>
              {done&&<span style={{fontSize:11,color:'#34d399',animation:'vFade .4s ease both'}}>✓ Recommendation fired to campaign engine via Airflow DAG</span>}
            </div>
          </div>
        </div>

        {/* Capabilities row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:22}}>
          {[
            {icon:'🧠',label:'LLM Orchestration',  desc:'sub-second reasoning via multi-tool agent loop',      color:'#a78bfa'},
            {icon:'🗄️',label:'SQL + NoSQL + VectorDB',desc:'PostgreSQL, DynamoDB, MongoDB, FAISS - right store for each job',        color:'#38bdf8'},
            {icon:'☁️',label:'Multi-cloud Deploy',   desc:'AWS Lambda + GCP Vertex AI + Azure ML - portable infra via Terraform',   color:'#34d399'},
            {icon:'',label:'Financial Services',   desc:'AmEx + Capgemini - 2+ yrs in enterprise-scale fintech data engineering', color:'#FFD200'},
          ].map((c,i)=>(
            <div key={i} style={{background:'rgba(7,18,33,.82)',border:`1px solid ${c.color}18`,borderRadius:14,padding:'16px 14px',animation:`vUp .55s cubic-bezier(.22,1,.36,1) ${.45+i*.08}s both`}}>
              <div style={{fontSize:22,marginBottom:8}}>{c.icon}</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:12,color:c.color,marginBottom:6}}>{c.label}</div>
              <div style={{fontSize:11,color:'rgba(232,234,240,.38)',lineHeight:1.6}}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',padding:'28px 0 8px',fontSize:10,color:'rgba(232,234,240,0.18)',letterSpacing:'0.12em',textTransform:'uppercase'}}>© Sathosh Ai RBC-NBA</div>
      </div>
    </div>
  );
}
