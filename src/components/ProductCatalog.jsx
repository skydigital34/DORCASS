import React, { useState } from 'react';

export const ProductCatalog = ({ 
  categories, 
  products, 
  onAddToCart, 
  onQuickView, 
  wishlist, 
  onToggleWishlist 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  let filteredProducts = products;
  if (activeCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <section className="store-section" id="shopCatalog">
      <div className="section-header">
        <span className="section-tag">Handcrafted & Contemporary</span>
        <h2 className="section-title">Trending Styles</h2>
        <p className="section-subtitle">Immerse yourself in pieces made from pure mul-silk, organic cotton, and precision tailoring.</p>
      </div>

      {/* Category Filter Tabs & Sort Dropdown */}
      <div className="catalog-filter-bar">
        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div>
          <select 
            className="catalog-sort-select" 
            id="sortSelect" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort products"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => {
          const isWishlisted = wishlist.has(product.id);
          return (
            <div className="product-card" key={product.id}>
              <div className="product-thumb-box">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                
                <button 
                  className={`product-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "var(--brand-pink-primary)" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                
                <img className="product-thumb-img" src={product.image} alt={product.title} />
                
                <div className="product-quick-view-overlay">
                  <button className="quick-view-btn" onClick={() => onQuickView(product.id)}>
                    Quick View
                  </button>
                </div>
              </div>

              <div className="product-info-box">
                <div className="product-rating">
                  <span>★ {product.rating}</span>
                  <span className="count">({product.reviewsCount})</span>
                </div>
                <h3 className="product-title">{product.title}</h3>
                <p className="product-sub">{product.subtitle}</p>
                
                <div className="product-price-row">
                  <div className="price-container">
                    <span className="current-price">₹{product.price.toFixed(2)}</span>
                    <span className="original-price">₹{product.originalPrice.toFixed(2)}</span>
                  </div>
                  
                  <button 
                    className="product-add-cart-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }} 
                    title="Add to Cart"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
