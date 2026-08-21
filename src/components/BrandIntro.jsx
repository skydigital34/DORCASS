import React, { useState, useEffect } from 'react';

export const BrandIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState('entering'); // 'entering' | 'meeting' | 'revealing' | 'exiting' | 'done'
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Fast track for reduced motion
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 1000);
      return () => clearTimeout(quickTimer);
    }

    // Phase 1 -> 2: Antler Meeting at 1.8s
    const meetingTimer = setTimeout(() => {
      setPhase('meeting');
    }, 1800);

    // Phase 2 -> 3: Brand Text Expansion at 2.4s
    const revealTimer = setTimeout(() => {
      setPhase('revealing');
    }, 2400);

    // Phase 3 -> 4: Exit Transition starts at 3.3s
    const exitTimer = setTimeout(() => {
      setPhase('exiting');
    }, 3300);

    // Phase 4 -> 5: Complete & Unmount at 3.9s
    const finishTimer = setTimeout(() => {
      handleFinish();
    }, 3900);

    // Safety timeout at 4.8s (never trap user)
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 4800);

    return () => {
      clearTimeout(meetingTimer);
      clearTimeout(revealTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  const handleFinish = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('dorcass_intro_seen', 'true');
    } catch (e) {
      // Storage unavailable or disabled
    }
    if (onComplete) {
      onComplete();
    }
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`dorcass-brand-intro-overlay ${phase}`} 
      role="dialog" 
      aria-label="Welcome to DORCASS"
      aria-modal="true"
    >
      {/* Ambient Luxury Background Elements */}
      <div className="intro-bg-gradient"></div>
      <div className="intro-radial-glow"></div>
      <div className="intro-noise-texture"></div>

      {/* Skip Button */}
      <button 
        className="intro-skip-btn" 
        onClick={handleFinish} 
        aria-label="Skip Introduction"
        title="Skip Intro"
      >
        <span>SKIP</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Main Symmetrical Stage */}
      <div className="intro-center-stage">
        {/* Top Monogram / Brand Header */}
        <div className="intro-header-branding">
          <span className="intro-established-text">EST. 2026 • LUXURY COUTURE</span>
          <h1 className="intro-brand-title">DORCASS</h1>
        </div>

        {/* Cinematic Deer Vector Animation Canvas */}
        <div className="intro-deer-canvas-wrapper">
          <svg 
            className="intro-deer-svg" 
            viewBox="0 0 800 360" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Luxury Gold/Pink Gradient for Deer Silhouette */}
              <linearGradient id="stagGoldGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#FDE3E9" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#E83D70" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#C02656" stopOpacity="0.75" />
              </linearGradient>

              <linearGradient id="stagGoldGradRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="40%" stopColor="#FDE3E9" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#E83D70" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#C02656" stopOpacity="0.75" />
              </linearGradient>

              {/* Antler Shimmer Beam Gradient */}
              <radialGradient id="antlerBurstGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="25%" stopColor="#FFE6B3" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#E83D70" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#E83D70" stopOpacity="0" />
              </radialGradient>

              <filter id="softGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Base Line / Reflection Floor */}
            <line x1="120" y1="310" x2="680" y2="310" stroke="rgba(232, 61, 112, 0.25)" strokeWidth="1" strokeDasharray="4 6" />

            {/* LEFT STAG (Facing Right, advancing to center X=400) */}
            <g className="intro-stag-group stag-left">
              {/* Left Stag Body & Legs */}
              <path 
                d="M 230,305 L 236,250 C 238,230 242,215 252,205 C 265,195 285,198 305,208 C 315,213 322,225 328,240 L 332,305 L 324,305 L 320,255 C 315,242 308,235 298,230 C 286,225 272,225 264,232 L 258,305 Z" 
                fill="url(#stagGoldGradLeft)" 
                opacity="0.9"
              />
              {/* Left Stag Chest, Arching Neck, Regal Head */}
              <path 
                d="M 305,208 C 316,192 328,165 334,135 C 338,118 344,98 355,85 C 362,76 372,74 382,78 C 390,82 396,86 400,88 C 402,89 402,91 399,93 C 392,97 384,101 378,107 C 370,115 365,130 358,155 C 350,185 342,210 328,240 Z" 
                fill="url(#stagGoldGradLeft)"
              />
              {/* Left Stag Alert Ear */}
              <path 
                d="M 358,82 C 352,70 348,60 350,54 C 352,50 356,52 360,60 C 364,68 366,76 366,82 Z" 
                fill="#FFFFFF" 
                opacity="0.8"
              />
              {/* Left Stag Majestic Antlers (Spanning towards X=398) */}
              <g className="stag-antlers antler-left" filter="url(#softGlowFilter)">
                {/* Main Beam */}
                <path 
                  d="M 364,78 C 366,55 372,35 382,20 C 388,10 394,6 398,8 C 400,9 399,12 396,15 C 388,24 382,42 376,65 C 372,80 368,90 366,92" 
                  stroke="url(#stagGoldGradLeft)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Brow Tine (Forward Sweeping Reach) */}
                <path 
                  d="M 374,68 C 382,58 392,52 399,50 C 401,50 401,52 398,55 C 390,62 382,70 376,78" 
                  stroke="url(#stagGoldGradLeft)" 
                  strokeWidth="2.4" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Trez Tine (Upper Reach Interlocking) */}
                <path 
                  d="M 380,42 C 390,32 398,28 402,26 C 404,26 403,28 400,31 C 392,38 384,48 380,56" 
                  stroke="url(#stagGoldGradLeft)" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Crown Tine Accent */}
                <path 
                  d="M 386,22 C 392,14 397,12 400,11" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  fill="none"
                />
              </g>
            </g>

            {/* RIGHT STAG (Facing Left, advancing to center X=400) */}
            <g className="intro-stag-group stag-right">
              {/* Right Stag Body & Legs */}
              <path 
                d="M 570,305 L 564,250 C 562,230 558,215 548,205 C 535,195 515,198 495,208 C 485,213 478,225 472,240 L 468,305 L 476,305 L 480,255 C 485,242 492,235 502,230 C 514,225 528,225 536,232 L 542,305 Z" 
                fill="url(#stagGoldGradRight)" 
                opacity="0.9"
              />
              {/* Right Stag Chest, Arching Neck, Regal Head */}
              <path 
                d="M 495,208 C 484,192 472,165 466,135 C 462,118 456,98 445,85 C 438,76 428,74 418,78 C 410,82 404,86 400,88 C 398,89 398,91 401,93 C 408,97 416,101 422,107 C 430,115 435,130 442,155 C 450,185 458,210 472,240 Z" 
                fill="url(#stagGoldGradRight)"
              />
              {/* Right Stag Alert Ear */}
              <path 
                d="M 442,82 C 448,70 452,60 450,54 C 448,50 444,52 440,60 C 436,68 434,76 434,82 Z" 
                fill="#FFFFFF" 
                opacity="0.8"
              />
              {/* Right Stag Majestic Antlers (Spanning towards X=402) */}
              <g className="stag-antlers antler-right" filter="url(#softGlowFilter)">
                {/* Main Beam */}
                <path 
                  d="M 436,78 C 434,55 428,35 418,20 C 412,10 406,6 402,8 C 400,9 401,12 404,15 C 412,24 418,42 424,65 C 428,80 432,90 434,92" 
                  stroke="url(#stagGoldGradRight)" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Brow Tine (Forward Sweeping Reach) */}
                <path 
                  d="M 426,68 C 418,58 408,52 401,50 C 399,50 399,52 402,55 C 410,62 418,70 424,78" 
                  stroke="url(#stagGoldGradRight)" 
                  strokeWidth="2.4" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Trez Tine (Upper Reach Interlocking) */}
                <path 
                  d="M 420,42 C 410,32 402,28 398,26 C 396,26 397,28 400,31 C 408,38 416,48 420,56" 
                  stroke="url(#stagGoldGradRight)" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  fill="none"
                />
                {/* Crown Tine Accent */}
                <path 
                  d="M 414,22 C 408,14 403,12 400,11" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  fill="none"
                />
              </g>
            </g>

            {/* ANTLER COLLISION CONTACT BURST & SHIMMER (Appears at X=400, Y=35) */}
            <g className="antler-contact-sparkle">
              {/* Radial Outer Flare */}
              <circle cx="400" cy="36" r="32" fill="url(#antlerBurstGlow)" />
              {/* Luminous Starburst Flare Lines */}
              <path d="M 400,16 L 400,56" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 380,36 L 420,36" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 386,22 L 414,50" stroke="#FFE6B3" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 414,22 L 386,50" stroke="#FFE6B3" strokeWidth="1.5" strokeLinecap="round" />
              {/* Core Brilliance Diamond */}
              <circle cx="400" cy="36" r="4.5" fill="#FFFFFF" filter="url(#softGlowFilter)" />
              {/* Micro Radiating Particles */}
              <circle cx="390" cy="20" r="1.5" fill="#FFE6B3" className="sparkle-particle p1" />
              <circle cx="410" cy="18" r="1.5" fill="#FFE6B3" className="sparkle-particle p2" />
              <circle cx="418" cy="42" r="1.2" fill="#FFFFFF" className="sparkle-particle p3" />
              <circle cx="382" cy="44" r="1.2" fill="#FFFFFF" className="sparkle-particle p4" />
            </g>
          </svg>
        </div>

        {/* Bottom Tagline & Brand Creed */}
        <div className="intro-footer-branding">
          <div className="intro-tagline-wrapper">
            <span className="intro-divider-line"></span>
            <span className="intro-tagline-text">CURATED ELEGANCE</span>
            <span className="intro-divider-line"></span>
          </div>

          {/* Minimalist Progress Glow Bar */}
          <div className="intro-progress-track">
            <div className="intro-progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
