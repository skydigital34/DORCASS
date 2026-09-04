import React, { useState, useEffect, useMemo, useRef } from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import { uploadImageToCloudinary, isCloudinaryConfigured } from '../services/cloudinary';

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];

export const ProductForm = ({ 
  product = null, 
  categories = [], 
  onSave, 
  onCancel 
}) => {
  const isEditing = !!product;
  const fileInputRef = useRef(null);

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

  // Custom size input state
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Image upload states
  const [uploadProgress, setUploadProgress] = useState({}); // { [index]: percentage }
  const [isUploading, setIsUploading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

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

  // Available Tertiary Subcategories
  const availableTertiaryCategories = useMemo(() => {
    return currentSubcategoryObj?.children || [];
  }, [currentSubcategoryObj]);

  // Handle Category Change
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

  // Size Management Handlers
  const handleToggleSize = (size) => {
    setFormData(prev => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(size)) {
        const remaining = currentSizes.filter(s => s !== size);
        return { ...prev, sizes: remaining.length > 0 ? remaining : ['Free Size'] };
      } else {
        // If 'Free Size' was the only one and user clicks S, replace or add
        const updated = currentSizes.filter(s => s !== 'Free Size');
        return { ...prev, sizes: size === 'Free Size' ? ['Free Size'] : [...updated, size] };
      }
    });
  };

  const handleAddCustomSize = (e) => {
    if (e) e.preventDefault();
    const val = customSizeInput.trim();
    if (!val) return;

    setFormData(prev => {
      const currentSizes = prev.sizes || [];
      if (currentSizes.includes(val)) return prev;
      return {
        ...prev,
        sizes: [...currentSizes.filter(s => s !== 'Free Size'), val]
      };
    });
    setCustomSizeInput('');
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData(prev => {
      const remaining = (prev.sizes || []).filter(s => s !== sizeToRemove);
      return {
        ...prev,
        sizes: remaining.length > 0 ? remaining : ['Free Size']
      };
    });
  };

  const handleSetStandardClothingSizes = () => {
    setFormData(prev => ({
      ...prev,
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
    }));
  };

  // Image Management
  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData(prev => ({ ...prev, images: updated }));
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

  // File Upload Handler (Direct Cloudinary Upload)
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setErrors(prev => ({ ...prev, images: null }));
    const existing = formData.images.filter(img => img && img.trim().length > 0);
    const newImages = [...existing];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const targetIndex = newImages.length;
      setUploadProgress(prev => ({ ...prev, [targetIndex]: 15 }));

      try {
        const cloudinaryUrl = await uploadImageToCloudinary(file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [targetIndex]: progress }));
        });
        if (cloudinaryUrl) {
          newImages.push(cloudinaryUrl);
        }
      } catch (err) {
        console.warn('Cloudinary upload warning:', err);
        setErrors(prev => ({
          ...prev,
          images: `Upload error: ${err.message}`
        }));
      }
    }

    if (newImages.length === 0) {
      newImages.push('');
    }

    setFormData(prev => ({ ...prev, images: newImages }));
    setIsUploading(false);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
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
      newErrors.images = 'Please upload at least one image or provide an image URL.';
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
        images: formData.images.filter(img => img && img.trim().length > 0),
        sizes: formData.sizes && formData.sizes.length > 0 ? formData.sizes : ['Free Size']
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
            {isEditing ? `Edit Product: ${product.title}` : 'Add New Product'}
          </h1>
          <p className="admin-page-subtitle">
            Configure product details, pricing, Cloudinary images, sizes (S - XXXL), and stock.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="admin-btn-secondary" onClick={onCancel} disabled={isSubmitting || isUploading}>
            Cancel
          </button>
          <button type="button" className="admin-btn-primary" onClick={handleSubmit} disabled={isSubmitting || isUploading}>
            {isSubmitting ? 'Saving to Firebase...' : isEditing ? 'Save Changes' : 'Publish Product'}
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
          {/* Left Column: Product Information & Image Upload */}
          <div>
            {/* 1. Basic Information */}
            <div className="admin-form-section">
              <h2 className="admin-form-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <span>Product Name & Details</span>
              </h2>

              <div className="admin-form-group">
                <label className="admin-label">
                  Product Name <span className="req">*</span>
                </label>
                <input 
                  type="text" 
                  className="admin-input-text" 
                  placeholder="e.g. Royal Pink Kanchipuram Silk Saree"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {errors.title && <span className="admin-input-error">{errors.title}</span>}
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Subtitle / Key Highlight</label>
                <input 
                  type="text" 
                  className="admin-input-text" 
                  placeholder="e.g. Handcrafted Pure Zari Weave • Luxury Bridal Collection"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">
                  Description <span className="req">*</span>
                </label>
                <textarea 
                  className="admin-textarea" 
                  style={{ minHeight: '130px' }}
                  placeholder="Enter detailed description: fabric weave, borders, zari work, styling recommendations, wash care, and occasion suitability..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', display: 'block', marginTop: '4px' }}>
                  {formData.description.length} characters • Saved securely in Firebase Firestore
                </span>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Fabric / Material</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. 100% Pure Mulberry Silk / Anti-Tarnish Brass"
                    value={formData.fabric}
                    onChange={(e) => setFormData(prev => ({ ...prev, fabric: e.target.value }))}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Badge Label</label>
                  <input 
                    type="text" 
                    className="admin-input-text" 
                    placeholder="e.g. Bestseller, New Arrival, Limited Edition"
                    value={formData.badge}
                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* 2. Sizes Management (S, M, L, XL, XXL, XXXL, Custom) */}
            <div className="admin-form-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 className="admin-form-section-title" style={{ margin: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                  </svg>
                  <span>Available Sizes (S, M, L, XL, XXL, XXXL)</span>
                </h2>
                <button 
                  type="button" 
                  onClick={handleSetStandardClothingSizes}
                  style={{
                    background: 'none',
                    border: '1px solid var(--admin-pink)',
                    color: 'var(--admin-pink)',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  + Select All (S to XXXL)
                </button>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--admin-text-muted)', marginBottom: '14px' }}>
                Click size buttons to toggle them ON/OFF, or add custom sizes below:
              </p>

              {/* Standard Size Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {STANDARD_SIZES.map(s => {
                  const isSelected = (formData.sizes || []).includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleToggleSize(s)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--admin-pink)' : '1px solid var(--admin-border)',
                        background: isSelected ? 'var(--admin-pink-subtle)' : '#FFFFFF',
                        color: isSelected ? 'var(--admin-pink-deep)' : 'var(--admin-text-main)',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? `✓ ${s}` : s}
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Adder */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' }}>
                <input 
                  type="text" 
                  className="admin-input-text" 
                  placeholder="Type custom size (e.g. 28, 30, 32, 40, XS, 4XL)..."
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSize(); } }}
                  style={{ maxWidth: '320px' }}
                />
                <button 
                  type="button" 
                  className="admin-btn-secondary" 
                  onClick={handleAddCustomSize}
                  style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                >
                  + Add Custom Size
                </button>
              </div>

              {/* Active Selected Sizes List */}
              <div style={{ background: '#FCF8F9', border: '1px solid var(--admin-border)', borderRadius: '8px', padding: '10px 14px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--admin-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Active Sizes on Storefront:
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(formData.sizes || []).map(size => (
                    <span 
                      key={size}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#FFFFFF',
                        border: '1px solid var(--admin-border)',
                        borderRadius: '20px',
                        padding: '4px 10px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--admin-text-main)'
                      }}
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(size)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--admin-danger)',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          lineHeight: 1
                        }}
                        title={`Remove ${size}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Cloudinary Image Upload & Media Manager */}
            <div className="admin-form-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 className="admin-form-section-title" style={{ margin: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Product Images (Cloudinary Upload)</span>
                </h2>
                <span style={{ 
                  fontSize: '0.78rem', 
                  color: isCloudinaryConfigured() ? 'var(--admin-success)' : 'var(--admin-pink-deep)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    background: isCloudinaryConfigured() ? 'var(--admin-success)' : 'var(--admin-pink-deep)' 
                  }}></span>
                  Cloudinary: {isCloudinaryConfigured() ? 'nlog05bi (dorcass)' : 'Active'}
                </span>
              </div>

              {/* Direct File Dropzone / Uploader */}
              <div 
                className={`admin-dropzone ${isDragOver ? 'is-dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--admin-pink)',
                  borderRadius: 'var(--admin-radius-md)',
                  background: isDragOver ? 'var(--admin-pink-subtle)' : '#FCF8F9',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '18px',
                  transition: 'all 0.2s ease'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                  multiple 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--admin-pink-subtle)',
                  color: 'var(--admin-pink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px'
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--admin-text-main)', marginBottom: '4px' }}>
                  {isUploading ? 'Uploading to Cloudinary...' : 'Click to Upload PNG/JPG Image Files or Drag & Drop'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                  PNG, JPG, JPEG, WEBP • Direct upload to Cloudinary (nlog05bi)
                </div>
              </div>

              {errors.images && (
                <div className="admin-input-error" style={{ marginBottom: '12px' }}>
                  {errors.images}
                </div>
              )}

              {/* Image List & Preview Stack */}
              <div className="admin-image-stack">
                {formData.images.map((url, idx) => {
                  const hasError = imageErrors[idx];
                  const hasUrl = url && url.trim().length > 0;
                  const progress = uploadProgress[idx];

                  return (
                    <div className="admin-image-input-item" key={idx}>
                      {/* Live Thumbnail Preview Box */}
                      <div className="admin-image-preview-box">
                        {progress !== undefined && progress < 100 ? (
                          <div style={{ textAlign: 'center', padding: '4px', fontSize: '0.72rem', color: 'var(--admin-pink)', fontWeight: 700 }}>
                            {progress}%
                          </div>
                        ) : hasUrl && !hasError ? (
                          <img 
                            src={url} 
                            alt={`Preview ${idx + 1}`}
                            onError={() => setImageErrors(prev => ({ ...prev, [idx]: true }))}
                            onLoad={() => setImageErrors(prev => ({ ...prev, [idx]: false }))}
                          />
                        ) : hasUrl && hasError ? (
                          <div className="admin-image-error-notice">
                            ⚠️ Invalid URL
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Empty</span>
                        )}
                      </div>

                      {/* Image Input and Action Buttons */}
                      <div className="admin-image-fields">
                        <div className="admin-image-header">
                          <span className="admin-image-tag">
                            {idx === 0 ? '★ Primary Cover Image' : `Gallery Image ${idx + 1}`}
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
                          placeholder="Cloudinary image URL or direct web link"
                          value={url}
                          onChange={(e) => handleImageChange(idx, e.target.value)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="admin-add-img-btn"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ flex: 1 }}
                >
                  📁 Browse Device File
                </button>
                <button 
                  type="button" 
                  className="admin-btn-secondary"
                  onClick={handleAddImageField}
                  style={{ borderRadius: 'var(--admin-radius-sm)', fontSize: '0.84rem' }}
                >
                  + Add URL Field
                </button>
              </div>
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
                <span>Type Categories</span>
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
                <span>Pricing, Stock & Status</span>
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
                  Stock Count (Units) <span className="req">*</span>
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
                <label className="admin-label">Product Status</label>
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
          <button type="button" className="admin-btn-secondary" onClick={onCancel} disabled={isSubmitting || isUploading}>
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" disabled={isSubmitting || isUploading}>
            {isSubmitting ? 'Saving to Firebase...' : isEditing ? 'Update Product' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};
