import React, { useState, useMemo } from 'react';

export const ProductList = ({ 
  products = [], 
  categories = [], 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Deletion modal state
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available subcategories for the selected category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    const cat = categories.find(c => c.slug === selectedCategory);
    return cat?.children || [];
  }, [categories, selectedCategory]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title?.toLowerCase().includes(q);
          const matchesCategory = p.category?.toLowerCase().includes(q);
          const matchesSub = p.subcategory?.toLowerCase().includes(q);
          const matchesDesc = p.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesCategory && !matchesSub && !matchesDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Subcategory filter
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory && p.tertiaryCategory !== selectedSubcategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && p.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'stock-low') return Number(a.stock) - Number(b.stock);
        if (sortBy === 'stock-high') return Number(b.stock) - Number(a.stock);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedStatus, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      await onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Products Directory</h1>
          <p className="admin-page-subtitle">
            Manage your store's luxury inventory, Cloudinary images, pricing, and stock.
          </p>
        </div>

        <button className="admin-btn-primary" onClick={onAddProduct}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-filter-row" style={{ flex: 1 }}>
            {/* Search */}
            <div className="admin-search-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                className="admin-input-text" 
                placeholder="Search products by title, SKU..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select 
              className="admin-select" 
              style={{ width: 'auto', minWidth: '160px' }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('all');
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>

            {/* Subcategory Filter (if category selected) */}
            {availableSubcategories.length > 0 && (
              <select 
                className="admin-select" 
                style={{ width: 'auto', minWidth: '160px' }}
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
              >
                <option value="all">All Subcategories</option>
                {availableSubcategories.map(s => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select 
              className="admin-select" 
              style={{ width: 'auto', minWidth: '140px' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* Sorting */}
            <select 
              className="admin-select" 
              style={{ width: 'auto', minWidth: '150px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
            </select>

            {/* Reset Filters */}
            {(searchQuery || selectedCategory !== 'all' || selectedSubcategory !== 'all' || selectedStatus !== 'all') && (
              <button 
                className="admin-btn-secondary"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                  setSelectedStatus('all');
                }}
                style={{ padding: '8px 12px', fontSize: '0.8rem' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Table */}
        {products.length === 0 ? (
          <div className="admin-empty-box">
            <div className="admin-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 className="admin-empty-title">No products have been added yet</h3>
            <p className="admin-empty-desc">
              Click the button below to create your first product entry and provide Cloudinary image URLs.
            </p>
            <button className="admin-btn-primary" onClick={onAddProduct}>
              + Add Product
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="admin-empty-box">
            <div className="admin-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 className="admin-empty-title">No products found</h3>
            <p className="admin-empty-desc">
              No products match your current search and filter criteria. Try resetting your filters.
            </p>
            <button 
              className="admin-btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSubcategory('all');
                setSelectedStatus('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="admin-prod-thumb-box">
                          <img 
                            src={p.image || p.images?.[0]} 
                            alt={p.title} 
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="admin-prod-info">
                          <span className="admin-prod-title">{p.title}</span>
                          <span className="admin-prod-sku">
                            {p.images?.length > 1 ? `${p.images.length} images` : '1 image'} • {p.subtitle || 'DORCASS Signature'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{p.category}</span>
                        {p.subcategory && (
                          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.78rem' }}>
                            › {p.subcategory}
                          </span>
                        )}
                        {p.tertiaryCategory && (
                          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.74rem' }}>
                            ›› {p.tertiaryCategory}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 800, color: 'var(--admin-text-main)' }}>
                          ₹{Number(p.price).toFixed(2)}
                        </span>
                        {p.originalPrice && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', textDecoration: 'line-through' }}>
                            ₹{Number(p.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ 
                        fontWeight: 700, 
                        color: p.stock <= 0 ? 'var(--admin-danger)' : p.stock < 5 ? 'var(--admin-warning)' : 'inherit' 
                      }}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-pill ${p.status}`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="admin-action-btn"
                          onClick={() => onEditProduct(p.id)}
                          title="Edit product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        <button 
                          className="admin-action-btn delete"
                          onClick={() => setDeletingProduct(p)}
                          title="Delete product"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingProduct(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Product</h3>
              <button 
                onClick={() => setDeletingProduct(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.95rem', color: 'var(--admin-text-main)', marginBottom: '12px' }}>
                Are you sure you want to delete <strong>"{deletingProduct.title}"</strong>?
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', lineHeight: '1.5' }}>
                This action will remove the product from the store database and customer-facing catalogs immediately. Cloudinary images will not be deleted from external servers.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn-secondary" 
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="admin-btn-danger" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
