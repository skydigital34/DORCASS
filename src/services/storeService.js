import { CATEGORIES_DATA } from '../data/categoriesData';

const PRODUCTS_STORAGE_KEY = 'dorcass_products_custom_v1';
const CATEGORIES_STORAGE_KEY = 'dorcass_categories_custom_v1';

// Event listener mechanism for cross-component real-time sync
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach(callback => {
    try {
      callback();
    } catch (e) {
      console.error('Error notifying store subscriber:', e);
    }
  });
};

/**
 * Helper to deep clone objects safely
 */
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Get all stored categories or initialize with default categories hierarchy
 */
export const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored categories, using defaults:', e);
  }
  // Initialize with default categories hierarchy
  const initial = deepClone(CATEGORIES_DATA);
  saveStoredCategories(initial);
  return initial;
};

/**
 * Save categories to persistent storage
 */
export const saveStoredCategories = (categories) => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save categories to storage:', e);
  }
};

/**
 * Get all stored products (Initial database = 0 products, user adds via admin portal)
 */
export const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored products, defaulting to empty list:', e);
  }
  return [];
};

/**
 * Clear all products from database
 */
export const clearAllProducts = () => {
  saveStoredProducts([]);
  return [];
};

/**
 * Save products to persistent storage
 */
export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    notifyListeners();
  } catch (e) {
    console.error('Failed to save products to storage:', e);
  }
};

/**
 * Subscribe to store changes (returns unsubscribe function)
 */
export const subscribeToStore = (callback) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

// =========================================================================
// PRODUCT CRUD OPERATIONS
// =========================================================================

/**
 * Fetch all products asynchronously
 */
export const fetchProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredProducts());
    }, 50);
  });
};

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id) => {
  return new Promise((resolve, reject) => {
    const products = getStoredProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      resolve(deepClone(product));
    } else {
      reject(new Error(`Product with ID "${id}" not found.`));
    }
  });
};

/**
 * Create a new product
 */
