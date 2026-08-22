import React from 'react';

export const AdminDashboard = ({ 
  products = [], 
  categories = [], 
  onSelectTab, 
  onEditProduct 
}) => {
  const totalProducts = products.length;
  const publishedProducts = products.filter(p => p.status === 'published').length;
  const outOfStockProducts = products.filter(p => p.status === 'out-of-stock' || p.stock === 0).length;
  
  // Total categories including subcategories
  let totalCategoriesCount = categories.length;
  categories.forEach(c => {
    if (c.children) {
      totalCategoriesCount += c.children.length;
      c.children.forEach(sub => {
        if (sub.children) {
          totalCategoriesCount += sub.children.length;
        }
      });
    }
  });

  const recentProducts = [...products].slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <p className="admin-page-subtitle">Welcome back to DORCASS Haute Couture administration portal.</p>
        </div>
        
        <button className="admin-btn-primary" onClick={() => onSelectTab('add-product')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="admin-metric-icon-box pink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div>
            <div className="admin-metric-val">{totalProducts}</div>
            <div className="admin-metric-label">Total Products</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon-box gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div>
            <div className="admin-metric-val">{totalCategoriesCount}</div>
            <div className="admin-metric-label">Active Categories</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon-box green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <div className="admin-metric-val">{publishedProducts}</div>
            <div className="admin-metric-label">Published Pieces</div>
          </div>
        </div>

        <div className="admin-metric-card">
          <div className="admin-metric-icon-box yellow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <div className="admin-metric-val">{outOfStockProducts}</div>
            <div className="admin-metric-label">Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Quick Operations</h2>
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button className="admin-btn-primary" onClick={() => onSelectTab('add-product')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>+ Add Product</span>
          </button>
          
          <button className="admin-btn-secondary" onClick={() => onSelectTab('products')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
            </svg>
            <span>Manage Products</span>
          </button>

          <button className="admin-btn-secondary" onClick={() => onSelectTab('categories')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>Manage Categories</span>
          </button>
        </div>
      </div>

      {/* Recent Products Overview */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Recent Inventory</h2>
          {products.length > 0 && (
            <button className="admin-btn-secondary" onClick={() => onSelectTab('products')}>
              View All ({totalProducts})
            </button>
          )}
        </div>

        {recentProducts.length === 0 ? (
          <div className="admin-empty-box">
            <div className="admin-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h3 className="admin-empty-title">No products added yet</h3>
            <p className="admin-empty-desc">
              Your store database is currently empty. Click the button below to add your first luxury piece with Cloudinary image URLs.
            </p>
            <button className="admin-btn-primary" onClick={() => onSelectTab('add-product')}>
              + Add First Product
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="admin-prod-thumb-box">
                          <img src={p.image || p.images?.[0]} alt={p.title} />
                        </div>
                        <div className="admin-prod-info">
                          <span className="admin-prod-title">{p.title}</span>
                          <span className="admin-prod-sku">{p.subtitle || p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{p.category}</span>
                      {p.subcategory && <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}> › {p.subcategory}</span>}
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{Number(p.price).toFixed(2)}</td>
                    <td>
                      <span style={{ fontWeight: 600, color: p.stock <= 0 ? 'var(--admin-danger)' : 'inherit' }}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status-pill ${p.status}`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="admin-btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => onEditProduct(p.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
