import React from 'react';

export const Header = ({ onOpenSearch, onOpenCart, cartCount, userAvatar }) => {
  return (
    <header className="main-header">
      {/* Left Navigation Links */}
      <nav>
        <ul className="nav-links">
          <li className="nav-item active"><a href="#home">Shop</a></li>
          <li className="nav-item"><a href="#shopCatalog">New In</a></li>
          <li className="nav-item"><a href="#collections">Collections</a></li>
          <li className="nav-item"><a href="#story">About</a></li>
          <li className="nav-item"><a href="#footer">Contact</a></li>
        </ul>
      </nav>



      {/* Right Action Items (Search, Avatar, Cart Pill) */}
      <div className="header-actions">
        <button 
          className="action-btn" 
          onClick={onOpenSearch} 
          aria-label="Search Catalog" 
          title="Search"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>

        <button className="user-profile-btn" aria-label="User Profile" title="My Account">
          <img src={userAvatar || "/assets/images/avatar-1.jpg"} alt="User Profile" />
        </button>

        {/* Cart Pill Button (Exact Match: Outlined pill with cart icon + '1 item') */}
        <button 
          className="cart-pill-btn" 
          onClick={onOpenCart} 
          aria-label="Shopping Bag"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        </button>
      </div>
    </header>
  );
};
