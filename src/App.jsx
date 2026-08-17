import React, { useState, useEffect } from 'react';
import './styles/style.css';
import './styles/responsive.css';

import { storeData } from './data/storeData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CuratedCollections } from './components/CuratedCollections';
import { BrandStory } from './components/BrandStory';
import { Reviews } from './components/Reviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchOverlay } from './components/SearchOverlay';
import { Toast } from './components/Toast';

export function App() {
  // Cart State (Initialized with 1 item matching mockup)
  const [cart, setCart] = useState([
    {
      id: 'prod-1',
      title: 'Elegant Saree - Rose Silk',
      price: 1299.00,
      image: '/assets/images/featured-saree.jpg',
      size: 'Free Size',
      color: 'Blush Rose',
      quantity: 1
    }
  ]);

  const [wishlist, setWishlist] = useState(new Set());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Add Toast helper
  const addToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
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

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) return;
    addToast('🎉 Order placed successfully! Thank you for choosing DORCASS.');
    setCart([]);
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
    const product = storeData.products.find(p => p.id === productId) || storeData.products[0];
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Smooth scroll
  const handleExplore = (e) => {
    e.preventDefault();
    const catalog = document.getElementById('shopCatalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="site-wrapper">
      {/* Main Mockup Canvas Frame (1:1 with Reference Design) */}
      <main className="mockup-canvas" id="home">
        {/* Header */}
        <Header 
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cartTotalItems}
          userAvatar="/assets/images/avatar-1.jpg"
        />

        {/* Hero Section */}
        <Hero 
          featuredProduct={storeData.products[0]}
          onQuickView={handleOpenQuickView}
          onExplore={handleExplore}
        />
      </main>

      {/* Extended Store Catalog */}
      <ProductCatalog 
        categories={storeData.categories}
        products={storeData.products}
        onAddToCart={handleAddToCart}
        onQuickView={handleOpenQuickView}
        wishlist={wishlist}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Curated Collections */}
      <CuratedCollections onQuickView={handleOpenQuickView} />

      {/* Brand Story & Sustainability */}
      <BrandStory />

      {/* Reviews & Social Proof */}
      <Reviews testimonials={storeData.testimonials} />

      {/* Newsletter */}
      <Newsletter onSubscribe={(email) => addToast('💌 Welcome to VIP Club! Use code DORCASS20 for 20% OFF')} />

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
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
        products={storeData.products}
        onQuickView={handleOpenQuickView}
      />

      <Toast toasts={toasts} />
    </div>
  );
}

export default App;