export const createProduct = async (productData) => {
  return new Promise((resolve, reject) => {
    try {
      if (!productData.title || !productData.title.trim()) {
        throw new Error('Product name is required.');
      }
      if (!productData.category) {
        throw new Error('Category is required.');
      }
      if (productData.price === undefined || productData.price === null || isNaN(productData.price) || Number(productData.price) < 0) {
        throw new Error('Valid price is required.');
      }
      if (productData.stock === undefined || productData.stock === null || isNaN(productData.stock) || Number(productData.stock) < 0) {
        throw new Error('Valid stock quantity is required.');
      }
      if (!productData.images || !Array.isArray(productData.images) || productData.images.length === 0 || !productData.images[0]) {
        throw new Error('At least one primary image URL is required.');
      }

      const products = getStoredProducts();
      const slug = (productData.slug || productData.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const newId = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const now = new Date().toISOString();

      const newProduct = {
        id: newId,
        title: productData.title.trim(),
        subtitle: productData.subtitle?.trim() || `${productData.category} • ${productData.subcategory || 'Signature'}`,
        slug: `${slug}-${newId.substr(-4)}`,
        category: productData.category,
        subcategory: productData.subcategory || null,
        tertiaryCategory: productData.tertiaryCategory || null,
        price: Number(productData.price),
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
        discount: productData.originalPrice && Number(productData.originalPrice) > Number(productData.price)
          ? `${Math.round(((Number(productData.originalPrice) - Number(productData.price)) / Number(productData.originalPrice)) * 100)}% OFF`
          : null,
        description: productData.description?.trim() || '',
        stock: parseInt(productData.stock, 10),
        status: productData.status || (parseInt(productData.stock, 10) > 0 ? 'published' : 'out-of-stock'),
        images: productData.images.filter(img => img && typeof img === 'string' && img.trim().length > 0),
        image: productData.images[0] || '',
        badge: productData.badge?.trim() || (productData.isNew ? 'New Arrival' : ''),
        rating: productData.rating || 5.0,
        reviewsCount: productData.reviewsCount || 0,
        sizes: Array.isArray(productData.sizes) && productData.sizes.length > 0 ? productData.sizes : ['Free Size'],
        colors: Array.isArray(productData.colors) && productData.colors.length > 0 
          ? productData.colors 
          : [{ name: 'Default', hex: '#E83D70' }],
        fabric: productData.fabric?.trim() || 'Luxury Handcrafted Blend',
        createdAt: now,
        updatedAt: now
      };

      products.unshift(newProduct);
      saveStoredProducts(products);
      resolve(newProduct);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Update an existing product
 */
export const updateProduct = async (id, updateData) => {
  return new Promise((resolve, reject) => {
    try {
      const products = getStoredProducts();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error(`Product with ID "${id}" not found.`);
      }

      if (updateData.title && !updateData.title.trim()) {
        throw new Error('Product name cannot be empty.');
      }
      if (updateData.price !== undefined && (isNaN(updateData.price) || Number(updateData.price) < 0)) {
        throw new Error('Valid price is required.');
      }
      if (updateData.stock !== undefined && (isNaN(updateData.stock) || Number(updateData.stock) < 0)) {
        throw new Error('Valid stock quantity is required.');
      }

      const existing = products[index];
      const validImages = Array.isArray(updateData.images)
        ? updateData.images.filter(img => img && typeof img === 'string' && img.trim().length > 0)
        : existing.images;

      const price = updateData.price !== undefined ? Number(updateData.price) : existing.price;
      const originalPrice = updateData.originalPrice !== undefined 
        ? (updateData.originalPrice ? Number(updateData.originalPrice) : null)
        : existing.originalPrice;

      const discount = originalPrice && originalPrice > price
        ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
        : null;

      const stock = updateData.stock !== undefined ? parseInt(updateData.stock, 10) : existing.stock;
      const status = updateData.status || (stock > 0 ? (existing.status === 'out-of-stock' ? 'published' : existing.status) : 'out-of-stock');

      const updated = {
        ...existing,
        ...updateData,
        title: updateData.title ? updateData.title.trim() : existing.title,
        subtitle: updateData.subtitle ? updateData.subtitle.trim() : existing.subtitle,
        category: updateData.category !== undefined ? updateData.category : existing.category,
        subcategory: updateData.subcategory !== undefined ? updateData.subcategory : existing.subcategory,
        tertiaryCategory: updateData.tertiaryCategory !== undefined ? updateData.tertiaryCategory : existing.tertiaryCategory,
        price,
        originalPrice,
        discount,
        stock,
        status,
        description: updateData.description !== undefined ? updateData.description.trim() : existing.description,
        images: validImages,
        image: validImages[0] || existing.image,
        badge: updateData.badge !== undefined ? updateData.badge.trim() : existing.badge,
        sizes: updateData.sizes || existing.sizes,
        colors: updateData.colors || existing.colors,
        fabric: updateData.fabric !== undefined ? updateData.fabric.trim() : existing.fabric,
        updatedAt: new Date().toISOString()
      };

      products[index] = updated;
      saveStoredProducts(products);
      resolve(updated);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (id) => {
  return new Promise((resolve, reject) => {
    try {
      const products = getStoredProducts();
      const filtered = products.filter(p => p.id !== id);
      if (filtered.length === products.length) {
        throw new Error(`Product with ID "${id}" not found.`);
      }
      saveStoredProducts(filtered);
      resolve({ success: true, id });
    } catch (err) {
      reject(err);
    }
  });
};

// =========================================================================
// CATEGORY CRUD OPERATIONS
// =========================================================================

/**
 * Fetch all categories hierarchy asynchronously
 */
export const fetchCategories = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStoredCategories());
    }, 50);
  });
};

/**
 * Count products associated with a category, subcategory, or tertiary category
 */
export const getProductsCountByCategory = (categorySlug, subcategorySlug = null, tertiarySlug = null) => {
  const products = getStoredProducts();
  return products.filter(p => {
    if (tertiarySlug) {
      return p.category === categorySlug && (p.subcategory === subcategorySlug || p.tertiaryCategory === tertiarySlug);
    }
    if (subcategorySlug) {
      return p.category === categorySlug && (p.subcategory === subcategorySlug || p.tertiaryCategory === subcategorySlug);
    }
    return p.category === categorySlug;
  }).length;
};

/**
 * Create a new Category or Subcategory
 */
export const createCategory = async ({ name, slug, parentCategorySlug = null, parentSubcategorySlug = null, tagline = '', description = '', image = '' }) => {
  return new Promise((resolve, reject) => {
    try {
      if (!name || !name.trim()) {
        throw new Error('Category name is required.');
      }

      const generatedSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const categories = getStoredCategories();

      const newCategoryObj = {
        id: generatedSlug,
        name: name.trim(),
        slug: generatedSlug,
        tagline: tagline.trim() || 'Timeless craftsmanship, thoughtfully curated.',
        description: description.trim() || 'Curated luxury pieces for effortless elegance.',
        image: image.trim() || '/assets/images/featured-saree.jpg',
        children: []
      };

      if (!parentCategorySlug) {
        // Main Category
        if (categories.some(c => c.slug === generatedSlug)) {
          throw new Error(`Category with slug "${generatedSlug}" already exists.`);
        }
        newCategoryObj.path = `/category/${generatedSlug}`;
        categories.push(newCategoryObj);
      } else {
        const parent = categories.find(c => c.slug === parentCategorySlug);
        if (!parent) {
          throw new Error(`Parent category "${parentCategorySlug}" not found.`);
        }
        if (!parent.children) parent.children = [];

        if (parentSubcategorySlug) {
          // Nested sub-subcategory (e.g. Accessories -> Anti turnis -> Chains)
          const subParent = parent.children.find(s => s.slug === parentSubcategorySlug);
          if (!subParent) {
            throw new Error(`Parent subcategory "${parentSubcategorySlug}" not found.`);
          }
          if (!subParent.children) subParent.children = [];
          if (subParent.children.some(c => c.slug === generatedSlug)) {
            throw new Error(`Nested subcategory with slug "${generatedSlug}" already exists.`);
          }
          newCategoryObj.path = `/category/${parentCategorySlug}/${parentSubcategorySlug}/${generatedSlug}`;
          subParent.children.push(newCategoryObj);
        } else {
          // Subcategory
          if (parent.children.some(c => c.slug === generatedSlug)) {
            throw new Error(`Subcategory with slug "${generatedSlug}" already exists in ${parent.name}.`);
          }
          newCategoryObj.path = `/category/${parentCategorySlug}/${generatedSlug}`;
          parent.children.push(newCategoryObj);
        }
      }

      saveStoredCategories(categories);
      resolve(newCategoryObj);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Update an existing Category / Subcategory
 */
export const updateCategory = async ({ oldSlug, name, slug, parentCategorySlug = null, parentSubcategorySlug = null, tagline, description, image }) => {
  return new Promise((resolve, reject) => {
    try {
      const categories = getStoredCategories();
      const newSlug = (slug || name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      let updated = null;

      // Search and update across hierarchy
      if (!parentCategorySlug) {
        const cat = categories.find(c => c.slug === oldSlug);
        if (cat) {
          cat.name = name ? name.trim() : cat.name;
          cat.slug = newSlug;
          cat.path = `/category/${newSlug}`;
          if (tagline !== undefined) cat.tagline = tagline.trim();
          if (description !== undefined) cat.description = description.trim();
          if (image !== undefined) cat.image = image.trim();
          updated = cat;
        }
      } else {
        const parent = categories.find(c => c.slug === parentCategorySlug);
        if (parent && parent.children) {
          if (parentSubcategorySlug) {
            const subParent = parent.children.find(s => s.slug === parentSubcategorySlug);
            if (subParent && subParent.children) {
              const item = subParent.children.find(t => t.slug === oldSlug);
              if (item) {
                item.name = name ? name.trim() : item.name;
                item.slug = newSlug;
                item.path = `/category/${parentCategorySlug}/${parentSubcategorySlug}/${newSlug}`;
                if (tagline !== undefined) item.tagline = tagline.trim();
                if (description !== undefined) item.description = description.trim();
                if (image !== undefined) item.image = image.trim();
                updated = item;
              }
            }
          } else {
            const item = parent.children.find(s => s.slug === oldSlug);
            if (item) {
              item.name = name ? name.trim() : item.name;
              item.slug = newSlug;
              item.path = `/category/${parentCategorySlug}/${newSlug}`;
              if (tagline !== undefined) item.tagline = tagline.trim();
              if (description !== undefined) item.description = description.trim();
              if (image !== undefined) item.image = image.trim();
              updated = item;
            }
          }
        }
      }

      if (!updated) {
        throw new Error(`Category "${oldSlug}" not found to update.`);
      }

      // Also update products referring to oldSlug if slug changed
      if (oldSlug !== newSlug) {
        const products = getStoredProducts();
        let changed = false;
        products.forEach(p => {
          if (p.category === oldSlug) {
            p.category = newSlug;
            changed = true;
          }
          if (p.subcategory === oldSlug) {
            p.subcategory = newSlug;
            changed = true;
          }
          if (p.tertiaryCategory === oldSlug) {
            p.tertiaryCategory = newSlug;
            changed = true;
          }
        });
        if (changed) {
          saveStoredProducts(products);
        }
      }

      saveStoredCategories(categories);
      resolve(updated);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Delete a Category or Subcategory
 */
export const deleteCategory = async ({ slug, parentCategorySlug = null, parentSubcategorySlug = null }) => {
  return new Promise((resolve, reject) => {
    try {
      const categories = getStoredCategories();

      if (!parentCategorySlug) {
        // Main Category deletion
        const idx = categories.findIndex(c => c.slug === slug);
        if (idx === -1) {
          throw new Error(`Category "${slug}" not found.`);
        }
        categories.splice(idx, 1);
      } else {
        const parent = categories.find(c => c.slug === parentCategorySlug);
        if (!parent || !parent.children) {
          throw new Error(`Parent category "${parentCategorySlug}" not found.`);
        }

        if (parentSubcategorySlug) {
          const subParent = parent.children.find(s => s.slug === parentSubcategorySlug);
          if (!subParent || !subParent.children) {
            throw new Error(`Parent subcategory "${parentSubcategorySlug}" not found.`);
          }
          const subIdx = subParent.children.findIndex(t => t.slug === slug);
          if (subIdx === -1) {
            throw new Error(`Nested subcategory "${slug}" not found.`);
          }
          subParent.children.splice(subIdx, 1);
        } else {
          const idx = parent.children.findIndex(s => s.slug === slug);
          if (idx === -1) {
            throw new Error(`Subcategory "${slug}" not found in ${parent.name}.`);
          }
          parent.children.splice(idx, 1);
        }
      }

      saveStoredCategories(categories);
      resolve({ success: true, slug });
    } catch (err) {
      reject(err);
    }
  });
};
