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
import { FirebaseSettings } from './FirebaseSettings';

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
    if (onToast) onToast(`✨ Product "${created.title}" published & saved to Firebase!`);
    setActiveTab('products');
  };

  const handleUpdateProduct = async (productData) => {
    if (!editingProductId) return;
    const updated = await updateProduct(editingProductId, productData);
    await loadData();
    if (onToast) onToast(`✓ Product "${updated.title}" updated in Firebase!`);
    setEditingProductId(null);
    setActiveTab('products');
  };

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
    await loadData();
    if (onToast) onToast('Product removed from database.');
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
        <FirebaseSettings
          onToast={onToast}
          onNavigateStore={onNavigateStore}
        />
      ) : null}
    </AdminLayout>
  );
};
