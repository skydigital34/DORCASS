import React, { useState, useRef, useEffect } from 'react';
import { CategoryDropdown } from './CategoryDropdown';
import { MobileNav } from './MobileNav';

export const Header = ({ 
  onOpenSearch, 
  onOpenCart, 
  cartCount, 
  userAvatar, 
  onNavigate,
  activeCategorySlug,
  activeSubcategorySlug,
  activeTertiarySlug,
  activePath = '/'
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const navCategoriesRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Desktop hover interactions with slight delay to prevent abrupt closes
  const handleMouseEnterCategories = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeaveCategories = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 180);
  };

  // Toggle on click / enter key
  const handleCategoriesClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(prev => !prev);
  };

  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleDirectNav = (e, path, sectionId, category = null, subcategory = null, tertiaryCategory = null) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsDropdownOpen(false);
    if (onNavigate) {
      onNavigate({ path, sectionId, category, subcategory, tertiaryCategory });
    }
  };

  // Hidden triple-click trigger for Admin Portal
  const handleLogoClick = (e) => {
    e.preventDefault();
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;
      if (onNavigate) {
        onNavigate({ path: '/admin' });
      }
      return;
    }

    // Normal click timeout window
    clickTimerRef.current = setTimeout(() => {
      handleDirectNav(null, '/', 'home', 'all', null, null);
      clickCountRef.current = 0;
    }, 500);
  };

  return (
    <>
      <header className="main-header" role="banner">
        <div className="header-container">
          {/* Left Brand Logo (Triple-click opens Admin Portal, single click takes to Home) */}
          <a 
            href="/" 
            className="brand-logo-container" 
            onClick={handleLogoClick}
            aria-label="DORCASS Home"
          >
            <span className="brand-name">DORCASS</span>
            <span className="brand-tagline">Define Your Style</span>
          </a>

          {/* Right Group: Navigation Links (Desktop) + Actions */}
          <div className="header-right-group">
            {/* Navigation Links (Desktop) */}
            <nav className="header-nav" role="navigation" aria-label="Main Navigation">
              <ul className="nav-links">
                {/* 0. HOME (Visible when not on home page) */}
                {activePath !== '/' && activePath !== '/home' && (
                  <li className="nav-item">
                    <a 
                      href="/" 
                      onClick={(e) => handleDirectNav(e, '/', 'home', 'all', null, null)}
                    >
                      HOME
                    </a>
                  </li>
                )}

                {/* 1. NEW ARRIVALS */}
                <li className={`nav-item ${activePath === '/new-arrivals' ? 'active' : ''}`}>
                  <a 
                    href="/new-arrivals" 
                    onClick={(e) => handleDirectNav(e, '/new-arrivals', null, 'all', null, null)}
                  >
                    NEW ARRIVALS
                  </a>
                </li>

                {/* 2. CATEGORIES (Interactive Dropdown) */}
                <li 
                  className={`nav-item has-dropdown ${isDropdownOpen || activePath.startsWith('/category') || activePath.startsWith('/categories') ? 'active' : ''}`}
                  ref={navCategoriesRef}
                  onMouseEnter={handleMouseEnterCategories}
                  onMouseLeave={handleMouseLeaveCategories}
                >
                  <button 
                    className="nav-link-btn"
                    onClick={handleCategoriesClick}
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                    aria-label="Categories menu"
                  >
                    <span>CATEGORIES</span>
                    <svg 
                      className={`nav-dropdown-chevron ${isDropdownOpen ? 'is-open' : ''}`} 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Desktop Categories Flyout Dropdown */}
                  <CategoryDropdown 
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    onNavigate={onNavigate}
                    activeCategorySlug={activeCategorySlug}
                    activeSubcategorySlug={activeSubcategorySlug}
                    activeTertiarySlug={activeTertiarySlug}
                  />
                </li>

                {/* 3. ABOUT */}
                <li className={`nav-item ${activePath === '/about' ? 'active' : ''}`}>
                  <a 
                    href="/about" 
                    onClick={(e) => handleDirectNav(e, '/about', 'story', null, null, null)}
                  >
                    ABOUT
                  </a>
                </li>

                {/* 4. CONTACT */}
                <li className={`nav-item ${activePath === '/contact' ? 'active' : ''}`}>
                  <a 
                    href="/contact" 
                    onClick={(e) => handleDirectNav(e, '/contact', 'footer', null, null, null)}
                  >
                    CONTACT
                  </a>
                </li>
              </ul>
            </nav>

            {/* Mobile Hamburger Menu Toggle Button (Visible on <= 992px) */}
            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open Mobile Menu"
              aria-expanded={isMobileNavOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            {/* Right Action Items (WhatsApp, Search, Avatar, Cart Pill) */}
            <div className="header-actions">
              {/* WhatsApp Quick Chat Button */}
              <a 
                href="https://wa.me/917305323208?text=Hello%20DORCASS%2C%20I%20am%20interested%20in%20your%20luxury%20collection" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="header-whatsapp-btn"
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp (+91 73053 23208)"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>

              <button 
                className="action-btn" 
                onClick={onOpenSearch} 
                aria-label="Search Catalog" 
                title="Search"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              <button className="user-profile-btn" aria-label="User Profile" title="My Account">
                <img src={userAvatar || "/assets/images/avatar-1.jpg"} alt="User Profile" />
              </button>

              {/* Cart Pill Button (Outlined pill with cart icon + item count) */}
              <button 
                className="cart-pill-btn" 
                onClick={onOpenCart} 
                aria-label="Shopping Bag"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onNavigate={onNavigate}
        activeCategorySlug={activeCategorySlug}
        activeSubcategorySlug={activeSubcategorySlug}
        activeTertiarySlug={activeTertiarySlug}
        activePath={activePath}
      />
    </>
  );
};
