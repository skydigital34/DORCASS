// DORCASS - Interactive E-Commerce Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // State Management
  const state = {
    cart: [
      {
        id: 'prod-1',
        title: 'Elegant Saree - Rose Silk',
        price: 1299.00,
        image: 'assets/images/featured-saree.jpg',
        size: 'Free Size',
        color: 'Blush Rose',
        quantity: 1
      }
    ],
    wishlist: new Set(),
    activeCategory: 'all',
    searchQuery: '',
    discountPercent: 0,
    appliedCoupon: null
  };

  // DOM Elements
  const cartPillBtn = document.getElementById('cartPillBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartItemCountNav = document.getElementById('cartItemCountNav');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearchBtn = document.getElementById('closeSearchBtn');
  const searchInput = document.getElementById('searchInput');
  const searchResultsGrid = document.getElementById('searchResultsGrid');
  
  const quickViewBackdrop = document.getElementById('quickViewBackdrop');
  const closeQuickViewBtn = document.getElementById('closeQuickViewBtn');
  const quickViewContainer = document.getElementById('quickViewContainer');

  const productsGrid = document.getElementById('productsGrid');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const sortSelect = document.getElementById('sortSelect');
  const toastContainer = document.getElementById('toastContainer');
  const newsletterForm = document.getElementById('newsletterForm');

  // Initialize UI
  renderProducts();
  updateCartUI();

  // --- Cart Drawer Interactions ---
  function openCart() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (cartPillBtn) cartPillBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // Update Cart UI
  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update Header Pill
    if (cartItemCountNav) {
      cartItemCountNav.textContent = `${totalItems} item${totalItems === 1 ? '' : 's'}`;
    }

    if (!cartItemsList) return;

    if (state.cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; color: var(--brand-pink-primary);">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-main);">Your bag is empty</p>
          <p style="font-size: 0.9rem; margin-top: 4px;">Discover pieces tailored to your style</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '₹0.00';
      if (cartTotalEl) cartTotalEl.textContent = '₹0.00';
      return;
    }

    cartItemsList.innerHTML = state.cart.map(item => `
      <div class="cart-item-card" data-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
            ${item.size ? `Size: ${item.size}` : ''} ${item.color ? `• ${item.color}` : ''}
          </div>
          <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
          <div class="qty-control">
            <button class="qty-btn dec-btn" data-id="${item.id}">-</button>
            <span style="font-size: 0.9rem; font-weight: 600; padding: 0 4px;">${item.quantity}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="remove-cart-item" data-id="${item.id}" style="color: var(--text-muted); padding: 4px;" title="Remove">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `).join('');

    // Attach Event Listeners to Cart Item buttons
    cartItemsList.querySelectorAll('.inc-btn').forEach(btn => {
      btn.addEventListener('click', () => changeItemQuantity(btn.dataset.id, 1));
    });
    cartItemsList.querySelectorAll('.dec-btn').forEach(btn => {
      btn.addEventListener('click', () => changeItemQuantity(btn.dataset.id, -1));
    });
    cartItemsList.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', () => removeItemFromCart(btn.dataset.id));
    });

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * (state.discountPercent / 100);
    const total = Math.max(0, subtotal - discount);

    if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (cartTotalEl) cartTotalEl.textContent = `₹${total.toFixed(2)}`;
  }

  function changeItemQuantity(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItemFromCart(productId);
    } else {
      updateCartUI();
    }
  }

  function removeItemFromCart(productId) {
    state.cart = state.cart.filter(i => i.id !== productId);
    updateCartUI();
    showToast('Item removed from shopping bag');
  }

  function addToCart(product, quantity = 1, size = null, color = null) {
    const existingIndex = state.cart.findIndex(i => i.id === product.id && i.size === size && i.color === color);
    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        size: size || (product.sizes ? product.sizes[0] : 'Free Size'),
        color: color || (product.colors ? product.colors[0].name : 'Default'),
        quantity: quantity
      });
    }
    updateCartUI();
    showToast(`✨ Added "${product.title}" to your bag!`);
  }

  // --- Quick View Modal Interactions ---
  window.openQuickView = function(productId) {
    const product = storeData.products.find(p => p.id === productId) || storeData.products[0];
    if (!product) return;

    quickViewContainer.innerHTML = `
      <div class="quick-view-content">
        <div class="quick-view-gallery">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span class="section-tag" style="margin: 0;">${product.badge || 'DORCASS Signature'}</span>
              <div style="color: #D4AF37; font-weight: 700; font-size: 0.9rem;">★ ${product.rating} (${product.reviewsCount} reviews)</div>
            </div>
            <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px;">
              ${product.title}
            </h2>
            <div style="font-size: 0.95rem; color: var(--text-muted); margin-bottom: 16px;">
              ${product.subtitle}
            </div>
            <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px;">
              <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; color: var(--brand-pink-deep);">
                ₹${product.price.toFixed(2)}
              </span>
              <span style="font-size: 1.1rem; color: var(--text-light); text-decoration: line-through;">
                ₹${product.originalPrice.toFixed(2)}
              </span>
              <span style="background: #FFE8EF; color: var(--brand-pink-primary); padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.82rem;">
                ${product.discount}
              </span>
            </div>
            
            <p style="font-size: 0.95rem; color: var(--text-body); line-height: 1.6; margin-bottom: 24px;">
              ${product.description}
            </p>

            ${product.colors ? `
              <div style="margin-bottom: 20px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: var(--text-main);">
                  Color: <span id="selectedColorName" style="color: var(--brand-pink-primary); font-weight: 600;">${product.colors[0].name}</span>
                </label>
                <div style="display: flex; gap: 10px;">
                  ${product.colors.map((c, idx) => `
                    <button class="color-swatch-btn ${idx === 0 ? 'active' : ''}" data-color="${c.name}" style="width: 32px; height: 32px; border-radius: 50%; background: ${c.hex}; border: 2px solid ${idx === 0 ? 'var(--brand-pink-primary)' : '#FFFFFF'}; box-shadow: 0 2px 6px rgba(0,0,0,0.15); cursor: pointer;"></button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${product.sizes ? `
              <div style="margin-bottom: 24px;">
                <label style="display: block; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; color: var(--text-main);">
                  Select Size
                </label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  ${product.sizes.map((s, idx) => `
                    <button class="size-select-btn ${idx === 0 ? 'active' : ''}" data-size="${s}" style="padding: 8px 18px; border-radius: 12px; border: 1.5px solid ${idx === 0 ? 'var(--brand-pink-primary)' : 'var(--brand-pink-border)'}; background: ${idx === 0 ? 'var(--brand-pink-subtle)' : '#FFFFFF'}; color: ${idx === 0 ? 'var(--brand-pink-primary)' : 'var(--text-main)'}; font-weight: 700; font-size: 0.9rem; cursor: pointer;">
                      ${s}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div>
            <div style="display: flex; gap: 16px; margin-top: 12px;">
              <button id="modalAddToCartBtn" style="flex: 1; padding: 14px 28px; background: var(--brand-pink-primary); color: #FFFFFF; border-radius: 40px; font-weight: 700; font-size: 1.05rem; box-shadow: 0 8px 24px rgba(232, 61, 112, 0.35); display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Bag • ₹${product.price.toFixed(2)}
              </button>
            </div>
            <div style="margin-top: 16px; font-size: 0.82rem; color: var(--text-muted); display: flex; align-items: center; gap: 16px;">
              <span>✓ Free Express Shipping</span>
              <span>✓ 7-Day Easy Return</span>
              <span>✓ 100% Genuine</span>
            </div>
          </div>
        </div>
      </div>
    `;

    let selectedSize = product.sizes ? product.sizes[0] : 'Free Size';
    let selectedColor = product.colors ? product.colors[0].name : 'Default';

    // Swatches and Size selection bindings
    quickViewContainer.querySelectorAll('.size-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quickViewContainer.querySelectorAll('.size-select-btn').forEach(b => {
          b.style.borderColor = 'var(--brand-pink-border)';
          b.style.background = '#FFFFFF';
          b.style.color = 'var(--text-main)';
        });
        btn.style.borderColor = 'var(--brand-pink-primary)';
        btn.style.background = 'var(--brand-pink-subtle)';
        btn.style.color = 'var(--brand-pink-primary)';
        selectedSize = btn.dataset.size;
      });
    });

    quickViewContainer.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        quickViewContainer.querySelectorAll('.color-swatch-btn').forEach(b => b.style.borderColor = '#FFFFFF');
        btn.style.borderColor = 'var(--brand-pink-primary)';
        selectedColor = btn.dataset.color;
        const colorNameEl = quickViewContainer.querySelector('#selectedColorName');
        if (colorNameEl) colorNameEl.textContent = selectedColor;
      });
    });

    const modalAddBtn = quickViewContainer.querySelector('#modalAddToCartBtn');
    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        addToCart(product, 1, selectedSize, selectedColor);
        closeQuickView();
        openCart();
      });
    }

    quickViewBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeQuickView() {
    quickViewBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener('click', closeQuickView);
  if (quickViewBackdrop) {
    quickViewBackdrop.addEventListener('click', (e) => {
      if (e.target === quickViewBackdrop) closeQuickView();
    });
  }

  // --- Featured Look Click Handler (Hero Card) ---
  const heroFeaturedLookBtn = document.getElementById('heroFeaturedLookBtn');
  const heroFeaturedCard = document.getElementById('heroFeaturedCard');
  if (heroFeaturedLookBtn) {
    heroFeaturedLookBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.openQuickView('prod-1');
    });
  }
  if (heroFeaturedCard) {
    heroFeaturedCard.addEventListener('click', () => {
      window.openQuickView('prod-1');
    });
  }

  // --- Render Products Catalog ---
  function renderProducts() {
    if (!productsGrid) return;

    let filtered = storeData.products;
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === state.activeCategory);
    }

    // Sorting
    const sortVal = sortSelect ? sortSelect.value : 'featured';
    if (sortVal === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    productsGrid.innerHTML = filtered.map(product => `
      <div class="product-card">
        <div class="product-thumb-box">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          <button class="product-wishlist-btn ${state.wishlist.has(product.id) ? 'active' : ''}" data-id="${product.id}" title="Add to Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${state.wishlist.has(product.id) ? 'var(--brand-pink-primary)' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img class="product-thumb-img" src="${product.image}" alt="${product.title}">
          <div class="product-quick-view-overlay">
            <button class="quick-view-btn" onclick="openQuickView('${product.id}')">Quick View</button>
          </div>
        </div>
        <div class="product-info-box">
          <div class="product-rating">
            <span>★ ${product.rating}</span>
            <span class="count">(${product.reviewsCount})</span>
          </div>
          <h3 class="product-title">${product.title}</h3>
          <p class="product-sub">${product.subtitle}</p>
          <div class="product-price-row">
            <div class="price-container">
              <span class="current-price">₹${product.price.toFixed(2)}</span>
              <span class="original-price">₹${product.originalPrice.toFixed(2)}</span>
            </div>
            <button class="product-add-cart-btn" data-id="${product.id}" title="Add to Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Attach button listeners in product grid
    productsGrid.querySelectorAll('.product-add-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = storeData.products.find(item => item.id === btn.dataset.id);
        if (p) {
          addToCart(p);
          openCart();
        }
      });
    });

    productsGrid.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (state.wishlist.has(id)) {
          state.wishlist.delete(id);
          showToast('Removed from your Wishlist');
        } else {
          state.wishlist.add(id);
          showToast('❤️ Added to your Wishlist!');
        }
        renderProducts();
      });
    });
  }

  // Filter Tabs Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeCategory = tab.dataset.category;
      renderProducts();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', renderProducts);
  }

  // --- Search Overlay Interactions ---
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      searchInput.focus();
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchResultsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 20px;">Type keywords like "Saree", "Dress", "Graphic Tee"...</p>';
        return;
      }
      const results = storeData.products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );

      if (results.length === 0) {
        searchResultsGrid.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 20px;">No matching pieces found.</p>';
      } else {
        searchResultsGrid.innerHTML = results.map(p => `
          <div style="display: flex; gap: 14px; align-items: center; background: var(--brand-pink-subtle); padding: 10px 14px; border-radius: 16px; cursor: pointer;" onclick="openQuickView('${p.id}'); document.getElementById('searchOverlay').classList.remove('active'); document.body.style.overflow='';">
            <img src="${p.image}" style="width: 50px; height: 50px; border-radius: 10px; object-fit: cover;">
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${p.title}</div>
              <div style="font-weight: 700; color: var(--brand-pink-deep); font-size: 0.9rem;">₹${p.price.toFixed(2)}</div>
            </div>
          </div>
        `).join('');
      }
    });
  }

  // --- Checkout Simulation ---
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Your bag is empty!');
        return;
      }
      showToast('🎉 Order placed successfully! Thank you for choosing DORCASS.');
      state.cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // --- Newsletter Form ---
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input');
      if (emailInput && emailInput.value) {
        showToast('💌 Welcome to the VIP Club! Use code DORCASS20 for 20% OFF');
        emailInput.value = '';
      }
    });
  }

  // --- Toast Notification Helper ---
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = '0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Smooth Scroll for "Explore Now" ---
  const exploreCtaBtn = document.getElementById('exploreCtaBtn');
  if (exploreCtaBtn) {
    exploreCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('shopCatalog');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
