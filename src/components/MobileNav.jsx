import React, { useState, useEffect } from 'react';
import { getStoredCategories, subscribeToStore } from '../services/storeService';

export const MobileNav = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  activeCategorySlug, 
  activeSubcategorySlug, 
  activeTertiarySlug,
  activePath 
}) => {
  const [categoriesList, setCategoriesList] = useState(getStoredCategories());
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [expandedSubmenus, setExpandedSubmenus] = useState({});

  useEffect(() => {
    const syncCats = () => {
      setCategoriesList(getStoredCategories());
    };
    const unsubscribe = subscribeToStore(syncCats);
    return () => unsubscribe();
  }, []);

  // Auto-expand active category & subcategory on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const initialExpanded = {};
      if (activeCategorySlug) {
        initialExpanded[activeCategorySlug] = true;
      }
      if (activeSubcategorySlug) {
        initialExpanded[`${activeCategorySlug}/${activeSubcategorySlug}`] = true;
        initialExpanded[activeSubcategorySlug] = true;
      }
      setExpandedSubmenus(prev => ({ ...prev, ...initialExpanded }));
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activeCategorySlug, activeSubcategorySlug]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleSubmenu = (key, e) => {
    e.stopPropagation();
    setExpandedSubmenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNavClick = (path, sectionId, category = null, subcategory = null, tertiaryCategory = null) => {
    onNavigate({ path, sectionId, category, subcategory, tertiaryCategory });
    onClose();
  };

  const mobileClickCountRef = React.useRef(0);
  const mobileClickTimerRef = React.useRef(null);

  const handleMobileLogoClick = () => {
    mobileClickCountRef.current += 1;

    if (mobileClickTimerRef.current) {
      clearTimeout(mobileClickTimerRef.current);
    }

    if (mobileClickCountRef.current === 3) {
      mobileClickCountRef.current = 0;
      handleNavClick('/admin', null);
      return;
    }

    mobileClickTimerRef.current = setTimeout(() => {
      handleNavClick('/', 'home', 'all', null, null);
      mobileClickCountRef.current = 0;
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-nav-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
      <div className="mobile-nav-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header with Brand and Close Button */}
        <div className="mobile-nav-header">
          <div 
            className="mobile-nav-brand"
            onClick={handleMobileLogoClick}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Go to Home"
          >
            <span className="brand-name" style={{ fontSize: '1.25rem' }}>DORCASS</span>
            <span className="brand-tagline" style={{ fontSize: '0.55rem' }}>Define Your Style</span>
          </div>
          <button className="mobile-nav-close-btn" onClick={onClose} aria-label="Close navigation menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation Content List */}
        <div className="mobile-nav-content">
          <ul className="mobile-nav-list">
            {/* 0. HOME (Visible when not on Home) */}
            {activePath !== '/' && activePath !== '/home' && (
              <li className="mobile-nav-item">
                <button
                  className="mobile-nav-link"
                  onClick={() => handleNavClick('/', 'home', 'all', null, null)}
                >
                  <span>HOME</span>
                </button>
              </li>
            )}

            {/* 1. NEW ARRIVALS */}
            <li className="mobile-nav-item">
              <button
                className={`mobile-nav-link ${activePath === '/new-arrivals' ? 'is-active' : ''}`}
                onClick={() => handleNavClick('/new-arrivals', null, 'all', null, null)}
              >
                <span>NEW ARRIVALS</span>
                <span className="mobile-nav-pill">New</span>
              </button>
            </li>

            {/* 2. CATEGORIES Accordion */}
            <li className="mobile-nav-item mobile-category-section">
              <div className="mobile-accordion-header">
                <button
                  className="mobile-accordion-toggle-btn"
                  onClick={() => setIsCategoriesExpanded(prev => !prev)}
                  aria-expanded={isCategoriesExpanded}
                >
                  <span className="mobile-nav-label">CATEGORIES</span>
                  <svg 
                    className={`mobile-chevron ${isCategoriesExpanded ? 'is-expanded' : ''}`} 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>

              {/* Collapsible Categories Tree */}
              {isCategoriesExpanded && (
                <ul className="mobile-sub-tree">
                  {categoriesList.map((cat) => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isCatExpanded = !!expandedSubmenus[cat.slug];
                    const isCatActive = activeCategorySlug === cat.slug && !activeSubcategorySlug && !activeTertiarySlug;

                    return (
                      <li key={cat.id} className="mobile-sub-item">
                        {hasChildren ? (
                          <div className="mobile-nested-branch">
                            <div className="mobile-nested-header">
                              <button
                                className={`mobile-nested-name ${isCatActive ? 'is-active' : ''}`}
                                onClick={() => handleNavClick(cat.path, null, cat.slug, null, null)}
                              >
                                {cat.name}
                              </button>
                              <button
                                className="mobile-nested-toggle"
                                onClick={(e) => toggleSubmenu(cat.slug, e)}
                                aria-label={`Toggle ${cat.name} subcategories`}
                                aria-expanded={isCatExpanded}
                              >
                                <svg 
                                  className={`mobile-nested-chevron ${isCatExpanded ? 'is-expanded' : ''}`} 
                                  width="16" 
                                  height="16" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5"
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </button>
                            </div>

                            {/* Level 2 Sub-list */}
                            {isCatExpanded && (
                              <ul className="mobile-leaf-list">
                                <li className="mobile-leaf-item">
                                  <button
                                    className={`mobile-leaf-link view-all ${isCatActive ? 'is-active' : ''}`}
                                    onClick={() => handleNavClick(cat.path, null, cat.slug, null, null)}
                                  >
                                    <span>All {cat.name}</span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                  </button>
                                </li>

                                {cat.children.map((sub) => {
                                  const hasGrandChildren = sub.children && sub.children.length > 0;
                                  const subKey = `${cat.slug}/${sub.slug}`;
                                  const isSubExpanded = !!expandedSubmenus[subKey] || !!expandedSubmenus[sub.slug];
                                  const isSubActive = activeCategorySlug === cat.slug && activeSubcategorySlug === sub.slug && !activeTertiarySlug;

                                  if (hasGrandChildren) {
                                    // Secondary Nested Accordion (e.g. Anti turnis, Hair accessories)
                                    return (
                                      <li key={sub.id} className="mobile-sub-group-item">
                                        <div className="mobile-nested-branch mobile-sub-group-branch">
                                          <div className="mobile-nested-header">
                                            <button
                                              className={`mobile-nested-name mobile-sub-group-name ${isSubActive ? 'is-active' : ''}`}
                                              onClick={() => handleNavClick(sub.path, null, cat.slug, sub.slug, null)}
                                            >
                                              {sub.name}
                                            </button>
                                            <button
                                              className="mobile-nested-toggle"
                                              onClick={(e) => toggleSubmenu(subKey, e)}
                                              aria-label={`Toggle ${sub.name} items`}
                                              aria-expanded={isSubExpanded}
                                            >
                                              <svg 
                                                className={`mobile-nested-chevron ${isSubExpanded ? 'is-expanded' : ''}`} 
                                                width="14" 
                                                height="14" 
                                                viewBox="0 0 24 24" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                strokeWidth="2.5"
                                              >
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                              </svg>
                                            </button>
                                          </div>

                                          {/* Level 3 Leaf List */}
                                          {isSubExpanded && (
                                            <ul className="mobile-leaf-list mobile-sub-leaf-list">
                                              <li className="mobile-leaf-item">
                                                <button
                                                  className={`mobile-leaf-link view-all ${isSubActive ? 'is-active' : ''}`}
                                                  onClick={() => handleNavClick(sub.path, null, cat.slug, sub.slug, null)}
                                                >
                                                  <span>All {sub.name}</span>
                                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="9 18 15 12 9 6"></polyline>
                                                  </svg>
                                                </button>
                                              </li>
                                              {sub.children.map((leaf) => {
                                                const isLeafActive = activeCategorySlug === cat.slug && 
                                                                    activeSubcategorySlug === sub.slug && 
                                                                    activeTertiarySlug === leaf.slug;
                                                return (
                                                  <li key={leaf.id} className="mobile-leaf-item">
                                                    <button
                                                      className={`mobile-leaf-link ${isLeafActive ? 'is-active' : ''}`}
                                                      onClick={() => handleNavClick(leaf.path, null, cat.slug, sub.slug, leaf.slug)}
                                                    >
                                                      <span className="leaf-bullet">•</span>
                                                      <span>{leaf.name}</span>
                                                    </button>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          )}
                                        </div>
                                      </li>
                                    );
                                  }

                                  // Standard Leaf Subcategory Link
                                  return (
                                    <li key={sub.id} className="mobile-leaf-item">
                                      <button
                                        className={`mobile-leaf-link ${isSubActive ? 'is-active' : ''}`}
                                        onClick={() => handleNavClick(sub.path, null, cat.slug, sub.slug, null)}
                                      >
                                        <span className="leaf-bullet">•</span>
                                        <span>{sub.name}</span>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        ) : (
                          // Standalone category without children (e.g. Kurtis)
                          <button
                            className={`mobile-standalone-link ${isCatActive ? 'is-active' : ''}`}
                            onClick={() => handleNavClick(cat.path, null, cat.slug, null, null)}
                          >
                            <span>{cat.name}</span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            {/* 3. ABOUT */}
            <li className="mobile-nav-item">
              <button
                className={`mobile-nav-link ${activePath === '/about' ? 'is-active' : ''}`}
                onClick={() => handleNavClick('/about', 'story', null, null, null)}
              >
                <span>ABOUT</span>
              </button>
            </li>

            {/* 4. CONTACT */}
            <li className="mobile-nav-item">
              <button
                className={`mobile-nav-link ${activePath === '/contact' ? 'is-active' : ''}`}
                onClick={() => handleNavClick('/contact', 'footer', null, null, null)}
              >
                <span>CONTACT</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile Nav Footer */}
        <div className="mobile-nav-footer">
          <div className="mobile-nav-contact-info">
            <div className="mobile-contact-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>6th Street, cross cut, Gandhipuram, Coimbatore</span>
            </div>
            <div className="mobile-contact-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <a href="mailto:dorcasspopstore@gmail.com" className="mobile-contact-link">dorcasspopstore@gmail.com</a>
            </div>
          </div>

          <div className="mobile-nav-quick-actions">
            <a 
              href="https://wa.me/917305323208?text=Hello%20DORCASS%2C%20I%20am%20interested%20in%20your%20collection" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mobile-quick-btn whatsapp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a 
              href="tel:+917305323208" 
              className="mobile-quick-btn phone"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

