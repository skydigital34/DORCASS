import React from 'react';
import { FeatureBadges } from './FeatureBadges';
import { FeaturedLookCard } from './FeaturedLookCard';

export const Hero = ({ featuredProduct, onQuickView, onExplore }) => {
  return (
    <section className="hero-stage">
      {/* ==========================================
           Hero Left Column (Typography, CTA, Social Proof)
           ========================================== */}
      <div className="hero-left-content">
        {/* Floating Sparkle Star Doodle */}
        <svg className="sparkle-doodle" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"></path>
        </svg>

        <div className="hero-main-title">
          <span className="title-line-1">Define Your</span>
          <span className="title-line-2">STYLE</span>
          <div className="title-line-3-group">
            <span className="title-line-3">Own Your</span>
            <svg className="heart-doodle" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <span className="title-line-4">WORLD</span>
        </div>

        <h2 className="hero-tagline-highlight">Where Comfort Meets Confidence</h2>
        <p className="hero-description">Elevate your everyday look with pieces that speak you.</p>

        {/* Explore Now CTA Button */}
        <a href="#shopCatalog" className="hero-cta-btn" id="exploreCtaBtn" onClick={onExplore}>
          <span>Explore Now</span>
          <div className="cta-arrow-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </a>

        {/* Social Proof Badge Pill (Loved by 20K+ Trendsetters) */}
        <div className="social-proof-pill">
          <div className="avatar-stack">
            <div className="avatar-circle">
              <img src="/assets/images/avatar-3.jpg" alt="Trendsetter" />
            </div>
            <div className="avatar-circle">
              <img src="/assets/images/avatar-2.jpg" alt="Trendsetter" />
            </div>
            <div className="avatar-circle">
              <img src="/assets/images/avatar-1.jpg" alt="Trendsetter" />
            </div>
          </div>
          <div className="social-proof-text">
            <span className="social-proof-label">
              Loved by 20K+ Trendsetters
              <span className="pink-heart-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
           Hero Center Column (Background Image Viewport)
           ========================================== */}
      <div className="hero-center-visual"></div>

      {/* ==========================================
           Hero Right Column (Feature Badges & Featured Look Card)
           ========================================== */}
      <div className="hero-right-content">
        <FeatureBadges />
        {featuredProduct && <FeaturedLookCard product={featuredProduct} onQuickView={onQuickView} />}
      </div>
    </section>
  );
};
