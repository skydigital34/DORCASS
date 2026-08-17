import React from 'react';

export const StatsBanner = ({ stats }) => {
  return (
    <section className="hero-stats-banner">
      {/* Stat 1: Products */}
      <div className="stats-item">
        <div className="stats-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </div>
        <div className="stats-content">
          <span className="stats-number">{stats.products}</span>
          <span className="stats-label">Products</span>
        </div>
      </div>

      <div className="stats-divider"></div>

      {/* Stat 2: Happy Customers */}
      <div className="stats-item">
        <div className="stats-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="stats-content">
          <span className="stats-number">{stats.customers}</span>
          <span className="stats-label">Happy Customers</span>
        </div>
      </div>

      <div className="stats-divider"></div>

      {/* Stat 3: Countries */}
      <div className="stats-item">
        <div className="stats-icon-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <div className="stats-content">
          <span className="stats-number">{stats.countries}</span>
          <span className="stats-label">Countries</span>
        </div>
      </div>
    </section>
  );
};
