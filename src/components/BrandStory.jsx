import React from 'react';

export const BrandStory = () => {
  return (
    <section className="store-section" id="story">
      <div className="story-banner">
        <div className="story-content">
          <span className="section-tag">Our Philosophy</span>
          <h2 className="section-title">Crafted with Conscious Elegance</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: '1.7', marginBottom: '20px' }}>
            At <strong>DORCASS</strong>, we believe true fashion is a celebration of individuality. From our ethically sourced mulberry silk sarees woven by generational artisans to our 240 GSM organic cotton streetwear tees, every garment is thoughtfully crafted to empower your personal expression.
          </p>
          
          <div className="story-features">
            <div className="story-feature-item">
              <div className="story-feature-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Zero Plastic Packaging</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>100% biodegradable luxury gift packaging.</p>
              </div>
            </div>

            <div className="story-feature-item">
              <div className="story-feature-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>Ethical Artisan Fair-Pay</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Supporting 500+ master weavers across India.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="story-img-box">
          <img src="/assets/images/product-kurti.jpg" alt="DORCASS Artisan Craftsmanship" />
        </div>
      </div>
    </section>
  );
};
