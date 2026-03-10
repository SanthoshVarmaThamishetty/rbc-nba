import React from 'react';

// ── RBC SHIELD SVG — 3D Animated, matches real RBC brand logo ─────────────────
export default function RBCShield({ size = 80, animate = false }) {
  const uid = `rbc${size}`; // unique gradient IDs per instance
  const w = size, h = size * 1.32;
  return (
    <div style={{
      display: 'inline-block', position: 'relative',
      animation: animate ? 'shield3dFloat 5s ease-in-out infinite' : 'shieldNavFloat 4s ease-in-out infinite',
      transformStyle: 'preserve-3d',
    }}>
      {/* Ambient glow ring behind shield */}
      {animate && (
        <div style={{
          position: 'absolute', inset: -size * 0.3, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,93,170,0.25) 0%, rgba(255,210,0,0.08) 50%, transparent 70%)',
          animation: 'shieldRingPulse 3s ease-in-out infinite', pointerEvents: 'none', zIndex: 0,
        }}/>
      )}
      <svg width={w} height={h} viewBox="0 0 200 264" style={{ position: 'relative', zIndex: 1, overflow: 'visible' }}>
        <defs>
          {/* Shield face gradient — bright left, dark right for 3D */}
          <linearGradient id={`${uid}SG`} x1="0%" y1="0%" x2="100%" y2="110%">
            <stop offset="0%"   stopColor="#1a88d8"/>
            <stop offset="30%"  stopColor="#0066BB"/>
            <stop offset="65%"  stopColor="#004A94"/>
            <stop offset="100%" stopColor="#002d60"/>
          </linearGradient>
          {/* Right-edge 3D side */}
          <linearGradient id={`${uid}Side`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#003268"/>
            <stop offset="100%" stopColor="#001640"/>
          </linearGradient>
          {/* Highlight overlay */}
          <radialGradient id={`${uid}HL`} cx="28%" cy="18%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.22)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
          {/* Lion gold gradient */}
          <linearGradient id={`${uid}LG`} x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%"   stopColor="#FFE84D"/>
            <stop offset="45%"  stopColor="#FFD200"/>
            <stop offset="100%" stopColor="#BF9800"/>
          </linearGradient>
          {/* Lion glow filter */}
          <filter id={`${uid}LGlow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
          {/* Shield drop shadow */}
          <filter id={`${uid}DSh`} x="-15%" y="-10%" width="135%" height="135%">
            <feDropShadow dx="4" dy="6" stdDeviation="5" floodColor="rgba(0,0,0,0.55)"/>
          </filter>
        </defs>

        {/* ── 3D RIGHT EDGE ── */}
        <path d="M188,16 L196,10 L196,150 Q196,218 100,238 L93,244 Q187,223 188,150 Z"
          fill={`url(#${uid}Side)`} opacity="0.9"/>
        {/* ── 3D BOTTOM EDGE ── */}
        <path d="M12,150 Q12,218 100,238 L93,244 Q4,222 6,150 Z"
          fill="#001435" opacity="0.7"/>

        {/* ── MAIN SHIELD FACE ── */}
        <path d="M12,10 H188 Q194,10 194,18 V150 Q194,218 100,236 Q6,218 6,150 V18 Q6,10 12,10 Z"
          fill={`url(#${uid}SG)`} filter={`url(#${uid}DSh)`}/>

        {/* ── SPECULAR HIGHLIGHT (3D gloss) ── */}
        <path d="M12,10 H188 Q194,10 194,18 V150 Q194,218 100,236 Q6,218 6,150 V18 Q6,10 12,10 Z"
          fill={`url(#${uid}HL)`}/>

        {/* ── GOLD OUTER BORDER ── */}
        <path d="M12,10 H188 Q194,10 194,18 V150 Q194,218 100,236 Q6,218 6,150 V18 Q6,10 12,10 Z"
          fill="none" stroke="#FFD200" strokeWidth="5" strokeLinejoin="round"/>
        {/* ── GOLD INNER BORDER ── */}
        <path d="M22,20 H178 Q182,20 182,26 V148 Q182,207 100,222 Q18,207 18,148 V26 Q18,20 22,20 Z"
          fill="none" stroke="rgba(255,210,0,0.32)" strokeWidth="1.5"/>

        {/* ══════════════ HERALDIC LION ══════════════ */}
        <g fill={`url(#${uid}LG)`} filter={`url(#${uid}LGlow)`}>

          {/* ── Tail (behind body) ── */}
          <path d="M130,148 Q158,130 162,106 Q166,86 154,80 Q145,76 140,86 Q136,96 128,110"
            fill="none" stroke={`url(#${uid}LG)`} strokeWidth="9" strokeLinecap="round"/>
          <circle cx="154" cy="79" r="11"/>
          <circle cx="148" cy="72" r="7"/>

          {/* ── Torso ── */}
          <ellipse cx="97" cy="142" rx="30" ry="38"/>

          {/* ── Hind quarter ── */}
          <ellipse cx="108" cy="165" rx="24" ry="22"/>

          {/* ── Hind legs ── */}
          <ellipse cx="82" cy="182" rx="11" ry="24"/>
          <ellipse cx="118" cy="182" rx="11" ry="24"/>
          <ellipse cx="76"  cy="201" rx="16" ry="9"/>
          <ellipse cx="122" cy="201" rx="16" ry="9"/>

          {/* ── Neck ── */}
          <rect x="84" y="104" width="26" height="22" rx="10"/>

          {/* ── HEAD ── */}
          <circle cx="96" cy="80" r="24"/>

          {/* ── MANE (radial petals) ── */}
          {[0,28,57,86,115,144,173,202,231,260,289,318].map((a,i)=>{
            const r=Math.PI*a/180, cx=96+Math.cos(r)*28, cy=80+Math.sin(r)*28;
            return <ellipse key={i} cx={cx} cy={cy} rx="10" ry="15"
              transform={`rotate(${a} ${cx} ${cy})`} opacity="0.93"/>;
          })}

          {/* ── Right raised arm (holding globe) ── */}
          <ellipse cx="122" cy="122" rx="10" ry="20" transform="rotate(-28 122 122)"/>
          <ellipse cx="136" cy="100" rx="9"  ry="16" transform="rotate(-55 136 100)"/>

          {/* ── Left arm (down) ── */}
          <ellipse cx="70" cy="135" rx="9" ry="20" transform="rotate(18 70 135)"/>
          <ellipse cx="65" cy="155" rx="13" ry="8"/>

          {/* ── Crown ── */}
          <rect x="79" y="49" width="36" height="11" rx="2"/>
          <polygon points="79,49 79,36 87,49"/>
          <polygon points="115,49 115,36 107,49"/>
          <path d="M97,49 L93,33 L101,33 Z"/>
          <circle cx="79"  cy="35" r="3.5" opacity="0.95"/>
          <circle cx="115" cy="35" r="3.5" opacity="0.95"/>
          <circle cx="97"  cy="31" r="4"   opacity="0.95"/>
        </g>

        {/* ── GLOBE (in raised paw) ── */}
        <circle cx="141" cy="83" r="19" fill={`url(#${uid}LG)`}/>
        <circle cx="141" cy="83" r="19" fill="none" stroke="#003d73" strokeWidth="2.2"/>
        <ellipse cx="141" cy="83" rx="10" ry="19" fill="none" stroke="#003d73" strokeWidth="1.4"/>
        <line x1="122" y1="83" x2="160" y2="83" stroke="#003d73" strokeWidth="1.4"/>
        <line x1="124" y1="73" x2="158" y2="73" stroke="#003d73" strokeWidth="0.9"/>
        <line x1="124" y1="93" x2="158" y2="93" stroke="#003d73" strokeWidth="0.9"/>
        {/* Globe highlight */}
        <ellipse cx="135" cy="75" rx="6" ry="4" fill="rgba(255,255,255,0.25)" transform="rotate(-30 135 75)"/>

        {/* ── LION EYES ── */}
        <circle cx="87"  cy="76" r="5.5" fill="white" opacity="0.95"/>
        <circle cx="105" cy="76" r="5.5" fill="white" opacity="0.95"/>
        <circle cx="88"  cy="77" r="3"   fill="#001f45"/>
        <circle cx="106" cy="77" r="3"   fill="#001f45"/>
        <circle cx="89"  cy="76" r="1.2" fill="white" opacity="0.9"/>
        <circle cx="107" cy="76" r="1.2" fill="white" opacity="0.9"/>

        {/* ── RBC WORDMARK ── */}
        <text x="100" y="228" textAnchor="middle"
          fontFamily="Arial Black, Impact, sans-serif"
          fontWeight="900" fontSize="32" fill="white" letterSpacing="6"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))' }}>RBC</text>

        {/* Bottom glow line */}
        <line x1="30" y1="235" x2="170" y2="235"
          stroke="rgba(255,210,0,0.35)" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    </div>
  );
}
