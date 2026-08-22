import React from 'react';

export const CartDrawer = ({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  onRemoveItem, 
  onCheckout 
}) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
      />
      <aside className={`cart-drawer ${isOpen ? 'active' : ''}`}>
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Shopping Bag</span>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close cart" 
            style={{ position: 'static', width: '34px', height: '34px' }}
          >
            ✕
          </button>
        </div>

        {/* Free shipping tracker */}
        <div style={{
          background: 'var(--brand-pink-subtle)',
          padding: '10px 20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--brand-pink-deep)',
          borderBottom: '1px solid var(--brand-pink-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🎉 You unlocked <strong>FREE Express Shipping!</strong></span>
        </div>

        <div className="cart-items-list">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', color: 'var(--brand-pink-primary)' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-main)' }}>Your bag is empty</p>
              <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Discover pieces tailored to your style</p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item-card" key={`${item.id}-${item.size}-${item.color}`}>
                <div className="cart-item-thumb">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {item.size ? `Size: ${item.size}` : ''} {item.color ? `• ${item.color}` : ''}
                  </div>
                  <div className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</div>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.size, item.color, -1)}>-</button>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 4px' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.size, item.color, 1)}>+</button>
                  </div>
                </div>
                <button 
                  className="remove-cart-item" 
                  onClick={() => onRemoveItem(item.id, item.size, item.color)} 
                  style={{ color: 'var(--text-muted)', padding: '4px', cursor: 'pointer' }} 
                  title="Remove"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          <div className="cart-total-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-total-row" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '8px' }}>
            <span>Estimated Taxes</span>
            <span>Included</span>
          </div>
          <div className="cart-total-row" style={{ fontSize: '1.25rem', fontWeight: 800, borderTop: '1px dashed var(--brand-pink-border)', paddingTop: '12px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--brand-pink-deep)' }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <button 
            className="cart-checkout-btn whatsapp-order-btn" 
            onClick={onCheckout}
            disabled={cart.length === 0}
            style={{ 
              opacity: cart.length === 0 ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              background: cart.length === 0 ? 'var(--text-muted)' : 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#FFFFFF',
              boxShadow: cart.length === 0 ? 'none' : '0 6px 20px rgba(37, 211, 102, 0.35)',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Order via WhatsApp • ₹{subtotal.toFixed(2)}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
