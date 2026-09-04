import React, { useState, useEffect } from 'react';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsapp';

export const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('Free Size');
  const [selectedColor, setSelectedColor] = useState('Default');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);

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

  const imagesList = Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter(img => img && typeof img === 'string' && img.trim().length > 0)
    : (product.image ? [product.image] : []);

  const activeImage = imagesList[selectedImageIndex] || product.image || '/assets/images/featured-saree.jpg';

  return (
    <div className="modal-backdrop active" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="quick-view-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
        
        <div className="quick-view-content">
          {/* Gallery View */}
          <div className="quick-view-gallery-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Main High-Res Image */}
            <div className="quick-view-gallery" style={{ width: '100%', minHeight: '380px', maxHeight: '480px', borderRadius: '16px', overflow: 'hidden', background: '#FCF8F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src={activeImage} 
                alt={product.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.25s ease' }}
              />
            </div>

            {/* Multiple Images Thumbnail Strip */}
            {imagesList.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '76px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: selectedImageIndex === idx ? '2px solid var(--brand-pink-primary)' : '1px solid var(--brand-pink-border)',
                      padding: 0,
                      background: '#FFF',
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: selectedImageIndex === idx ? 1 : 0.65,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Thumbnail ${idx + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span className="section-tag" style={{ margin: 0 }}>{product.badge || 'DORCASS Signature'}</span>
                <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.9rem' }}>
                  ★ {product.rating || '5.0'} ({product.reviewsCount || 0} reviews)
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', lineHeight: '1.25' }}>
                {product.title}
              </h2>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {product.subtitle || `${product.category || 'Luxury'} Collection`}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--brand-pink-deep)' }}>
                  ₹{Number(product.price || 0).toFixed(2)}
                </span>
                {product.originalPrice ? (
                  <span style={{ fontSize: '1.05rem', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                    ₹{Number(product.originalPrice).toFixed(2)}
                  </span>
                ) : null}
                {product.discount ? (
                  <span style={{ background: '#FFE8EF', color: 'var(--brand-pink-primary)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.82rem' }}>
                    {product.discount}
                  </span>
                ) : null}
              </div>
              
              {/* Product Description */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Description & Details
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  {product.description || 'Crafted with premium materials and signature design for effortless luxury.'}
                </p>
                {product.fabric && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    <strong>Fabric / Material:</strong> {product.fabric}
                  </div>
                )}
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-main)' }}>
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
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-main)' }}>
                    Select Size: <span style={{ color: 'var(--brand-pink-primary)' }}>{selectedSize}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(s => (
                      <button 
                        key={s}
                        className="size-select-btn" 
                        onClick={() => setSelectedSize(s)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '10px',
                          border: selectedSize === s ? '2px solid var(--brand-pink-primary)' : '1px solid var(--brand-pink-border)',
                          background: selectedSize === s ? 'var(--brand-pink-subtle)' : '#FFFFFF',
                          color: selectedSize === s ? 'var(--brand-pink-primary)' : 'var(--text-main)',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions (Add to Bag & WhatsApp) */}
            <div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => onAddToCart(product, 1, selectedSize, selectedColor)}
                  style={{
                    flex: '1 1 180px',
                    padding: '13px 20px',
                    background: 'var(--brand-pink-primary)',
                    color: '#FFFFFF',
                    borderRadius: '40px',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    boxShadow: '0 8px 22px rgba(232, 61, 112, 0.32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: 'none'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  Add to Bag
                </button>

                <a 
                  href={generateSingleProductWhatsAppUrl(product, selectedSize, selectedColor, 1)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '1 1 180px',
                    padding: '13px 20px',
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#FFFFFF',
                    borderRadius: '40px',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    boxShadow: '0 8px 22px rgba(37, 211, 102, 0.32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  Order on WhatsApp
                </a>
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
