import React from 'react';

export const CuratedCollections = ({ onQuickView }) => {
  return (
    <section className="store-section" id="collections">
      <div className="section-header">
        <span className="section-tag">Seasonal Edit</span>
        <h2 className="section-title">Curated Collections</h2>
        <p className="section-subtitle">Explore carefully curated wardrobes designed for everyday elegance and festive celebrations.</p>
      </div>

      <div className="collections-grid">
        {/* Collection 1 */}
        <div className="collection-card" onClick={() => onQuickView('prod-1')}>
          <img className="collection-img" src="/assets/images/featured-saree.jpg" alt="Heritage Silk Sarees" />
          <div className="collection-overlay">
            <span className="collection-pill">Festive 2026</span>
            <h3 className="collection-name">Heritage Silk Sarees</h3>
            <span className="collection-action">Explore Collection →</span>
          </div>
        </div>

        {/* Collection 2 */}
        <div className="collection-card" onClick={() => onQuickView('prod-2')}>
          <img className="collection-img" src="/assets/images/hero-model.jpg" alt="Aesthetic Streetwear" />
          <div className="collection-overlay">
            <span className="collection-pill">Signature Line</span>
            <h3 className="collection-name">Aesthetic Streetwear</h3>
            <span className="collection-action">Explore Collection →</span>
          </div>
        </div>

        {/* Collection 3 */}
        <div className="collection-card" onClick={() => onQuickView('prod-4')}>
          <img className="collection-img" src="/assets/images/product-western.jpg" alt="Modern Silhouettes" />
          <div className="collection-overlay">
            <span className="collection-pill">Evening Luxe</span>
            <h3 className="collection-name">Pleated Midi Dresses</h3>
            <span className="collection-action">Explore Collection →</span>
          </div>
        </div>
      </div>
    </section>
  );
};
