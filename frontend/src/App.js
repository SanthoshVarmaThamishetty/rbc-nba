import React, { useState, useEffect, useRef } from 'react';

function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}
import { PipelinePage, DashboardPage, AgentPage } from './ShowcasePages';
import RBCShield from './RBCShield';

// ── GLOBAL KEYFRAMES ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --rbc-blue: #005DAA;
      --rbc-blue-dark: #003d73;
      --rbc-yellow: #FFD200;
      --navy: #03080f;
      --navy-mid: #071221;
      --text: #e8eaf0;
      --text-dim: rgba(232,234,240,0.45);
      --gold: #FFD200;
      --glass: rgba(255,255,255,0.04);
      --glass-border: rgba(255,255,255,0.08);
      --green: #34d399;
    }
    body { font-family: 'DM Sans', sans-serif; background: var(--navy); color: var(--text); overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: rgba(0,93,170,0.4); border-radius: 2px; }

    @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
    @keyframes slideIn   { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes spin      { to{transform:rotate(360deg)} }
    @keyframes pulse2    { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)} 50%{box-shadow:0 0 0 6px rgba(52,211,153,0)} }
    @keyframes borderGlow{ 0%,100%{border-color:rgba(0,93,170,0.2)} 50%{border-color:rgba(0,93,170,0.6)} }
    @keyframes shieldFloat{ 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
    @keyframes shieldGlow { 0%,100%{filter:drop-shadow(0 0 20px rgba(0,93,170,0.5))} 50%{filter:drop-shadow(0 0 50px rgba(0,93,170,0.9)) drop-shadow(0 0 80px rgba(255,210,0,0.3))} }
    @keyframes shield3dFloat {
      0%,100% { transform: perspective(600px) rotateY(-8deg) rotateX(6deg) translateY(0px); filter: drop-shadow(0 8px 28px rgba(0,93,170,0.7)) drop-shadow(-4px 0 12px rgba(0,40,100,0.5)); }
      50%      { transform: perspective(600px) rotateY(8deg)  rotateX(-4deg) translateY(-14px); filter: drop-shadow(0 22px 50px rgba(0,93,170,0.9)) drop-shadow(4px 0 16px rgba(255,210,0,0.3)); }
    }
    @keyframes shieldRingPulse { 0%,100%{opacity:0;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.25)} }
    @keyframes shieldNavFloat  { 0%,100%{filter:drop-shadow(0 4px 12px rgba(0,93,170,0.6)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))} 50%{filter:drop-shadow(0 8px 22px rgba(0,93,170,0.85)) drop-shadow(0 0 18px rgba(255,210,0,0.2))} }
    @keyframes robotFloat{ 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-12px) translateX(4px)} }
    @keyframes robotPulse{ 0%,100%{opacity:0.7} 50%{opacity:1} }
    @keyframes particleRise{ 0%{transform:translateY(0) scale(1);opacity:0.8} 100%{transform:translateY(-120px) scale(0);opacity:0} }
    @keyframes orb1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-30px)} 66%{transform:translate(-20px,40px)} }
    @keyframes orb2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-30px,20px)} 66%{transform:translate(30px,-40px)} }
    @keyframes scanLine { 0%{top:-10%} 100%{top:110%} }
    @keyframes typewriter { from{width:0} to{width:100%} }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes swipeHint { 0%,100%{transform:translateX(0);opacity:0.5} 50%{transform:translateX(14px);opacity:1} }
    @keyframes countUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes gridPulse { 0%,100%{opacity:0.02} 50%{opacity:0.06} }
    @keyframes resultSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  `}</style>
);


// ── ANIMATED ROBOT ────────────────────────────────────────────────────────────
function Robot({ isDragging, dragProgress }) {
  const eyeGlow = `rgba(0,93,170,${0.7 + dragProgress * 0.3})`;
  const bodyGlow = `drop-shadow(0 0 ${10 + dragProgress * 30}px rgba(0,93,170,${0.4 + dragProgress * 0.5})) drop-shadow(0 0 ${20 + dragProgress * 40}px rgba(255,210,0,${dragProgress * 0.4}))`;

  return (
    <svg width="180" height="240" viewBox="0 0 180 240"
      style={{ filter: bodyGlow, animation: isDragging ? 'none' : 'robotFloat 3s ease-in-out infinite', transition: 'filter 0.3s ease', transform: `translateX(${dragProgress * 20}px)` }}>

      {/* Antenna */}
      <line x1="90" y1="18" x2="90" y2="38" stroke="#005DAA" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="90" cy="14" r="6" fill="#FFD200" style={{ animation: 'robotPulse 1.5s ease-in-out infinite' }}/>

      {/* Head */}
      <rect x="52" y="38" width="76" height="58" rx="14" fill="url(#robotBody)"/>
      <rect x="56" y="42" width="68" height="50" rx="11" fill="rgba(0,20,50,0.8)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>

      {/* Eyes */}
      <rect x="65" y="54" width="18" height="14" rx="5" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 8px ${eyeGlow})` }}/>
      <rect x="97" y="54" width="18" height="14" rx="5" fill={eyeGlow} style={{ filter: `drop-shadow(0 0 8px ${eyeGlow})` }}/>
      {/* Pupils */}
      <circle cx="74" cy="61" r="4" fill="white" opacity="0.9"/>
      <circle cx="106" cy="61" r="4" fill="white" opacity="0.9"/>
      <circle cx={74 + dragProgress * 3} cy="61" r="2" fill="#003d73"/>
      <circle cx={106 + dragProgress * 3} cy="61" r="2" fill="#003d73"/>

      {/* Mouth - smiles more as you drag */}
      <path d={`M68 80 Q90 ${82 + dragProgress * 8} 112 80`} fill="none" stroke="#FFD200" strokeWidth="2.5" strokeLinecap="round"/>

      {/* Neck */}
      <rect x="81" y="96" width="18" height="12" rx="4" fill="#005DAA"/>

      {/* Body */}
      <rect x="42" y="108" width="96" height="74" rx="16" fill="url(#robotBody)"/>
      <rect x="46" y="112" width="88" height="66" rx="13" fill="rgba(0,20,50,0.7)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>

      {/* Chest panel */}
      <rect x="60" y="124" width="60" height="38" rx="8" fill="rgba(0,93,170,0.2)" stroke="rgba(0,93,170,0.5)" strokeWidth="1"/>
      {/* RBC mini shield on chest */}
      <path d="M82 128 L98 128 L98 152 Q90 158 82 152 Z" fill="#005DAA" stroke="#FFD200" strokeWidth="1"/>
      <text x="90" y="146" textAnchor="middle" fontFamily="Arial Black" fontWeight="900" fontSize="8" fill="white">RBC</text>

      {/* Side lights */}
      <circle cx="54" cy="132" r="4" fill={dragProgress > 0.3 ? '#FFD200' : '#334'} style={{ transition: 'fill 0.2s' }}/>
      <circle cx="126" cy="132" r="4" fill={dragProgress > 0.3 ? '#FFD200' : '#334'} style={{ transition: 'fill 0.2s' }}/>
      <circle cx="54" cy="146" r="4" fill={dragProgress > 0.6 ? '#34d399' : '#334'} style={{ transition: 'fill 0.2s' }}/>
      <circle cx="126" cy="146" r="4" fill={dragProgress > 0.6 ? '#34d399' : '#334'} style={{ transition: 'fill 0.2s' }}/>

      {/* Arms */}
      <rect x="14" y="112" width="26" height="56" rx="12" fill="url(#robotBody)"/>
      <rect x="140" y="112" width="26" height="56" rx="12" fill="url(#robotBody)"/>
      {/* Hands */}
      <circle cx="27" cy="174" r="10" fill="url(#robotBody)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>
      <circle cx="153" cy="174" r="10" fill="url(#robotBody)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>

      {/* Legs */}
      <rect x="62" y="182" width="24" height="44" rx="10" fill="url(#robotBody)"/>
      <rect x="94" y="182" width="24" height="44" rx="10" fill="url(#robotBody)"/>
      {/* Feet */}
      <rect x="56" y="218" width="36" height="16" rx="8" fill="url(#robotBody)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>
      <rect x="88" y="218" width="36" height="16" rx="8" fill="url(#robotBody)" stroke="rgba(0,93,170,0.4)" strokeWidth="1"/>

      <defs>
        <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d2545"/>
          <stop offset="100%" stopColor="#071830"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  const isMobile = useMobile();
  const [visible, setVisible] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [typedText, setTypedText] = useState('');
  const robotRef = useRef(null);
  const fullText = 'Next Best Action Intelligence Engine';
  const DRAG_THRESHOLD = 140;

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    // Typewriter effect
    let i = 0;
    const timer = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const dragProgress = Math.min(dragX / DRAG_THRESHOLD, 1);

  const onMouseDown = (e) => { setDragStart(e.clientX); setIsDragging(true); };
  const onTouchStart = (e) => { setDragStart(e.touches[0].clientX); setIsDragging(true); };

  const onMouseMove = (e) => {
    if (!isDragging || dragStart === null) return;
    const dx = Math.max(0, e.clientX - dragStart);
    setDragX(dx);
    if (dx >= DRAG_THRESHOLD && !launched) { setLaunched(true); setTimeout(onEnter, 400); }
  };
  const onTouchMove = (e) => {
    if (!isDragging || dragStart === null) return;
    const dx = Math.max(0, e.touches[0].clientX - dragStart);
    setDragX(dx);
    if (dx >= DRAG_THRESHOLD && !launched) { setLaunched(true); setTimeout(onEnter, 400); }
  };
  const onRelease = () => { setIsDragging(false); if (!launched) setDragX(0); };

  const skills = [
    { icon: '⚡', label: 'Agentic AI', color: '#FFD200' },
    { icon: '🧠', label: 'LLM Orchestration', color: '#60a5fa' },
    { icon: '🔁', label: 'Airflow Pipelines', color: '#34d399' },
    { icon: '☁️', label: 'AWS + GCP + Azure', color: '#a78bfa' },
    { icon: '🗄️', label: 'Vector Databases', color: '#fb923c' },
    { icon: '📊', label: 'ML Engineering', color: '#f472b6' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(0,93,170,0.12) 0%, transparent 60%), linear-gradient(160deg, #03080f 0%, #071221 60%, #03080f 100%)'
    }}
      onMouseMove={onMouseMove} onMouseUp={onRelease} onTouchMove={onTouchMove} onTouchEnd={onRelease}
    >
      {/* Grid */}
      <div style={{ position:'fixed', inset:0, zIndex:0, animation:'gridPulse 6s ease-in-out infinite',
        backgroundImage:'linear-gradient(rgba(0,93,170,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,93,170,0.4) 1px, transparent 1px)',
        backgroundSize:'80px 80px' }}/>

      {/* Orbs */}
      <div style={{ position:'fixed', width:600, height:600, borderRadius:'50%', filter:'blur(100px)', background:'rgba(0,93,170,0.08)', top:-150, left:-150, zIndex:0, animation:'orb1 18s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', width:500, height:500, borderRadius:'50%', filter:'blur(90px)', background:'rgba(255,210,0,0.04)', bottom:-100, right:-100, zIndex:0, animation:'orb2 14s ease-in-out infinite', pointerEvents:'none' }}/>

      {/* Scan line */}
      <div style={{ position:'fixed', left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, rgba(0,93,170,0.4), rgba(255,210,0,0.2), transparent)', zIndex:1, animation:'scanLine 8s linear infinite', pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding: isMobile ? '0 16px' : '0 28px' }}>

        {/* ── TOP NAV ── */}
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 0 0',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-16px)', transition:'all 0.7s ease' }}>
          <button onClick={() => window.scrollTo(0,0)} style={{ display:'flex', alignItems:'center', gap:12, background:'none', border:'none', cursor:'pointer', padding:0, textAlign:'left' }}>
            <RBCShield size={44}/>
            <div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:14, letterSpacing:'0.04em', color:'var(--text)' }}>Royal Bank of Canada</div>
              <div style={{ fontSize:10, color:'rgba(232,234,240,0.35)', letterSpacing:'0.14em', textTransform:'uppercase' }}>Data Innovation - Personal Banking</div>
            </div>
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:20,
            background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)', fontSize:11, color:'#34d399', letterSpacing:'0.07em' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#34d399', animation:'pulse2 2s infinite' }}/>
            LIVE ENGINE
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 40, alignItems:'center', minHeight:'calc(100vh - 100px)', padding: isMobile ? '24px 0' : '40px 0' }}>

          {/* Left - text */}
          <div>
            <div style={{ opacity: visible ? 1 : 0, transition:'all 0.7s ease 0.2s' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:20,
                background:'rgba(255,210,0,0.08)', border:'1px solid rgba(255,210,0,0.2)',
                fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'#FFD200', marginBottom:28 }}>
                NBA Team - Personal Banking
              </div>
            </div>

            {/* Typewriter heading */}
            <div style={{ opacity: visible ? 1 : 0, transition:'opacity 0.5s ease 0.3s' }}>
              <h1 style={{ fontFamily:'Syne, sans-serif', fontWeight:800,
                fontSize:'clamp(32px, 4.5vw, 56px)', lineHeight:1.08, marginBottom:6,
                background:'linear-gradient(135deg, #ffffff 0%, #a8c8f0 40%, #FFD200 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {typedText}
                <span style={{ animation:'blink 1s infinite', WebkitTextFillColor:'#FFD200' }}>|</span>
              </h1>
            </div>

            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition:'all 0.8s ease 0.5s' }}>
              <p style={{ fontSize:15, color:'rgba(232,234,240,0.5)', lineHeight:1.75, marginBottom:10, maxWidth:460 }}>
                Delivering real-time ML pipeline recommendations powered by <span style={{color:'#FFD200', fontWeight:500}}>Agentic AI, Python </span> and SQL, with Spark and Airflow at its core.
              </p>
              <p style={{ fontSize:12, color:'rgba(232,234,240,0.25)', letterSpacing:'0.06em', marginBottom:36 }}>
                 MySQL · PostgreSQL · Vector DB · NoSQL · Kafka · CI/CD · MLOps 
              </p>
            </div>

            {/* Skills chips */}
            <div style={{ opacity: visible ? 1 : 0, transition:'all 0.8s ease 0.65s', marginBottom:40 }}>
              <div style={{ fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(232,234,240,0.3)', marginBottom:12 }}>
                Skills Demonstrated
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {skills.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:20,
                    background:'rgba(255,255,255,0.03)', border:`1px solid ${s.color}33`,
                    fontSize:12, color: s.color, animation:`countUp 0.5s ease ${0.7 + i * 0.08}s both` }}>
                    <span style={{ fontSize:13 }}>{s.icon}</span>{s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div style={{ opacity: visible ? 1 : 0, transition:'all 0.8s ease 0.8s', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: isMobile ? 8 : 12 }}>
              {[
                { v:'17M+', l:'RBC Clients' },
                { v:'1.1B+', l:'NOMI Insights' },
                { v:'$700M', l:'AI Value Target' },
              ].map((s, i) => (
                <div key={i} style={{ background:'rgba(0,93,170,0.08)', border:'1px solid rgba(0,93,170,0.2)', borderRadius:12, padding:'14px 12px', textAlign:'center' }}>
                  <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:20, color:'#FFD200' }}>{s.v}</div>
                  <div style={{ fontSize:10, color:'rgba(232,234,240,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Journey steps */}
            <div style={{ opacity: visible ? 1 : 0, transition:'all 0.8s ease 1s', marginTop:20 }}>
              <div style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(232,234,240,0.25)', marginBottom:10 }}>What's inside</div>
              <div style={{ display:'flex', gap:8 }}>
                {[
                  { n:'01', label:'ML Pipeline', color:'#38bdf8' },
                  { n:'02', label:'Live Dashboard', color:'#34d399' },
                  { n:'03', label:'Agentic AI', color:'#a78bfa' },
                  { n:'04', label:'NBA Engine', color:'#FFD200' },
                ].map((step,i) => (
                  <div key={i} style={{ flex:1, padding:'8px 6px', borderRadius:8, textAlign:'center',
                    background:`${step.color}0a`, border:`1px solid ${step.color}22` }}>
                    <div style={{ fontSize:9, color:step.color, fontWeight:700, letterSpacing:'.1em' }}>{step.n}</div>
                    <div style={{ fontSize:9, color:'rgba(232,234,240,.35)', marginTop:2 }}>{step.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Robot drag interaction */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition:'all 0.9s ease 0.4s' }}>

            {/* Drag track */}
            <div style={{ position:'relative', width:'100%', maxWidth: isMobile ? '100%' : 360, marginBottom: isMobile ? 16 : 32 }}>

              {/* Track background */}
              <div style={{ position:'relative', height:90, borderRadius:45,
                background:'rgba(0,93,170,0.08)', border:'1px solid rgba(0,93,170,0.25)',
                display:'flex', alignItems:'center', padding:'0 8px', cursor:'grab', overflow:'hidden',
                boxShadow:`0 0 ${20 + dragProgress * 40}px rgba(0,93,170,${0.1 + dragProgress * 0.3}), inset 0 0 30px rgba(0,93,170,0.05)` }}>

                {/* Progress fill */}
                <div style={{ position:'absolute', left:0, top:0, bottom:0,
                  width:`${Math.max(8, dragProgress * 100)}%`, borderRadius:45,
                  background:`linear-gradient(90deg, rgba(0,93,170,${0.2 + dragProgress * 0.3}), rgba(255,210,0,${dragProgress * 0.2}))`,
                  transition: isDragging ? 'none' : 'width 0.4s ease' }}/>

                {/* Destination icon */}
                <div style={{ position:'absolute', right:16, fontSize:22, opacity: 0.4 + dragProgress * 0.6,
                  transform:`scale(${1 + dragProgress * 0.3})`, transition:'all 0.2s' }}>🚀</div>

                {/* Draggable robot thumb */}
                <div ref={robotRef}
                  onMouseDown={onMouseDown} onTouchStart={onTouchStart}
                  style={{ position:'relative', zIndex:2,
                    transform:`translateX(${Math.min(dragX, 270)}px)`,
                    transition: isDragging ? 'none' : 'transform 0.4s ease',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect:'none', touchAction:'none' }}>
                  <div style={{ width:74, height:74, borderRadius:'50%', overflow:'hidden',
                    background:'rgba(0,20,50,0.9)', border:`2px solid rgba(0,93,170,${0.4 + dragProgress * 0.6})`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:`0 0 ${10 + dragProgress * 30}px rgba(0,93,170,0.6), 0 0 ${dragProgress * 20}px rgba(255,210,0,0.3)` }}>
                    <span style={{ fontSize:36 }}>🤖</span>
                  </div>
                </div>

                {/* Swipe hint text */}
                {dragProgress < 0.1 && (
                  <div style={{ position:'absolute', left:96, right:50, display:'flex', alignItems:'center', gap:6,
                    fontSize:13, color:'rgba(232,234,240,0.4)', pointerEvents:'none' }}>
                    <span style={{ animation:'swipeHint 1.5s ease-in-out infinite' }}>→</span>
                    <span>{isMobile ? 'Swipe right to launch' : 'Swipe to launch'}</span>
                  </div>
                )}
                {dragProgress >= 0.1 && dragProgress < 1 && (
                  <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', fontSize:11,
                    color:'#FFD200', pointerEvents:'none', whiteSpace:'nowrap' }}>
                    {Math.round(dragProgress * 100)}% - keep going...
                  </div>
                )}
                {dragProgress >= 1 && (
                  <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', fontSize:13,
                    color:'#34d399', fontWeight:600, pointerEvents:'none', whiteSpace:'nowrap' }}>
                    Launching...
                  </div>
                )}
              </div>
            </div>

            {/* Big robot */}
            <div style={{ transform:`translateX(${dragProgress * 30}px)`, transition: isDragging ? 'none' : 'transform 0.4s ease', transform: isMobile ? `translateX(${dragProgress * 30}px) scale(0.75)` : `translateX(${dragProgress * 30}px)` }}>
              <Robot isDragging={isDragging} dragProgress={dragProgress}/>
            </div>

            {/* Mobile tap-to-launch button */}
            {isMobile && (
              <button onClick={onEnter} style={{ marginTop:8, padding:'14px 40px', borderRadius:12, border:'none', cursor:'pointer',
                fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:15, letterSpacing:'0.07em',
                background:'linear-gradient(135deg, #FFD200, #e6a800)', color:'#03080f',
                boxShadow:'0 4px 24px rgba(255,210,0,0.3)' }}>
                Launch Engine 🚀
              </button>
            )}

          </div>
        </div>
        <div style={{ textAlign:'center', padding:'28px 0 8px', fontSize:10, color:'rgba(232,234,240,0.18)', letterSpacing:'0.12em', textTransform:'uppercase' }}>© Sathosh Ai RBC-NBA</div>
      </div>
    </div>
  );
}

// ── ENGINE PAGE ───────────────────────────────────────────────────────────────
function EnginePage({ onBack, onHome }) {
  const isMobile = useMobile();
  const [form, setForm] = useState({
    age: 32, income: '$40,000 - $80,000', products: ['Chequing'],
    lifeEvent: 'None', behaviour: 'Regular spender', activity: '',
  });
  const [phase, setPhase] = useState('form');
  const [result, setResult] = useState(null);
  const [loaderStep, setLoaderStep] = useState(0);
  const [error, setError] = useState('');

  const loaderSteps = [
    'Ingesting customer profile into context window...',
    'Running propensity feature extraction pipeline...',
    'Querying ATOM foundation model for scoring...',
    'Evaluating product catalogue match signals...',
    'Generating personalised NBA recommendation...',
  ];

  const productList = ['Chequing','Savings','Credit Card','Mortgage','TFSA','RRSP','FHSA','Auto Loan','Line of Credit','GIC','InvestEase','Direct Investing'];

  const toggleProduct = (p) => setForm(f => ({
    ...f, products: f.products.includes(p) ? f.products.filter(x => x !== p) : [...f.products, p]
  }));

  const analyze = async () => {
    setPhase('loading'); setLoaderStep(0); setError('');
    const interval = setInterval(() => setLoaderStep(s => Math.min(s + 1, loaderSteps.length - 1)), 700);
    try {
      const res = await fetch('/api/analyze', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ age: form.age, income: form.income, products: form.products.join(', ') || 'None', lifeEvent: form.lifeEvent, behaviour: form.behaviour, activity: form.activity }),
      });
      const json = await res.json();
      clearInterval(interval);
      if (json.success) { setTimeout(() => { setResult(json.data); setPhase('result'); }, 400); }
      else { setError(json.error || 'API error'); setPhase('form'); }
    } catch (e) {
      clearInterval(interval);
      setError('Cannot reach backend. Make sure server is running on port 3001.');
      setPhase('form');
    }
  };

  const urgencyColor = { High:'#f87171', Medium:'#FFD200', Low:'#34d399' };
  const categoryColor = { Savings:'#34d399', Credit:'#60a5fa', Borrowing:'#f87171', Investing:'#a78bfa', Insurance:'#fb923c', Retirement:'#FFD200', Accounts:'#94a3b8' };

  const Card = ({ children, style }) => (
    <div style={{ background:'rgba(7,18,33,0.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(0,93,170,0.2)', borderRadius:18, padding:28, ...style }}>
      {children}
    </div>
  );

  const SLabel = ({ children }) => (
    <div style={{ fontFamily:'Syne, sans-serif', fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'#005DAA', marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
      {children}<div style={{ flex:1, height:1, background:'linear-gradient(90deg, rgba(0,93,170,0.4), transparent)' }}/>
    </div>
  );

  const FLabel = ({ children }) => (
    <div style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(232,234,240,0.35)', marginBottom:8, fontWeight:500 }}>{children}</div>
  );

  const selectStyle = { background:'rgba(0,20,50,0.7)', border:'1px solid rgba(0,93,170,0.25)', borderRadius:10, padding:'11px 14px', color:'#e8eaf0', fontFamily:'DM Sans, sans-serif', fontSize:14, outline:'none', width:'100%', cursor:'pointer' };

  return (
    <div style={{ minHeight:'100vh', position:'relative', overflowX:'hidden',
      background:'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0,93,170,0.08) 0%, transparent 60%), linear-gradient(160deg, #03080f 0%, #071221 50%, #03080f 100%)' }}>
      <div style={{ position:'fixed', inset:0, zIndex:0, opacity:0.025,
        backgroundImage:'linear-gradient(rgba(0,93,170,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,93,170,0.5) 1px, transparent 1px)',
        backgroundSize:'60px 60px' }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:1040, margin:'0 auto', padding: isMobile ? '0 16px 60px' : '0 24px 80px' }}>

        {/* Header */}
        <header style={{ padding:'24px 0 18px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(0,93,170,0.15)', marginBottom:36, animation:'fadeUp 0.6s ease both' }}>
          <button onClick={onHome} style={{ display:'flex', alignItems:'center', gap:12, background:'none', border:'none', cursor:'pointer', padding:0, textAlign:'left' }}>
            <RBCShield size={38}/>
            <div>
              <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize: isMobile ? 12 : 14, color:'var(--text)' }}>Next Best Action Engine</div>
              {!isMobile && <div style={{ fontSize:10, color:'rgba(232,234,240,0.35)', letterSpacing:'0.1em', textTransform:'uppercase', marginTop:1 }}>Data Innovation - Personal Banking</div>}
            </div>
          </button>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'5px 12px', borderRadius:20, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)', fontSize:11, color:'#34d399' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#34d399', animation:'pulse2 2s infinite' }}/>LIVE
            </div>
            <button onClick={onBack} style={{ background:'rgba(0,93,170,0.1)', border:'1px solid rgba(0,93,170,0.25)', color:'rgba(232,234,240,0.5)', borderRadius:8, padding:'6px 14px', fontSize:12, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>Back</button>
          </div>
        </header>

        {/* FORM */}
        {phase === 'form' && (
          <div style={{ animation:'fadeUp 0.7s ease 0.1s both' }}>
            {error && <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:20, fontSize:13, color:'#f87171' }}>{error}</div>}
            <Card>
              <SLabel>Customer Profile Input</SLabel>
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:20 }}>
                <div>
                  <FLabel>Customer Age</FLabel>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <input type="range" min={18} max={75} value={form.age} onChange={e => setForm(f => ({...f, age:+e.target.value}))} style={{ flex:1, accentColor:'#FFD200', cursor:'pointer' }}/>
                    <span style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:22, color:'#FFD200', minWidth:36 }}>{form.age}</span>
                  </div>
                </div>
                <div>
                  <FLabel>Annual Income</FLabel>
                  <select value={form.income} onChange={e => setForm(f => ({...f, income:e.target.value}))} style={selectStyle}>
                    {['Under $40,000','$40,000 - $80,000','$80,000 - $120,000','$120,000 - $200,000','Over $200,000'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1 / -1' }}>
                  <FLabel>Current RBC Products</FLabel>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {productList.map(p => (
                      <button key={p} onClick={() => toggleProduct(p)} style={{ padding:'6px 14px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:'DM Sans, sans-serif',
                        border: form.products.includes(p) ? '1px solid rgba(255,210,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        background: form.products.includes(p) ? 'rgba(255,210,0,0.12)' : 'rgba(255,255,255,0.03)',
                        color: form.products.includes(p) ? '#FFD200' : 'rgba(232,234,240,0.4)',
                        transition:'all 0.2s ease' }}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <FLabel>Life Event</FLabel>
                  <select value={form.lifeEvent} onChange={e => setForm(f => ({...f, lifeEvent:e.target.value}))} style={selectStyle}>
                    {['None','Recently married','New baby','Bought a home','Started a business','Recently graduated','Approaching retirement','Job change - promotion','Newcomer to Canada'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <FLabel>Banking Behaviour</FLabel>
                  <select value={form.behaviour} onChange={e => setForm(f => ({...f, behaviour:e.target.value}))} style={selectStyle}>
                    {['Regular spender','Occasional transactions','Heavy credit user','Consistent saver','Investor profile','Business owner pattern','Student - low activity'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn:'1 / -1' }}>
                  <FLabel>Recent Activity - Branch Notes (optional)</FLabel>
                  <textarea value={form.activity} onChange={e => setForm(f => ({...f, activity:e.target.value}))}
                    placeholder="e.g. Asked about travel rewards last visit, 3 large international purchases last month..."
                    style={{ ...selectStyle, resize:'vertical', minHeight:76 }}/>
                </div>
              </div>
              <button onClick={analyze} style={{ marginTop:24, width:'100%', padding:'16px', borderRadius:12, border:'none', cursor:'pointer',
                fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:14, letterSpacing:'0.07em',
                background:'linear-gradient(135deg, #FFD200, #e6a800)', color:'#03080f',
                boxShadow:'0 4px 24px rgba(255,210,0,0.25)', transition:'all 0.3s ease' }}>
                Generate Next Best Action
              </button>
            </Card>
          </div>
        )}

        {/* LOADING */}
        {phase === 'loading' && (
          <div style={{ display:'flex', justifyContent:'center', paddingTop:60, animation:'fadeIn 0.4s ease' }}>
            <Card style={{ maxWidth:460, width:'100%', textAlign:'center' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', border:'2px solid rgba(0,93,170,0.2)', borderTopColor:'#FFD200', animation:'spin 0.8s linear infinite', margin:'0 auto 18px' }}/>
              <div style={{ fontFamily:'Syne, sans-serif', fontSize:15, marginBottom:4 }}>Analysing Customer Profile</div>
              <div style={{ fontSize:12, color:'rgba(232,234,240,0.3)', marginBottom:24 }}>NBA engine processing...</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-start' }}>
                {loaderSteps.map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:12,
                    opacity: i <= loaderStep ? 1 : 0.2, transition:'opacity 0.4s ease',
                    color: i < loaderStep ? '#34d399' : i === loaderStep ? '#FFD200' : 'rgba(232,234,240,0.3)' }}>
                    <span>{i < loaderStep ? '+ ' : i === loaderStep ? '- ' : '  '}</span>{s}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && result && (
          <div style={{ animation:'resultSlide 0.6s ease both' }}>
            <Card>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
                <SLabel>AI Recommendation - NBA Engine</SLabel>
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 14px', borderRadius:20, background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.2)', fontSize:11, color:'#34d399' }}>
                  Analysis Complete
                </div>
              </div>

              {/* Product hero */}
              <div style={{ textAlign:'center', padding:'32px 24px', background:'linear-gradient(135deg, rgba(0,93,170,0.08), rgba(255,210,0,0.03))', border:'1px solid rgba(0,93,170,0.2)', borderRadius:14, marginBottom:20, animation:'borderGlow 4s ease infinite', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', width:160, height:160, borderRadius:'50%', background:'radial-gradient(rgba(0,93,170,0.12), transparent)', top:-50, right:-30, pointerEvents:'none' }}/>
                {result.product_category && (
                  <div style={{ display:'inline-block', padding:'3px 12px', borderRadius:20, marginBottom:12,
                    background:`${(categoryColor[result.product_category] || '#FFD200')}18`,
                    border:`1px solid ${(categoryColor[result.product_category] || '#FFD200')}44`,
                    fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
                    color: categoryColor[result.product_category] || '#FFD200' }}>
                    {result.product_category}
                  </div>
                )}
                <div style={{ fontFamily:'Syne, sans-serif', fontWeight:800, fontSize:'clamp(18px,3.5vw,30px)',
                  background:'linear-gradient(135deg, #ffffff, #FFD200)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:12 }}>
                  {result.recommended_product}
                </div>
                <p style={{ fontSize:14, color:'rgba(232,234,240,0.55)', lineHeight:1.7, maxWidth:520, margin:'0 auto 16px' }}>{result.reason}</p>
                {result.nomi_insight && (
                  <div style={{ display:'inline-flex', gap:12, alignItems:'flex-start', background:'linear-gradient(135deg, rgba(255,210,0,0.08), rgba(0,93,170,0.06))', border:'1px solid rgba(255,210,0,0.28)', borderRadius:12, padding:'14px 18px', maxWidth:500, textAlign:'left', boxShadow:'0 0 18px rgba(255,210,0,0.07)' }}>
                    <span style={{ fontSize:20, lineHeight:1, flexShrink:0 }}>💬</span>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:'0.16em', textTransform:'uppercase', color:'#FFD200', marginBottom:5, fontFamily:'Syne, sans-serif', fontWeight:700 }}>NOMI says</div>
                      <div style={{ fontSize:13, color:'rgba(232,234,240,0.92)', lineHeight:1.65, fontStyle:'italic' }}>{result.nomi_insight}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
                {[
                  { icon:'🎯', label:'Urgency', value:result.urgency, color:urgencyColor[result.urgency] },
                  { icon:'📊', label:'Confidence', value:result.confidence, color:'#FFD200' },
                  { icon:'💎', label:'Revenue Potential', value:result.revenue_potential, color:urgencyColor[result.revenue_potential] },
                ].map((m, i) => (
                  <div key={i} style={{ background:'rgba(0,20,50,0.5)', border:'1px solid rgba(0,93,170,0.15)', borderRadius:12, padding:'16px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:18, marginBottom:6 }}>{m.icon}</div>
                    <div style={{ fontSize:9, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(232,234,240,0.3)', marginBottom:5 }}>{m.label}</div>
                    <div style={{ fontFamily:'Syne, sans-serif', fontWeight:700, fontSize:14, color:m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              {result.urgency_reason && (
                <div style={{ background:'rgba(0,20,50,0.5)', border:'1px solid rgba(0,93,170,0.2)', borderRadius:12, padding:'12px 16px', marginBottom:18, display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:16, lineHeight:1 }}>💡</span>
                  <div>
                    <div style={{ fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'#60a5fa', marginBottom:4, fontFamily:'Syne, sans-serif' }}>Advisor Insight</div>
                    <span style={{ fontSize:13, color:'rgba(232,234,240,0.85)', lineHeight:1.6 }}>{result.urgency_reason}</span>
                  </div>
                </div>
              )}

              {/* Talking points */}
              <div style={{ background:'rgba(0,20,50,0.5)', border:'1px solid rgba(0,93,170,0.2)', borderRadius:14, padding:22, marginBottom:18 }}>
                <div style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#005DAA', marginBottom:14, fontFamily:'Syne, sans-serif' }}>Banker Talking Points</div>
                {(result.talking_points || []).map((p, i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 0', borderBottom: i < (result.talking_points.length - 1) ? '1px solid rgba(0,93,170,0.12)' : 'none', fontSize:13, color:'rgba(232,234,240,0.88)', lineHeight:1.65, animation:`slideIn 0.4s ease ${i * 0.1}s both` }}>
                    <div style={{ minWidth:22, height:22, borderRadius:'50%', background:'rgba(0,93,170,0.22)', border:'1px solid rgba(0,93,170,0.45)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#60a5fa', marginTop:2, flexShrink:0 }}>{i+1}</div>
                    {p}
                  </div>
                ))}
              </div>

              {/* Bottom row — Next Action + Cross-Sell */}
              <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14, marginBottom:14 }}>
                <div style={{ background:'rgba(0,60,140,0.18)', border:'1px solid rgba(96,165,250,0.3)', borderRadius:14, padding:'18px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                    <span style={{ fontSize:14 }}>📋</span>
                    <div style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'#60a5fa', fontFamily:'Syne, sans-serif', fontWeight:700 }}>Next Action for Advisor</div>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(232,234,240,0.9)', lineHeight:1.65 }}>{result.next_action}</div>
                </div>
                <div style={{ background:'rgba(52,211,153,0.08)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:14, padding:'18px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                    <span style={{ fontSize:14 }}>🔗</span>
                    <div style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'#34d399', fontFamily:'Syne, sans-serif', fontWeight:700 }}>Cross-Sell Opportunity</div>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(232,234,240,0.9)', lineHeight:1.65 }}>{result.cross_sell}</div>
                </div>
              </div>

              {/* Experiment hypothesis */}
              {result.experiment_hypothesis && (
                <div style={{ background:'rgba(255,210,0,0.06)', border:'1px solid rgba(255,210,0,0.22)', borderRadius:14, padding:'18px 16px', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                    <span style={{ fontSize:14 }}>🧪</span>
                    <div style={{ fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:'#FFD200', fontFamily:'Syne, sans-serif', fontWeight:700 }}>A/B Test Hypothesis</div>
                  </div>
                  <div style={{ fontSize:13, color:'rgba(232,234,240,0.88)', lineHeight:1.65, fontStyle:'italic' }}>"{result.experiment_hypothesis}"</div>
                </div>
              )}

              {result.risk_flag && result.risk_flag !== 'none' && (
                <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.25)', borderRadius:12, padding:'12px 16px', fontSize:13, color:'rgba(248,113,113,0.9)', display:'flex', gap:8, alignItems:'center', marginBottom:14 }}>
                  <span style={{ fontSize:15 }}>⚠️</span><span><strong>Risk Flag: </strong>{result.risk_flag}</span>
                </div>
              )}

              <button onClick={() => setPhase('form')} style={{ marginTop:6, width:'100%', padding:'13px', borderRadius:10, border:'1px solid rgba(255,210,0,0.3)', background:'rgba(255,210,0,0.07)', color:'#FFD200', cursor:'pointer', fontFamily:'DM Sans, sans-serif', fontSize:13, fontWeight:500, letterSpacing:'0.03em', transition:'all 0.2s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span style={{ fontSize:15 }}>←</span> Analyze Another Client
              </button>
            </Card>
          </div>
        )}
        <div style={{ textAlign:'center', padding:'28px 0 8px', fontSize:10, color:'rgba(232,234,240,0.18)', letterSpacing:'0.12em', textTransform:'uppercase' }}>© Sathosh Ai RBC-NBA</div>
      </div>
    </div>
  );
}

// ── ROOT — 5-PAGE FLOW ────────────────────────────────────────────────────────
// landing → pipeline → dashboard → agent → engine
export default function App() {
  const [page, setPage] = useState('landing');
  const go = (p) => { window.scrollTo(0,0); setPage(p); };
  return (
    <>
      <GlobalStyles/>
      {page === 'landing'   && <LandingPage  onEnter={()=>go('pipeline')}/>}
      {page === 'pipeline'  && <PipelinePage  onBack={()=>go('landing')}   onNext={()=>go('dashboard')} onHome={()=>go('landing')}/>}
      {page === 'dashboard' && <DashboardPage onBack={()=>go('pipeline')}  onNext={()=>go('agent')}     onHome={()=>go('landing')}/>}
      {page === 'agent'     && <AgentPage     onBack={()=>go('dashboard')} onLaunch={()=>go('engine')}  onHome={()=>go('landing')}/>}
      {page === 'engine'    && <EnginePage    onBack={()=>go('agent')}     onHome={()=>go('landing')}/>}
    </>
  );
}
