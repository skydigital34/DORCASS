import React, { useState, useEffect, useMemo } from 'react';

export const ProductForm = ({ 
  product = null, 
  categories = [], 
  onSave, 
  onCancel 
}) => {
  const isEditing = !!product;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    subcategory: '',
    tertiaryCategory: '',
    price: '',
    originalPrice: '',
    stock: '10',
    status: 'published',
    description: '',
    badge: '',
    fabric: '',
    sizes: ['Free Size'],
    colors: [{ name: 'Default', hex: '#E83D70' }],
    images: ['']
  });

  // Image load error tracking { [index]: true }
  const [imageErrors, setImageErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        subtitle: product.subtitle || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        tertiaryCategory: product.tertiaryCategory || '',
        price: product.price !== undefined ? String(product.price) : '',
        originalPrice: product.originalPrice ? String(product.originalPrice) : '',
        stock: product.stock !== undefined ? String(product.stock) : '10',
        status: product.status || 'published',
        description: product.description || '',
        badge: product.badge || '',
        fabric: product.fabric || '',
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : ['Free Size'],
        colors: product.colors && product.colors.length > 0 ? product.colors : [{ name: 'Default', hex: '#E83D70' }],
        images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [''])
      });
    } else if (categories.length > 0) {
      setFormData(prev => ({
        ...prev,
        category: prev.category || categories[0].slug
      }));
    }
  }, [product, categories]);

  // Selected Category Object
  const currentCategoryObj = useMemo(() => {
    return categories.find(c => c.slug === formData.category);
  }, [categories, formData.category]);

  // Available Subcategories
  const availableSubcategories = useMemo(() => {
    return currentCategoryObj?.children || [];
  }, [currentCategoryObj]);

  // Selected Subcategory Object
  const currentSubcategoryObj = useMemo(() => {
    return availableSubcategories.find(s => s.slug === formData.subcategory);
  }, [availableSubcategories, formData.subcategory]);

  // Available Tertiary Subcategories (e.g. Accessories -> Anti turnis -> Chains)
  const availableTertiaryCategories = useMemo(() => {
    return currentSubcategoryObj?.children || [];
  }, [currentSubcategoryObj]);

  // Handle Category Change (Resets subcategories)
  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    const catObj = categories.find(c => c.slug === newCat);
    const firstSub = catObj?.children?.[0]?.slug || '';
    const subObj = catObj?.children?.[0];
    const firstTertiary = subObj?.children?.[0]?.slug || '';

    setFormData(prev => ({
      ...prev,
      category: newCat,
      subcategory: firstSub,
      tertiaryCategory: firstTertiary
    }));
  };

  // Handle Subcategory Change
  const handleSubcategoryChange = (e) => {
    const newSub = e.target.value;
    const subObj = availableSubcategories.find(s => s.slug === newSub);
    const firstTertiary = subObj?.children?.[0]?.slug || '';

    setFormData(prev => ({
      ...prev,
      subcategory: newSub,
      tertiaryCategory: firstTertiary
    }));
  };

  // Image Management
  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData(prev => ({ ...prev, images: updated }));

    // Reset error for this index
    setImageErrors(prev => ({ ...prev, [index]: false }));
  };

  const handleAddImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleRemoveImageField = (index) => {
    if (formData.images.length === 1) {
      setFormData(prev => ({ ...prev, images: [''] }));
      return;
    }
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: updated }));
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= formData.images.length) return;
    const updated = [...formData.images];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    setFormData(prev => ({ ...prev, images: updated }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product name is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Category selection is required.';
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price (greater than 0).';
    }

    if (formData.originalPrice && (isNaN(formData.originalPrice) || Number(formData.originalPrice) < 0)) {
      newErrors.originalPrice = 'Please enter a valid original price.';
    }

    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid non-negative stock quantity.';
    }

    const validImages = formData.images.filter(img => img && img.trim().length > 0);
    if (validImages.length === 0) {
      newErrors.images = 'At least one product image URL or path is required.';
    } else {
      // Validate URLs or paths
      const invalidUrl = validImages.find(img => !/^(https?:\/\/|\/|\.\/|data:)/i.test(img.trim()));
      if (invalidUrl) {
        newErrors.images = 'All entered image URLs must start with https://, http://, or /assets/...';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: parseInt(formData.stock, 10),
        images: formData.images.filter(img => img && img.trim().length > 0)
      });
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message || 'Failed to save product.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {isEditing ? `Edit Product: ${product.title}` : 'Add New Luxury Piece'}
          </h1>
          <p className="admin-page-subtitle">
            Provide product information, category assignment, and Cloudinary media links.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="admin-btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" className="admin-btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>

      {errors.submit && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--admin-danger)',
          color: 'var(--admin-danger)',
          padding: '12px 18px',
          borderRadius: 'var(--admin-radius-sm)',
          marginBottom: '20px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          {/* Left Column: Core Details */}
          <div>
            {/* Basic Information */}
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Product Information</span>
              </h2>

              <div className="admin-form-group">
                <label className="admin-label">
                  Product Name <span className="req">*</span>
                </label>
                <input 
                  type="text" 
                  className="admin-input-text" 
                  placeholder="e.g. Elegant Saree - Rose Chennur Silk"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {errors.title && <span className="admin-input-error">{errors.title}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Subtitle / Highlight Tag</label>
                <input 
                  type="text" 
                  className="admin-input-text" 
                  placeholder="e.g. Timeless Beauty • South Indian Royal Weave"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea 
                  className="admin-textarea" 
                  placeholder="Describe the fabric weave, craftsmanship, styling notes, and occasion suitability..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Fabric / Material</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. 100% Pure Mulberry Silk"
                    value={formData.fabric}
                    onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Badge Label</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. Bestseller, New Arrival"
                    value={formData.badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Cloudinary Image Manager */}
            <div className="admin-form-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 className="admin-form-section-title" style={{ margin: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Cloudinary Product Images</span>
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>
                  External URLs only • Primary image first
                </span>
              </div>

              {errors.images && (
                <div className="admin-input-error" style={{ marginBottom: '12px' }}>
                  {errors.images}
                </div>
              )}

              <div className="admin-image-stack">
                {formData.images.map((url, idx) => {
                  const hasError = imageErrors[idx];
                  const hasUrl = url && url.trim().length > 0;

                  return (
                    <div className="admin-image-input-item" key={idx}>
                      {/* Live Thumbnail Preview Box */}
                      <div className="admin-image-preview-box">
                        {hasUrl && !hasError ? (
                          <img 
                            src={url} 
                            alt={`Preview ${idx + 1}`}
                            onError={() => setImageErrors(prev => ({ ...prev, [idx]: true }))}
                            onLoad={() => setImageErrors(prev => ({ ...prev, [idx]: false }))}
                          />
                        ) : hasUrl && hasError ? (
                          <div className="admin-image-error-notice">
                            ⚠️ Unable to load image. Please check the Cloudinary URL.
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>No URL</span>
                        )}
                      </div>

                      {/* Image Input and Action Buttons */}
                      <div className="admin-image-fields">
                        <div className="admin-image-header">
                          <span className="admin-image-tag">
                            {idx === 0 ? '★ Primary Image (Cover)' : `Image ${idx + 1}`}
                          </span>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {idx > 0 && (
                              <button 
                                type="button" 
                                className="admin-action-btn" 
                                onClick={() => handleMoveImage(idx, idx - 1)}
                                title="Move image up"
                              >
                                ↑
                              </button>
                            )}
                            {idx < formData.images.length - 1 && (
                              <button 
                                type="button" 
                                className="admin-action-btn" 
                                onClick={() => handleMoveImage(idx, idx + 1)}
                                title="Move image down"
                              >
                                ↓
                              </button>
                            )}
                            <button 
                              type="button" 
                              className="admin-action-btn delete" 
                              onClick={() => handleRemoveImageField(idx)}
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <input 
                          type="text" 
                          className="admin-input-text" 
                          placeholder="https://... or /assets/images/featured-saree.jpg"
                          value={url}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                type="button" 
                className="admin-add-img-btn"
                onClick={handleAddImageField}
              >
                + Add Another Cloudinary Image URL
              </button>
            </div>
          </div>

          {/* Right Column: Category Hierarchy & Pricing */}
          <div>
            {/* Category Hierarchy Selection */}
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span>Category Hierarchy</span>
              </h2>

              <div className="admin-form-group">
                <label className="admin-label">
                  Main Category <span className="req">*</span>
                </label>
                <select 
                  className="admin-select"
                  value={formData.category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <span className="admin-input-error">{errors.category}</span>}
              </div>

              {availableSubcategories.length > 0 && (
                <div className="admin-form-group">
                  <label className="admin-label">Subcategory</label>
                  <select 
                    className="admin-select"
                    value={formData.subcategory}
                    onChange={handleSubcategoryChange}
                  >
                    <option value="">None (Top Level)</option>
                    {availableSubcategories.map(s => (
                      <option key={s.slug} value={s.slug}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {availableTertiaryCategories.length > 0 && (
                <div className="admin-form-group">
                  <label className="admin-label">Nested Type (e.g. Chains, Rings)</label>
                  <select 
                    className="admin-select"
                    value={formData.tertiaryCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, tertiaryCategory: e.target.value }))}
                  >
                    <option value="">None</option>
                    {availableTertiaryCategories.map(t => (
                      <option key={t.slug} value={t.slug}>{t.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Pricing & Stock */}
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>Pricing & Stock</span>
              </h2>

              <div className="admin-form-group">
                <label className="admin-label">
                  Selling Price (₹) <span className="req">*</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="admin-input-text" 
                  placeholder="1299.00"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
                {errors.price && <span className="admin-input-error">{errors.price}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Original MRP (₹)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  className="admin-input-text" 
                  placeholder="2499.00"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                />
                {errors.originalPrice && <span className="admin-input-error">{errors.originalPrice}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Stock Units <span className="req">*</span>
                </label>
                <input 
                  type="number" 
                  min="0"
                  className="admin-input-text" 
                  placeholder="10"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                />
                {errors.stock && <span className="admin-input-error">{errors.stock}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Status</label>
                <select 
                  className="admin-select"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="published">Published (Visible in Store)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button type="button" className="admin-btn-secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving Product...' : isEditing ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
