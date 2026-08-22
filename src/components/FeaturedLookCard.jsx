import React from 'react';

export const FeaturedLookCard = ({ product, onQuickView }) => {
  if (!product) return null;
  return (
    <div 
      className="featured-look-floating-card" 
      id="heroFeaturedCard"
      onClick={() => onQuickView(product.id)}
    >
      <span className="featured-look-badge-label">{product.badge || 'Featured Look'}</span>
      <div className="featured-look-img-wrapper">
        <img src={product.image} alt={product.title} />
      </div>
      <h3 className="featured-look-title">{product.title.split('-')[0].trim()}</h3>
      <p className="featured-look-subtitle">{product.subtitle}</p>
      <button 
        className="featured-look-buy-btn" 
        id="heroFeaturedLookBtn"
        onClick={(e) => {
          e.stopPropagation();
          onQuickView(product.id);
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>₹{Number(product.price || 0).toFixed(2)}</span>
      </button>
    </div>
  );
};
