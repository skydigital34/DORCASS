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
            className="cart-checkout-btn" 
            onClick={onCheckout}
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.6 : 1 }}
          >
            Proceed to Checkout
          </button>
        </div>
      </aside>
    </>
  );
};
