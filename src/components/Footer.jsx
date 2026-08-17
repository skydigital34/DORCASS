import React from 'react';

export const Footer = () => {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top-grid">
        <div className="footer-brand-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="brand-name">DORCASS</span>
          </div>
          <p className="footer-brand-desc">
            Define Your Style • Where comfort meets confidence. Premium ethnic silk wear, aesthetic streetwear, and sustainable couture.
          </p>
          <div className="footer-social-links">
            <a href="#footer" className="social-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#footer" className="social-btn" aria-label="Pinterest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m8 12 3-8 3 8"></path>
                <line x1="9" y1="10" x2="15" y2="10"></line>
              </svg>
            </a>
            <a href="#footer" className="social-btn" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-title">Collections</h4>
          <ul className="footer-links">
            <li><a href="#shopCatalog">Silk Sarees</a></li>
            <li><a href="#shopCatalog">Graphic Tees</a></li>
            <li><a href="#shopCatalog">Anarkali & Kurtis</a></li>
            <li><a href="#shopCatalog">Pleated Dresses</a></li>
            <li><a href="#shopCatalog">Limited Drops</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Help & Support</h4>
          <ul className="footer-links">
            <li><a href="#footer">Order Tracking</a></li>
            <li><a href="#footer">Shipping Policy</a></li>
            <li><a href="#footer">7-Day Easy Returns</a></li>
            <li><a href="#footer">Size & Fit Guide</a></li>
            <li><a href="#footer">Sustainability Report</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Experience Stores</h4>
          <p style={{ fontSize: '0.9rem', color: '#BDB0B6', lineHeight: '1.6', marginBottom: '12px' }}>
            Visit our flagship boutiques in Mumbai, Bangalore, and New Delhi.
          </p>
          <div style={{ fontSize: '0.85rem', color: '#F6A3B9', fontWeight: 600 }}>
            Support: care@dorcass.com<br />
            Mon - Sat: 9:00 AM - 8:00 PM IST
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 DORCASS Luxury Pvt Ltd. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>100% Encrypted SSL Checkout</span>
          <span>•</span>
          <span>Verified Artisan Authenticity</span>
        </div>
      </div>
    </footer>
  );
};
