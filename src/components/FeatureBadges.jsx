import React from 'react';

export const FeatureBadges = () => {
  return (
    <div className="feature-badges-row">
      {/* Badge 1: Premium Quality */}
      <div className="feature-badge-card">
        <div className="badge-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
          </svg>
        </div>
        <span className="badge-title">Premium<br />Quality</span>
      </div>

      {/* Badge 2: Sustainable Fashion */}
      <div className="feature-badge-card">
        <div className="badge-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
          </svg>
        </div>
        <span className="badge-title">Sustainable<br />Fashion</span>
      </div>

      {/* Badge 3: Limited Edition */}
      <div className="feature-badge-card">
        <div className="badge-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3h12l4 6-10 13L2 9z"></path>
            <path d="M11 3L8 9l4 13 4-13-3-6"></path>
            <path d="M2 9h20"></path>
          </svg>
        </div>
        <span className="badge-title">Limited<br />Edition</span>
      </div>
    </div>
  );
};
