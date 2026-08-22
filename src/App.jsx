import React, { useState, useEffect, useCallback } from 'react';
import './styles/style.css';
import './styles/responsive.css';

import { storeData } from './data/storeData';
import { resolveNavigationFromPath } from './data/categoriesData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CategoryPage } from './components/CategoryPage';
import { CuratedCollections } from './components/CuratedCollections';
import { BrandStory } from './components/BrandStory';
import { Reviews } from './components/Reviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchOverlay } from './components/SearchOverlay';
import { Toast } from './components/Toast';
import { WhatsAppFloatingBtn } from './components/WhatsAppFloatingBtn';
import { generateCartWhatsAppUrl } from './utils/whatsapp';
import { AdminPortal } from './admin/AdminPortal';
import { getStoredProducts, getStoredCategories, subscribeToStore } from './services/storeService';

export function App() {
  // Live Store & Inventory State
  const [products, setProducts] = useState(getStoredProducts());
  const [categories, setCategories] = useState(getStoredCategories());

  // Subscribe to live store updates across admin & storefront
  useEffect(() => {
    const syncStore = () => {
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
    };
    const unsubscribe = subscribeToStore(syncStore);
    return () => unsubscribe();
  }, []);

  // Navigation & Category Filtering State
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [activeTertiaryCategory, setActiveTertiaryCategory] = useState(null);

  // Cart State (Initialized with 0 items)
  const [cart, setCart] = useState([]);

  const [wishlist, setWishlist] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast notification helper
  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  // Synchronize state with URL path
  const syncRouteState = useCallback((pathname, shouldScroll = false) => {
    setCurrentPath(pathname);
    const resolved = resolveNavigationFromPath(pathname);

    if (resolved) {
      if (resolved.categorySlug) {
        setActiveCategory(resolved.categorySlug);
      }
      setActiveSubcategory(resolved.subcategorySlug || null);
      setActiveTertiaryCategory(resolved.tertiarySlug || null);

      if (shouldScroll && resolved.sectionId) {
        const el = document.getElementById(resolved.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setActiveCategory('all');
      setActiveSubcategory(null);
      setActiveTertiaryCategory(null);
    }
  }, []);

  // Listen to browser popstate (back/forward) and initial load
  useEffect(() => {
    syncRouteState(window.location.pathname, false);

    const handlePopState = () => {
      syncRouteState(window.location.pathname, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [syncRouteState]);

  // Unified navigation handler
  const handleNavigate = useCallback(({ path, sectionId = null, category = null, subcategory = null, tertiaryCategory = null }) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    setCurrentPath(path);

    if (category) {
      setActiveCategory(category);
    }
    setActiveSubcategory(subcategory);
    setActiveTertiaryCategory(tertiaryCategory);

    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Catalog Category Tab / Filter Change (For Home Catalog preview)
  const handleCategoryChange = (catId, subcatId = null, tertiaryId = null) => {
    let newPath = '/category/sarees';
    if (catId && catId !== 'all') {
      newPath = `/category/${catId}`;
      if (subcatId) {
        newPath += `/${subcatId}`;
        if (tertiaryId) {
          newPath += `/${tertiaryId}`;
        }
      }
    }
    
    handleNavigate({
      path: newPath,
      category: catId,
      subcategory: subcatId,
      tertiaryCategory: tertiaryId
    });
  };

  // Add to cart handler
  const handleAddToCart = (product, quantity = 1, size = null, color = null) => {
    const itemSize = size || (product.sizes ? product.sizes[0] : 'Free Size');
    const itemColor = color || (product.colors ? product.colors[0].name : 'Default');

    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === product.id && i.size === itemSize && i.color === itemColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            size: itemSize,
            color: itemColor,
            quantity
          }
        ];
      }
    });

    addToast(`✨ Added "${product.title}" to your bag!`);
    setIsCartOpen(true);
  };

  // Quantity updater
  const handleUpdateQty = (productId, size, color, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === productId && item.size === size && item.color === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Remove item
  const handleRemoveItem = (productId, size, color) => {
    setCart(prev => prev.filter(
      item => !(item.id === productId && item.size === size && item.color === color)
    ));
    addToast('Item removed from shopping bag');
  };

  // Checkout handler (Redirects to WhatsApp with cart details)
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const whatsappUrl = generateCartWhatsAppUrl(cart);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    addToast('Redirecting to WhatsApp with your order details...');
    setIsCartOpen(false);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        addToast('Removed from your Wishlist');
      } else {
        next.add(productId);
        addToast('❤️ Added to your Wishlist!');
      }
      return next;
    });
  };

  // Quick view opener
  const handleOpenQuickView = (productId) => {
    const product = products.find(p => p.id === productId) || products[0] || null;
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Smooth scroll explore handler
  const handleExplore = (e) => {
    e.preventDefault();
    handleNavigate({
      path: '/category/sarees',
      category: 'sarees',
      subcategory: null,
      tertiaryCategory: null
    });
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine current page view
  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin');
  const isHomePage = currentPath === '/' || currentPath === '/home';
  const isAboutPage = currentPath === '/about';
  const isContactPage = currentPath === '/contact';
  const isCategoryOrNewArrivals = !isHomePage && !isAboutPage && !isContactPage && !isAdminRoute;

  const currentCategoryInfo = resolveNavigationFromPath(currentPath);

  // If in Admin Portal, render dedicated Admin Area
  if (isAdminRoute) {
    return (
      <>
        <AdminPortal 
          onNavigateStore={() => handleNavigate({ path: '/' })} 
          onToast={addToast} 
        />
        <Toast toasts={toasts} />
      </>
    );
  }

  return (
    <div className="site-wrapper">
      {/* Global Header with Main Nav & Categories Mega-Menu */}
      <Header 
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartTotalItems}
        userAvatar="/assets/images/avatar-1.jpg"
        onNavigate={handleNavigate}
        activeCategorySlug={activeCategory}
        activeSubcategorySlug={activeSubcategory}
        activeTertiarySlug={activeTertiaryCategory}
        activePath={currentPath}
      />

      {/* Main View Router */}
      {isCategoryOrNewArrivals ? (
        /* DEDICATED REUSABLE DYNAMIC CATEGORY PAGE */
        <CategoryPage 
          categoryInfo={currentCategoryInfo}
          products={products}
          onAddToCart={handleAddToCart}
          onQuickView={handleOpenQuickView}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onNavigate={handleNavigate}
          isNewArrivals={currentPath === '/new-arrivals'}
        />
      ) : (
        /* HOME LANDING PAGE */
        <>
          <main className="mockup-canvas" id="home">
            <Hero 
              featuredProduct={products[0] || null}
              onQuickView={handleOpenQuickView}
              onExplore={handleExplore}
            />
          </main>

          <ProductCatalog 
            categories={categories}
            products={products}
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenQuickView}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            activeTertiaryCategory={activeTertiaryCategory}
            onCategoryChange={handleCategoryChange}
          />

          <CuratedCollections onNavigate={handleNavigate} />

          <BrandStory />

          <Reviews testimonials={storeData.testimonials} />

          <Newsletter onSubscribe={(email) => addToast('💌 Welcome to VIP Club! Use code DORCASS20 for 20% OFF')} />
        </>
      )}

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals & Overlays */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <QuickViewModal 
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={handleCloseQuickView}
        onAddToCart={(prod, qty, size, col) => {
          handleAddToCart(prod, qty, size, col);
          handleCloseQuickView();
        }}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onQuickView={handleOpenQuickView}
      />

      <Toast toasts={toasts} />
      <WhatsAppFloatingBtn />
    </div>
  );
}

export default App;

