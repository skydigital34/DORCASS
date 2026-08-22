import React, { useState } from 'react';
import { getProductsCountByCategory } from '../services/storeService';

export const CategoryManager = ({ 
  categories = [], 
  onCreateCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}) => {
  // Modal state
  const [modalMode, setModalMode] = useState(null); // 'add-main' | 'add-sub' | 'add-nested' | 'edit'
  const [targetCategory, setTargetCategory] = useState(null); // Category or subcategory being edited or added to
  const [parentTarget, setParentTarget] = useState(null); // Main parent when adding nested

  // Form state
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catTagline, setCatTagline] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deletion modal state
  const [deletingTarget, setDeletingTarget] = useState(null);
  const [deleteWarning, setDeleteWarning] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Open Add Main Category modal
  const handleOpenAddMain = () => {
    setModalMode('add-main');
    setTargetCategory(null);
    setParentTarget(null);
    setCatName('');
    setCatSlug('');
    setCatTagline('');
    setCatDescription('');
    setModalError('');
  };

  // Open Add Subcategory modal
  const handleOpenAddSub = (parentCategory) => {
    setModalMode('add-sub');
    setTargetCategory(parentCategory);
    setParentTarget(null);
    setCatName('');
    setCatSlug('');
    setCatTagline('');
    setCatDescription('');
    setModalError('');
  };

  // Open Add Nested Subcategory modal (e.g. under Accessories -> Anti turnis)
  const handleOpenAddNested = (parentCategory, subcategory) => {
    setModalMode('add-nested');
    setTargetCategory(subcategory);
    setParentTarget(parentCategory);
    setCatName('');
    setCatSlug('');
    setCatTagline('');
    setCatDescription('');
    setModalError('');
  };

  // Open Edit modal
  const handleOpenEdit = (item, parentCat = null, parentSub = null) => {
    setModalMode('edit');
    setTargetCategory(item);
    setParentTarget({ parentCat, parentSub });
    setCatName(item.name || '');
    setCatSlug(item.slug || '');
    setCatTagline(item.tagline || '');
    setCatDescription(item.description || '');
    setModalError('');
  };

  // Handle Delete Click (Calculate products count first)
  const handleOpenDelete = (item, parentCategorySlug = null, parentSubcategorySlug = null) => {
    const productCount = getProductsCountByCategory(
      parentCategorySlug || item.slug, 
      parentCategorySlug ? item.slug : null,
      parentSubcategorySlug ? item.slug : null
    );

    let warning = '';
    if (productCount > 0) {
      warning = `⚠️ This category currently contains ${productCount} product(s). Deleting this category may affect product categorization and customer catalog navigation. Are you sure you want to continue?`;
    } else {
      warning = `Are you sure you want to delete "${item.name}"? This action cannot be undone.`;
    }

    setDeletingTarget({ item, parentCategorySlug, parentSubcategorySlug });
    setDeleteWarning(warning);
  };

  // Save Category Form
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      setModalError('Category name is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (modalMode === 'add-main') {
        await onCreateCategory({
          name: catName,
          slug: catSlug,
          tagline: catTagline,
          description: catDescription
        });
      } else if (modalMode === 'add-sub') {
        await onCreateCategory({
          name: catName,
          slug: catSlug,
          parentCategorySlug: targetCategory.slug,
          tagline: catTagline,
          description: catDescription
        });
      } else if (modalMode === 'add-nested') {
        await onCreateCategory({
          name: catName,
          slug: catSlug,
          parentCategorySlug: parentTarget.slug,
          parentSubcategorySlug: targetCategory.slug,
          tagline: catTagline,
          description: catDescription
        });
      } else if (modalMode === 'edit') {
        await onUpdateCategory({
          oldSlug: targetCategory.slug,
          name: catName,
          slug: catSlug,
          parentCategorySlug: parentTarget?.parentCat?.slug || null,
          parentSubcategorySlug: parentTarget?.parentSub?.slug || null,
          tagline: catTagline,
          description: catDescription
        });
      }

      setModalMode(null);
    } catch (err) {
      setModalError(err.message || 'Failed to save category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;
    try {
      setIsDeleting(true);
      await onDeleteCategory({
        slug: deletingTarget.item.slug,
        parentCategorySlug: deletingTarget.parentCategorySlug,
        parentSubcategorySlug: deletingTarget.parentSubcategorySlug
      });
      setDeletingTarget(null);
    } catch (err) {
      console.error('Delete category failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Category Hierarchy Manager</h1>
          <p className="admin-page-subtitle">
            Configure store categories, weaves, nested accessory types, and customer navigation menus.
          </p>
        </div>

        <button className="admin-btn-primary" onClick={handleOpenAddMain}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>+ Add Main Category</span>
        </button>
      </div>

      {/* Category Tree */}
      <div className="admin-category-tree">
        {categories.map((mainCat, index) => {
          const mainProductCount = getProductsCountByCategory(mainCat.slug);
          const subCount = mainCat.children?.length || 0;

          return (
            <div className="admin-cat-tree-card" key={mainCat.slug || index}>
              {/* Main Category Header Row */}
              <div className="admin-cat-header-row">
                <div className="admin-cat-header-info">
                  <span style={{ fontWeight: 800, color: 'var(--admin-pink)', fontSize: '1rem' }}>
                    {index + 1}.
                  </span>
                  <div>
                    <span className="admin-cat-title">{mainCat.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', marginLeft: '10px' }}>
                      /{mainCat.slug}
                    </span>
                  </div>
                  <span className="admin-cat-badge">
                    {subCount} {subCount === 1 ? 'weave / type' : 'weaves / types'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                    • {mainProductCount} product(s)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    className="admin-btn-secondary"
                    style={{ padding: '5px 12px', fontSize: '0.8rem' }}
                    onClick={() => handleOpenAddSub(mainCat)}
                    title={`Add subcategory under ${mainCat.name}`}
                  >
                    + Add Subcategory
                  </button>

                  <button 
                    className="admin-action-btn"
                    onClick={() => handleOpenEdit(mainCat)}
                    title="Edit category"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>

                  <button 
                    className="admin-action-btn delete"
                    onClick={() => handleOpenDelete(mainCat)}
                    title="Delete category"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Subcategories List */}
              {mainCat.children && mainCat.children.length > 0 ? (
                <div className="admin-cat-sub-list">
                  {mainCat.children.map(subCat => {
                    const subProductCount = getProductsCountByCategory(mainCat.slug, subCat.slug);
                    const nestedCount = subCat.children?.length || 0;

                    return (
                      <div key={subCat.slug}>
                        <div className="admin-subcat-item">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: 'var(--admin-text-muted)' }}>↳</span>
                            <span style={{ fontWeight: 700, color: 'var(--admin-text-main)' }}>
                              {subCat.name}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                              ({subProductCount} products)
                            </span>
                            {nestedCount > 0 && (
                              <span className="admin-cat-badge" style={{ fontSize: '0.7rem' }}>
                                {nestedCount} items
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Option to add nested item (for categories like Accessories) */}
                            <button 
                              className="admin-action-btn"
                              style={{ fontSize: '0.75rem', color: 'var(--admin-pink)' }}
                              onClick={() => handleOpenAddNested(mainCat, subCat)}
                              title={`Add nested type under ${subCat.name}`}
                            >
                              + Type
                            </button>

                            <button 
                              className="admin-action-btn"
                              onClick={() => handleOpenEdit(subCat, mainCat)}
                              title="Edit subcategory"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>

                            <button 
                              className="admin-action-btn delete"
                              onClick={() => handleOpenDelete(subCat, mainCat.slug)}
                              title="Delete subcategory"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Nested Sub-subcategories (e.g. Accessories -> Anti turnis -> Chains) */}
                        {subCat.children && subCat.children.length > 0 && (
                          <div className="admin-nested-sub-list">
                            {subCat.children.map(nestedItem => {
                              const nestedProdCount = getProductsCountByCategory(mainCat.slug, subCat.slug, nestedItem.slug);

                              return (
                                <div className="admin-subcat-item" key={nestedItem.slug} style={{ background: '#FCF8F9' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: 'var(--admin-text-muted)' }}>•</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                      {nestedItem.name}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)' }}>
                                      ({nestedProdCount} products)
                                    </span>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <button 
                                      className="admin-action-btn"
                                      onClick={() => handleOpenEdit(nestedItem, mainCat, subCat)}
                                      title="Edit nested item"
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                      </svg>
                                    </button>

                                    <button 
                                      className="admin-action-btn delete"
                                      onClick={() => handleOpenDelete(nestedItem, mainCat.slug, subCat.slug)}
                                      title="Delete nested item"
                                    >
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '12px 20px', color: 'var(--admin-text-muted)', fontSize: '0.84rem' }}>
                  No subcategories configured for {mainCat.name}. Click "+ Add Subcategory" to create weaves or types.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Create / Edit Modal */}
      {modalMode && (
        <div className="admin-modal-backdrop" onClick={() => setModalMode(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {modalMode === 'add-main' && 'Add Main Category'}
                {modalMode === 'add-sub' && `Add Subcategory to ${targetCategory?.name}`}
                {modalMode === 'add-nested' && `Add Nested Type to ${targetCategory?.name}`}
                {modalMode === 'edit' && `Edit Category: ${targetCategory?.name}`}
              </h3>
              <button 
                onClick={() => setModalMode(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              <div className="admin-modal-body">
                {modalError && (
                  <div className="admin-input-error" style={{ marginBottom: '14px' }}>
                    {modalError}
                  </div>
                )}

                <div className="admin-form-group">
                  <label className="admin-label">
                    Category Name <span className="req">*</span>
                  </label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. Silk Sarees, Linen, Chains"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Slug (Optional - auto generated)</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. silk-sarees"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tagline (Optional)</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. Timeless drapes, thoughtfully curated."
                    value={catTagline}
                    onChange={(e) => setCatTagline(e.target.value)}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Description (Optional)</label>
                  <textarea 
                    className="admin-textarea" 
                    placeholder="Brief description for customer category page..."
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="admin-btn-secondary" 
                  onClick={() => setModalMode(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTarget && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingTarget(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Category</h3>
              <button 
                onClick={() => setDeletingTarget(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ fontSize: '0.95rem', color: 'var(--admin-text-main)', lineHeight: '1.5' }}>
                {deleteWarning}
              </p>
            </div>
            <div className="admin-modal-footer">
              <button 
                className="admin-btn-secondary" 
                onClick={() => setDeletingTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="admin-btn-danger" 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
