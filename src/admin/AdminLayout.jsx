import React, { useState } from 'react';

export const AdminLayout = ({ 
  activeTab, 
  onSelectTab, 
  onNavigateStore, 
  productsCount = 0, 
  categoriesCount = 0,
  children 
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'products': return 'Product Catalog';
      case 'add-product': return 'Add New Product';
      case 'edit-product': return 'Edit Product';
      case 'categories': return 'Category Hierarchy Manager';
      case 'settings': return 'Store Settings';
      default: return 'Admin Portal';
    }
  };

  return (
    <div className="admin-portal-wrapper">
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="admin-modal-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{ zIndex: 95 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand-logo">
            <div className="admin-brand-title">
              <span>DORCASS</span>
              <span className="admin-brand-badge">ADMIN</span>
            </div>
            <span className="admin-brand-subtitle">Haute Couture Manager</span>
          </div>
          {isMobileSidebarOpen && (
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ✕
            </button>
          )}
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-section-title">Store Management</span>

          <button 
            className={`admin-nav-btn ${activeTab === 'dashboard' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectTab('dashboard');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Dashboard</span>
          </button>

          <button 
            className={`admin-nav-btn ${activeTab === 'products' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectTab('products');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Products</span>
            <span className="admin-nav-badge">{productsCount}</span>
          </button>

          <button 
            className={`admin-nav-btn ${activeTab === 'add-product' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectTab('add-product');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Product</span>
          </button>

          <button 
            className={`admin-nav-btn ${activeTab === 'categories' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectTab('categories');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Categories</span>
            <span className="admin-nav-badge">{categoriesCount}</span>
          </button>

          <span className="admin-nav-section-title" style={{ marginTop: '12px' }}>System</span>

          <button 
            className={`admin-nav-btn ${activeTab === 'settings' ? 'is-active' : ''}`}
            onClick={() => {
              onSelectTab('settings');
              setIsMobileSidebarOpen(false);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Store Settings</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-view-store-btn" onClick={onNavigateStore}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Exit to Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button 
              className="admin-mobile-toggle"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className="admin-breadcrumbs">
              <span>Admin</span>
              <span>›</span>
              <span className="current">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-status-indicator">
              <span className="admin-status-dot"></span>
              <span>Live Database</span>
            </div>

            <button 
              className="admin-btn-secondary"
              onClick={onNavigateStore}
              title="View customer-facing storefront"
            >
              <span>View Storefront</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="admin-content-body">
          {children}
        </main>
      </div>
    </div>
  );
};
