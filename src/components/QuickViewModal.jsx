import React, { useState, useEffect } from 'react';

export const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [selectedColor, setSelectedColor] = useState('Default');

  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Free Size');
      }

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      } else {
        setSelectedColor('Default');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop active" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="quick-view-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        
        <div className="quick-view-content">
          <div className="quick-view-gallery">
            <img src={product.image} alt={product.title} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="section-tag" style={{ margin: 0 }}>{product.badge || 'DORCASS Signature'}</span>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.9rem' }}>
                  ★ {product.rating} ({product.reviewsCount} reviews)
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                {product.title}
              </h2>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {product.subtitle}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-pink-deep)' }}>
                  ₹{product.price.toFixed(2)}
                </span>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span style={{ background: '#FFE8EF', color: 'var(--brand-pink-primary)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem' }}>
                  {product.discount}
                </span>
              </div>
              
              <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '24px' }}>
                {product.description}
              </p>

              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-main)' }}>
                    Color: <span style={{ color: 'var(--brand-pink-primary)', fontWeight: 600 }}>{selectedColor}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {product.colors.map(c => (
                      <button 
                        key={c.name}
                        className="color-swatch-btn" 
                        onClick={() => setSelectedColor(c.name)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: c.hex,
                          border: selectedColor === c.name ? '2px solid var(--brand-pink-primary)' : '2px solid #FFFFFF',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-main)' }}>
                    Select Size
                  </label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.sizes.map(s => (
                      <button 
                        key={s}
                        className="size-select-btn" 
                        onClick={() => setSelectedSize(s)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '12px',
                          border: selectedSize === s ? '1.5px solid var(--brand-pink-primary)' : '1.5px solid var(--brand-pink-border)',
                          background: selectedSize === s ? 'var(--brand-pink-subtle)' : '#FFFFFF',
                          color: selectedSize === s ? 'var(--brand-pink-primary)' : 'var(--text-main)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                <button 
                  onClick={() => onAddToCart(product, 1, selectedSize, selectedColor)}
                  style={{
                    flex: 1,
                    padding: '14px 28px',
                    background: 'var(--brand-pink-primary)',
                    color: '#FFFFFF',
                    borderRadius: '40px',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    boxShadow: '0 8px 24px rgba(232, 61, 112, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  Add to Bag • ₹{product.price.toFixed(2)}
                </button>
              </div>
              <div style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>✓ Free Express Shipping</span>
                <span>✓ 7-Day Easy Return</span>
                <span>✓ 100% Genuine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
