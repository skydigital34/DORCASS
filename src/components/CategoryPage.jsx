import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CATEGORIES_DATA } from '../data/categoriesData';

export const CategoryPage = ({
  categoryInfo,
  products = [],
  onAddToCart,
  onQuickView,
  wishlist = new Set(),
  onToggleWishlist,
  onNavigate,
  isNewArrivals = false
}) => {
  // Mobile filter drawer open/close
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Read initial query params from URL
  const getInitialParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      sort: searchParams.get('sort') || 'featured',
      colors: searchParams.getAll('color'),
      sizes: searchParams.getAll('size'),
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
      inStockOnly: searchParams.get('inStock') === 'true',
      badge: searchParams.get('badge') || null
    };
  };

  const [filters, setFilters] = useState(getInitialParams);

  // Sync filters from URL on popstate
  useEffect(() => {
    const handlePopState = () => {
      setFilters(getInitialParams());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL search query params when filters change
  const updateQueryParams = useCallback((newFilters) => {
    setFilters(newFilters);
    const searchParams = new URLSearchParams();

    if (newFilters.sort && newFilters.sort !== 'featured') {
      searchParams.set('sort', newFilters.sort);
    }
    if (newFilters.colors && newFilters.colors.length > 0) {
      newFilters.colors.forEach(c => searchParams.append('color', c));
    }
    if (newFilters.sizes && newFilters.sizes.length > 0) {
      newFilters.sizes.forEach(s => searchParams.append('size', s));
    }
    if (newFilters.minPrice !== null && newFilters.minPrice !== undefined) {
      searchParams.set('minPrice', newFilters.minPrice.toString());
    }
    if (newFilters.maxPrice !== null && newFilters.maxPrice !== undefined) {
      searchParams.set('maxPrice', newFilters.maxPrice.toString());
    }
    if (newFilters.inStockOnly) {
      searchParams.set('inStock', 'true');
    }
    if (newFilters.badge) {
      searchParams.set('badge', newFilters.badge);
    }

    const newQueryString = searchParams.toString();
    const newUrl = `${window.location.pathname}${newQueryString ? `?${newQueryString}` : ''}`;
    window.history.replaceState(null, '', newUrl);
  }, []);

  // Simulate smooth editorial transition on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 180);
    return () => clearTimeout(timer);
  }, [categoryInfo?.categorySlug, categoryInfo?.subcategorySlug, categoryInfo?.tertiarySlug]);

  // Dynamic SEO Document Title
  useEffect(() => {
    if (!categoryInfo) {
      document.title = 'Collection Not Found | DORCASS';
      return;
    }
    if (isNewArrivals) {
      document.title = 'New Arrivals | DORCASS Luxury Fashion';
      return;
    }
    if (categoryInfo.tertiaryCategory) {
      document.title = `${categoryInfo.tertiaryCategory.name} - ${categoryInfo.subcategory.name} | DORCASS`;
    } else if (categoryInfo.subcategory) {
      document.title = `${categoryInfo.subcategory.name} ${categoryInfo.category.name} | DORCASS`;
    } else if (categoryInfo.category) {
      document.title = `${categoryInfo.category.name} Collection | DORCASS Luxury Fashion`;
    } else {
      document.title = 'All Collections | DORCASS Luxury Fashion';
    }
  }, [categoryInfo, isNewArrivals]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterDrawerOpen]);

  // 1. Filter products belonging to current category / subcategory / tertiary or new arrivals
  const baseCategoryProducts = useMemo(() => {
    if (!categoryInfo) return [];

    if (isNewArrivals) {
      return products.filter(p => p.badge === 'New Arrival' || p.badge === 'New In' || p.discount);
    }

    const { categorySlug, subcategorySlug, tertiarySlug } = categoryInfo;

    return products.filter(p => {
      if (categorySlug && categorySlug !== 'all' && p.category !== categorySlug) {
        return false;
      }
      if (subcategorySlug) {
        if (p.subcategory !== subcategorySlug && p.tertiaryCategory !== subcategorySlug) {
          return false;
        }
      }
      if (tertiarySlug) {
        if (p.tertiaryCategory !== tertiarySlug) {
          return false;
        }
      }
      return true;
    });
  }, [products, categoryInfo, isNewArrivals]);

  // 2. Extract dynamic available filters from baseCategoryProducts
  const availableFilterOptions = useMemo(() => {
    const colorsMap = new Map();
    const sizesSet = new Set();
    const badgesSet = new Set();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    baseCategoryProducts.forEach(p => {
      if (p.colors) {
        p.colors.forEach(c => {
          if (!colorsMap.has(c.name)) {
            colorsMap.set(c.name, c.hex);
          }
        });
      }
      if (p.sizes) {
        p.sizes.forEach(s => sizesSet.add(s));
      }
      if (p.badge) {
        badgesSet.add(p.badge);
      }
      if (p.price < minPrice) minPrice = Math.floor(p.price);
      if (p.price > maxPrice) maxPrice = Math.ceil(p.price);
    });

    return {
      colors: Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex })),
      sizes: Array.from(sizesSet),
      badges: Array.from(badgesSet),
      priceRange: minPrice !== Infinity ? { min: minPrice, max: maxPrice } : { min: 0, max: 5000 }
    };
  }, [baseCategoryProducts]);

  // 3. Apply active filters and sorting to base products
  const displayedProducts = useMemo(() => {
    let result = [...baseCategoryProducts];

    // Filter by color
    if (filters.colors && filters.colors.length > 0) {
      result = result.filter(p => 
        p.colors && p.colors.some(c => filters.colors.includes(c.name))
      );
    }

    // Filter by size
    if (filters.sizes && filters.sizes.length > 0) {
      result = result.filter(p => 
        p.sizes && p.sizes.some(s => filters.sizes.includes(s))
      );
    }

    // Filter by price
    if (filters.minPrice !== null && filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    // Filter in stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Filter badge
    if (filters.badge) {
      result = result.filter(p => p.badge === filters.badge);
    }

    // Sorting
    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'featured':
      default:
        // Keep natural curated order
        break;
    }

    return result;
  }, [baseCategoryProducts, filters]);

  // Handlers for filter changes
  const handleSortChange = (e) => {
    updateQueryParams({ ...filters, sort: e.target.value });
  };

  const handleColorToggle = (colorName) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists 
      ? filters.colors.filter(c => c !== colorName)
      : [...filters.colors, colorName];
    updateQueryParams({ ...filters, colors: updated });
  };

  const handleSizeToggle = (size) => {
    const exists = filters.sizes.includes(size);
    const updated = exists
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    updateQueryParams({ ...filters, sizes: updated });
  };

  const handleStockToggle = () => {
    updateQueryParams({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const handleClearFilters = () => {
    updateQueryParams({
      sort: 'featured',
      colors: [],
      sizes: [],
      maxPrice: null,
      minPrice: null,
      inStockOnly: false,
      badge: null
    });
  };

  // Active filter count
  const activeFiltersCount = (filters.colors?.length || 0) +
    (filters.sizes?.length || 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.badge ? 1 : 0) +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0);

  // Subcategory Tabs determination
  const subcategoryTabs = useMemo(() => {
    if (!categoryInfo || isNewArrivals) return [];

    const { category, subcategory } = categoryInfo;

    // If on top-level category (e.g. Sarees, Salwars, 2 Piece Sets, Accessories)
    if (category && !subcategory) {
      if (!category.children || category.children.length === 0) return [];
      return [
        { name: 'All', path: category.path, isActive: true },
        ...category.children.map(sub => ({
          name: sub.name,
          path: sub.path,
          isActive: false
        }))
      ];
    }

    // If on subcategory with siblings (e.g. Sarees -> Linen or Accessories -> Anti turnis)
    if (category && subcategory) {
      // If the subcategory itself has children (e.g. Anti turnis has chains, earings, etc.)
      if (subcategory.children && subcategory.children.length > 0) {
        return [
          { name: `All ${subcategory.name}`, path: subcategory.path, isActive: !categoryInfo.tertiaryCategory },
          ...subcategory.children.map(leaf => ({
            name: leaf.name,
            path: leaf.path,
            isActive: categoryInfo.tertiarySlug === leaf.slug
          }))
        ];
      }

      // Sibling tabs under parent category
      return [
        { name: 'All', path: category.path, isActive: false },
        ...category.children.map(sub => ({
          name: sub.name,
          path: sub.path,
          isActive: sub.slug === categoryInfo.subcategorySlug
        }))
      ];
    }

    return [];
  }, [categoryInfo, isNewArrivals]);

  // Render 404 if category not found in data tree
  if (!categoryInfo) {
    return (
      <div className="category-not-found-container">
        <div className="category-not-found-card">
          <div className="not-found-icon">🦌</div>
          <span className="section-tag">DORCASS Luxury Collection</span>
          <h2 className="not-found-title">Collection Not Found</h2>
          <p className="not-found-desc">
            We couldn't find the requested collection. Let us guide you back to our timeless handcrafted pieces.
          </p>
          <div className="not-found-actions">
            <button 
              className="not-found-btn primary"
              onClick={() => onNavigate({ path: '/' })}
            >
              Return to Home
            </button>
            <button 
              className="not-found-btn secondary"
              onClick={() => onNavigate({ path: '/new-arrivals' })}
            >
              Explore New Arrivals
            </button>
            <button 
              className="not-found-btn secondary"
              onClick={() => onNavigate({ path: '/category/sarees' })}
            >
              Browse Sarees
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hero Data
  const heroTitle = isNewArrivals 
    ? 'New Arrivals' 
    : categoryInfo.tertiaryCategory 
      ? categoryInfo.tertiaryCategory.name
      : categoryInfo.subcategory 
        ? categoryInfo.subcategory.name
        : categoryInfo.category 
          ? categoryInfo.category.name 
          : 'All Collections';

  const heroTagline = categoryInfo.tagline || 'Timeless drapes, thoughtfully curated.';
  const heroDescription = categoryInfo.description || 'Immerse yourself in pieces made from pure mul-silk, organic cotton, and precision tailoring.';
  const heroImage = categoryInfo.image || '/assets/images/featured-saree.jpg';

  return (
    <div className="dynamic-category-page">
      {/* ========================================================
          1. PREMIUM EDITORIAL CATEGORY HERO
          ======================================================== */}
      <section className="category-hero-section">
        <div className="category-hero-bg-wrapper">
          <img 
            src={heroImage} 
            alt={heroTitle} 
            className="category-hero-bg-img" 
          />
          <div className="category-hero-overlay"></div>
        </div>

        <div className="category-hero-content">
          {/* Breadcrumb Bar */}
          <nav className="category-breadcrumbs" aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              {categoryInfo.breadcrumbs?.map((crumb, idx) => {
                const isLast = idx === categoryInfo.breadcrumbs.length - 1;
                return (
                  <li key={crumb.path} className="breadcrumb-item">
                    {isLast ? (
                      <span className="breadcrumb-current" aria-current="page">{crumb.label}</span>
                    ) : (
                      <>
                        <button 
                          className="breadcrumb-link"
                          onClick={() => onNavigate({ path: crumb.path })}
                        >
                          {crumb.label}
                        </button>
                        <span className="breadcrumb-separator">/</span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="category-hero-text-block">
            <span className="category-hero-tag">DORCASS Haute Couture</span>
            <h1 className="category-hero-title">{heroTitle}</h1>
            <p className="category-hero-tagline">"{heroTagline}"</p>
            <p className="category-hero-desc">{heroDescription}</p>

            <div className="category-hero-stats-pill">
              <span className="stats-dot"></span>
              <span>{baseCategoryProducts.length} Exclusive Handcrafted Pieces</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SUBCATEGORY PILL NAVIGATION TABS
          ======================================================== */}
      {subcategoryTabs.length > 0 && (
        <section className="subcategory-pill-section">
          <div className="subcategory-pill-container">
            <span className="subcategory-label">Filter Weaves:</span>
            <div className="subcategory-pill-scroll">
              {subcategoryTabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`subcategory-pill-btn ${tab.isActive ? 'is-active' : ''}`}
                  onClick={() => onNavigate({ path: tab.path })}
                >
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          3. ADVANCED FILTER & SORT TOOLBAR
          ======================================================== */}
      <section className="category-catalog-container">
        <div className="filter-sort-toolbar">
          <div className="toolbar-left">
            <button 
              className={`filter-toggle-btn ${activeFiltersCount > 0 ? 'has-active' : ''}`}
              onClick={() => {
                if (window.innerWidth <= 992) {
                  setIsFilterDrawerOpen(true);
                } else {
                  setIsDesktopFilterOpen(prev => !prev);
                }
              }}
              aria-label="Toggle Filters"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="7" y1="12" x2="17" y2="12"></line>
                <line x1="10" y1="18" x2="14" y2="18"></line>
              </svg>
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="filter-count-badge">{activeFiltersCount}</span>
              )}
            </button>

            <div className="results-count-text">
              Showing <strong>{displayedProducts.length}</strong> of {baseCategoryProducts.length} pieces
            </div>
          </div>

          <div className="toolbar-right">
            <div className="sort-dropdown-box">
              <label htmlFor="categorySortSelect" className="sort-label">Sort by:</label>
              <select 
                id="categorySortSelect"
                className="category-sort-select"
                value={filters.sort}
                onChange={handleSortChange}
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="active-filter-chips-bar">
            <span className="active-chips-label">Active Filters:</span>
            <div className="active-chips-list">
              {filters.colors?.map(c => (
                <span key={c} className="filter-chip">
                  <span>Color: {c}</span>
                  <button onClick={() => handleColorToggle(c)} aria-label={`Remove ${c} filter`}>✕</button>
                </span>
              ))}
              {filters.sizes?.map(s => (
                <span key={s} className="filter-chip">
                  <span>Size: {s}</span>
                  <button onClick={() => handleSizeToggle(s)} aria-label={`Remove size ${s} filter`}>✕</button>
                </span>
              ))}
              {filters.inStockOnly && (
                <span className="filter-chip">
                  <span>In Stock Only</span>
                  <button onClick={handleStockToggle} aria-label="Remove in stock filter">✕</button>
                </span>
              )}
              {filters.badge && (
                <span className="filter-chip">
                  <span>Badge: {filters.badge}</span>
                  <button onClick={() => updateQueryParams({ ...filters, badge: null })} aria-label="Remove badge filter">✕</button>
                </span>
              )}
              <button className="clear-all-chips-btn" onClick={handleClearFilters}>
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Desktop Expandable Filter Panel */}
        {isDesktopFilterOpen && (
          <div className="desktop-filter-panel">
            <div className="desktop-filter-grid">
              {/* Color Filter */}
              {availableFilterOptions.colors.length > 0 && (
                <div className="filter-group">
                  <h4 className="filter-group-title">Colors</h4>
                  <div className="color-swatches-grid">
                    {availableFilterOptions.colors.map(col => {
                      const isSelected = filters.colors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          className={`color-swatch-chip ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleColorToggle(col.name)}
                          title={col.name}
                        >
                          <span className="color-dot" style={{ backgroundColor: col.hex }}></span>
                          <span className="color-name">{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes Filter */}
              {availableFilterOptions.sizes.length > 0 && (
                <div className="filter-group">
                  <h4 className="filter-group-title">Sizes</h4>
                  <div className="sizes-grid">
                    {availableFilterOptions.sizes.map(sz => {
                      const isSelected = filters.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          className={`size-filter-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSizeToggle(sz)}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Availability & Badges */}
              <div className="filter-group">
                <h4 className="filter-group-title">Availability</h4>
                <label className="filter-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={filters.inStockOnly} 
                    onChange={handleStockToggle}
                  />
                  <span>In Stock Pieces Only</span>
                </label>

                {availableFilterOptions.badges.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <h5 className="filter-sub-title">Collection Highlights</h5>
                    <div className="badge-chips-row">
                      {availableFilterOptions.badges.map(bg => (
                        <button
                          key={bg}
                          className={`badge-chip-btn ${filters.badge === bg ? 'is-selected' : ''}`}
                          onClick={() => updateQueryParams({ ...filters, badge: filters.badge === bg ? null : bg })}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="desktop-filter-footer">
              <button className="filter-footer-btn clear" onClick={handleClearFilters}>
                Reset All Filters
              </button>
              <button className="filter-footer-btn close" onClick={() => setIsDesktopFilterOpen(false)}>
                Close Panel
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            4. RESPONSIVE PRODUCT GRID & SKELETON LOADING
            ======================================================== */}
        {isLoading ? (
          <div className="category-products-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="product-card-skeleton">
                <div className="skeleton-thumb"></div>
                <div className="skeleton-lines">
                  <div className="skeleton-line full"></div>
                  <div className="skeleton-line half"></div>
                  <div className="skeleton-line price"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="category-products-grid">
            {displayedProducts.map(product => {
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
                      aria-label="Wishlist"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "var(--brand-pink-primary)" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                    
                    <img className="product-thumb-img" src={product.image} alt={product.title} loading="lazy" />
                    
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

                    {/* Color Swatch Dots */}
                    {product.colors && product.colors.length > 1 && (
                      <div className="card-color-dots">
                        {product.colors.map(col => (
                          <span 
                            key={col.name} 
                            className="card-color-dot" 
                            style={{ backgroundColor: col.hex }} 
                            title={col.name}
                          ></span>
                        ))}
                      </div>
                    )}
                    
                    <div className="product-price-row">
                      <div className="price-container">
                        <span className="current-price">₹{Number(product.price || 0).toFixed(2)}</span>
                        {product.originalPrice ? (
                          <span className="original-price">₹{Number(product.originalPrice).toFixed(2)}</span>
                        ) : null}
                        {product.discount && (
                          <span className="discount-tag">{product.discount}</span>
                        )}
                      </div>
                      
                      <button 
                        className="product-add-cart-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }} 
                        title="Add to Cart"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
          /* ========================================================
              5. EMPTY STATE WITH HELPFUL ALTERNATIVES
              ======================================================== */
          <div className="category-empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3 className="empty-state-title">No pieces match your selected filters</h3>
            <p className="empty-state-desc">
              We couldn't find any designs with the chosen criteria in this collection. Try resetting filters or explore other popular weaves.
            </p>
            <div className="empty-state-actions">
              <button className="empty-btn primary" onClick={handleClearFilters}>
                Clear All Filters
              </button>
              <button 
                className="empty-btn secondary" 
                onClick={() => onNavigate({ path: '/' })}
              >
                Back to Home
              </button>
              <button 
                className="empty-btn secondary" 
                onClick={() => onNavigate({ path: '/category/sarees' })}
              >
                Explore Sarees
              </button>
              <button 
                className="empty-btn secondary" 
                onClick={() => onNavigate({ path: '/category/salwars' })}
              >
                Explore Salwars
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          6. MOBILE FILTER BOTTOM SHEET / DRAWER
          ======================================================== */}
      {isFilterDrawerOpen && (
        <div 
          className="mobile-filter-backdrop" 
          onClick={() => setIsFilterDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product Filters"
        >
          <div className="mobile-filter-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-filter-header">
              <div className="drawer-title-group">
                <h3>Filters & Refinements</h3>
                <span>{displayedProducts.length} pieces found</span>
              </div>
              <button 
                className="drawer-close-btn" 
                onClick={() => setIsFilterDrawerOpen(false)}
                aria-label="Close Filters"
              >
                ✕
              </button>
            </div>

            <div className="mobile-filter-content">
              {/* Color Filter */}
              {availableFilterOptions.colors.length > 0 && (
                <div className="drawer-filter-group">
                  <h4>Colors</h4>
                  <div className="drawer-color-grid">
                    {availableFilterOptions.colors.map(col => {
                      const isSelected = filters.colors.includes(col.name);
                      return (
                        <button
                          key={col.name}
                          className={`drawer-color-chip ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleColorToggle(col.name)}
                        >
                          <span className="color-dot" style={{ backgroundColor: col.hex }}></span>
                          <span>{col.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes Filter */}
              {availableFilterOptions.sizes.length > 0 && (
                <div className="drawer-filter-group">
                  <h4>Sizes</h4>
                  <div className="drawer-sizes-grid">
                    {availableFilterOptions.sizes.map(sz => {
                      const isSelected = filters.sizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          className={`drawer-size-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSizeToggle(sz)}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* In Stock */}
              <div className="drawer-filter-group">
                <h4>Availability</h4>
                <label className="drawer-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={filters.inStockOnly} 
                    onChange={handleStockToggle}
                  />
                  <span>Show In-Stock Pieces Only</span>
                </label>
              </div>
            </div>

            <div className="mobile-filter-footer">
              <button className="drawer-footer-btn reset" onClick={handleClearFilters}>
                Reset
              </button>
              <button className="drawer-footer-btn apply" onClick={() => setIsFilterDrawerOpen(false)}>
                Show {displayedProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
