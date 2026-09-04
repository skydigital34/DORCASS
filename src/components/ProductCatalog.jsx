import React, { useState } from 'react';
import { CATEGORIES_DATA } from '../data/categoriesData';

export const ProductCatalog = ({ 
  categories, 
  products, 
  onAddToCart, 
  onQuickView, 
  wishlist, 
  onToggleWishlist,
  activeCategory = 'all',
  activeSubcategory = null,
  activeTertiaryCategory = null,
  onCategoryChange
}) => {
  const [sortBy, setSortBy] = useState('featured');

  // Filter products based on active category, subcategory, and tertiary category
  let filteredProducts = products;
  
  if (activeCategory && activeCategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === activeCategory);
  }

  if (activeSubcategory) {
    filteredProducts = filteredProducts.filter(p => 
      p.subcategory === activeSubcategory || p.tertiaryCategory === activeSubcategory
    );
  }

  if (activeTertiaryCategory) {
    filteredProducts = filteredProducts.filter(p => 
      p.tertiaryCategory === activeTertiaryCategory
    );
  }

  // Sorting
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  // Find active category, subcategory, and tertiary metadata for display
  const currentCategoryObj = CATEGORIES_DATA.find(c => c.slug === activeCategory);
  const currentSubcategoryObj = currentCategoryObj?.children?.find(s => s.slug === activeSubcategory);
  const currentTertiaryObj = currentSubcategoryObj?.children?.find(t => t.slug === activeTertiaryCategory);

  const displayTitle = currentTertiaryObj
    ? `${currentCategoryObj?.name}: ${currentSubcategoryObj?.name} › ${currentTertiaryObj.name}`
    : currentSubcategoryObj 
      ? `${currentCategoryObj?.name}: ${currentSubcategoryObj.name}` 
      : currentCategoryObj 
        ? currentCategoryObj.name 
        : 'Trending Styles';

  const displaySubtitle = currentTertiaryObj?.description
    || currentSubcategoryObj?.description 
    || currentCategoryObj?.description 
    || 'Immerse yourself in pieces made from pure mul-silk, organic cotton, and precision tailoring.';

  return (
    <section className="store-section" id="shopCatalog">
      <div className="section-header">
        <span className="section-tag">Handcrafted & Contemporary</span>
        <h2 className="section-title">{displayTitle}</h2>
        <p className="section-subtitle">{displaySubtitle}</p>
      </div>

      {/* Active Filter Indicator Tag / Breadcrumbs (if filtered) */}
      {(activeCategory !== 'all' || activeSubcategory || activeTertiaryCategory) && (
        <div className="active-filter-indicator-bar">
          <div className="filter-breadcrumbs">
            <span className="breadcrumb-label">Filtered by:</span>
            <span className="breadcrumb-path">
              {currentCategoryObj?.name || activeCategory}
              {currentSubcategoryObj && ` › ${currentSubcategoryObj.name}`}
              {currentTertiaryObj && ` › ${currentTertiaryObj.name}`}
            </span>
          </div>
          <button 
            className="clear-filter-btn" 
            onClick={() => onCategoryChange && onCategoryChange('all', null, null)}
            title="Clear category filter"
          >
            <span>Clear Filter</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Category Filter Tabs & Sort Dropdown */}
      <div className="catalog-filter-bar">
        <div className="category-tabs">
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id && !activeSubcategory && !activeTertiaryCategory;
            return (
              <button
                key={cat.id}
                className={`filter-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onCategoryChange && onCategoryChange(cat.id, null, null)}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        <div className="sort-wrapper">
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
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => {
            const isWishlisted = wishlist.has(product.id);
            return (
              <div className="product-card" key={product.id}>
                <div className="product-thumb-box" onClick={() => onQuickView(product.id)} style={{ cursor: 'pointer' }}>
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
                    <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onQuickView(product.id); }}>
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="product-info-box">
                  <div className="product-rating">
                    <span>★ {product.rating || 5.0}</span>
                    <span className="count">({product.reviewsCount || 0})</span>
                  </div>
                  <h3 className="product-title" onClick={() => onQuickView(product.id)} style={{ cursor: 'pointer' }}>{product.title}</h3>
                  <p className="product-sub">{product.subtitle}</p>
                  
                    <div className="product-price-row">
                    <div className="price-container">
                      <span className="current-price">₹{Number(product.price || 0).toFixed(2)}</span>
                      {product.originalPrice ? (
                        <span className="original-price">₹{Number(product.originalPrice).toFixed(2)}</span>
                      ) : null}
                      {product.discount ? (
                        <span className="discount-tag" style={{ marginLeft: '6px', fontSize: '0.75rem', color: 'var(--brand-pink-primary)', background: '#FFE8EF', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                          {product.discount}
                        </span>
                      ) : null}
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
      ) : (
        <div className="empty-catalog-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12h8"></path>
          </svg>
          {products.length === 0 ? (
            <>
              <h3>No products available yet.</h3>
              <p>Our master artisans and stylists are preparing new luxury arrivals. Please check back soon!</p>
            </>
          ) : (
            <>
              <h3>No products available in this category yet.</h3>
              <p>We are currently curating more handcrafted pieces for this selection.</p>
              <button 
                className="empty-state-reset-btn"
                onClick={() => onCategoryChange && onCategoryChange('all', null, null)}
              >
                Explore All Collections
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
};

