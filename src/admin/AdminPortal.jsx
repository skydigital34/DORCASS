import React, { useState, useEffect, useCallback } from 'react';
import '../styles/admin.css';
import { 
  fetchProducts, 
  fetchCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  subscribeToStore
} from '../services/storeService';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { CategoryManager } from './CategoryManager';

export const AdminPortal = ({ onNavigateStore, onToast }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      const [prods, cats] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStore(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Product CRUD Handlers
  const handleCreateProduct = async (productData) => {
    const created = await createProduct(productData);
    await loadData();
    if (onToast) onToast(`✨ Product "${created.title}" published successfully!`);
    setActiveTab('products');
  };

  const handleUpdateProduct = async (productData) => {
    if (!editingProductId) return;
    const updated = await updateProduct(editingProductId, productData);
    await loadData();
    if (onToast) onToast(`✓ Product "${updated.title}" updated successfully!`);
    setEditingProductId(null);
    setActiveTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
    await loadData();
    if (onToast) onToast('Product deleted from inventory.');
  };

  const handleStartEdit = (productId) => {
    setEditingProductId(productId);
    setActiveTab('edit-product');
  };

  // Category CRUD Handlers
  const handleCreateCategory = async (catData) => {
    const created = await createCategory(catData);
    await loadData();
    if (onToast) onToast(`Category "${created.name}" created.`);
  };

  const handleUpdateCategory = async (catData) => {
    const updated = await updateCategory(catData);
    await loadData();
    if (onToast) onToast(`Category "${updated.name}" updated.`);
  };

  const handleDeleteCategory = async (catData) => {
    await deleteCategory(catData);
    await loadData();
    if (onToast) onToast('Category removed.');
  };

  const editingProduct = products.find(p => p.id === editingProductId);

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={(tab) => {
        if (tab !== 'edit-product') setEditingProductId(null);
        setActiveTab(tab);
      }}
      onNavigateStore={onNavigateStore}
      productsCount={products.length}
      categoriesCount={categories.length}
    >
      {isLoading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>Loading DORCASS Admin Portal...</div>
        </div>
      ) : activeTab === 'dashboard' ? (
        <AdminDashboard
          products={products}
          categories={categories}
          onSelectTab={setActiveTab}
          onEditProduct={handleStartEdit}
        />
      ) : activeTab === 'products' ? (
        <ProductList
          products={products}
          categories={categories}
          onAddProduct={() => {
            setEditingProductId(null);
            setActiveTab('add-product');
          }}
          onEditProduct={handleStartEdit}
          onDeleteProduct={handleDeleteProduct}
        />
      ) : activeTab === 'add-product' ? (
        <ProductForm
          categories={categories}
          onSave={handleCreateProduct}
          onCancel={() => setActiveTab('products')}
        />
      ) : activeTab === 'edit-product' ? (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onSave={handleUpdateProduct}
          onCancel={() => {
            setEditingProductId(null);
            setActiveTab('products');
          }}
        />
      ) : activeTab === 'categories' ? (
        <CategoryManager
          categories={categories}
          onCreateCategory={handleCreateCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      ) : activeTab === 'settings' ? (
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Store & Cloudinary Settings</h2>
          </div>
          <div style={{ padding: '24px', lineHeight: '1.6' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--admin-text-main)' }}>
              DORCASS Haute Couture System Configuration
            </h3>
            <p style={{ color: 'var(--admin-text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
              Your store is configured to store only public Cloudinary image URLs. No sensitive API secrets or private tokens are stored on the frontend.
            </p>

            <div style={{ background: '#FCF8F9', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--admin-pink-deep)', marginBottom: '6px' }}>
                📸 Cloudinary Media Format Guide
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)' }}>
                Paste direct delivery URLs generated from your Cloudinary Media Library, for example:<br />
                <code style={{ background: '#FFF', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--admin-border)', fontSize: '0.8rem', display: 'inline-block', marginTop: '4px' }}>
                  https://res.cloudinary.com/your-cloud-name/image/upload/v1234567/sample.jpg
                </code>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="admin-btn-secondary"
                onClick={onNavigateStore}
              >
                Go to Storefront
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
};
