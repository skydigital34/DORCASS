import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES_DATA } from '../data/categoriesData';

export const CategoryDropdown = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  activeCategorySlug, 
  activeSubcategorySlug,
  activeTertiarySlug 
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(CATEGORIES_DATA[0]);
  const dropdownRef = useRef(null);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset hovered category on open to the active category or first category
  useEffect(() => {
    if (isOpen) {
      const current = CATEGORIES_DATA.find(c => c.slug === activeCategorySlug);
      if (current) {
        setHoveredCategory(current);
      } else {
        setHoveredCategory(CATEGORIES_DATA[0]);
      }
    }
  }, [isOpen, activeCategorySlug]);

  if (!isOpen) return null;

  const handleCategoryClick = (category, e) => {
    e.preventDefault();
    onNavigate({
      path: category.path,
      category: category.slug,
      subcategory: null,
      tertiaryCategory: null
    });
    onClose();
  };

  const handleSubcategoryClick = (category, subcategory, e) => {
    e.preventDefault();
    onNavigate({
      path: subcategory.path,
      category: category.slug,
      subcategory: subcategory.slug,
      tertiaryCategory: null
    });
    onClose();
  };

  const handleTertiaryClick = (category, subcategory, leaf, e) => {
    e.preventDefault();
    onNavigate({
      path: leaf.path,
      category: category.slug,
      subcategory: subcategory.slug,
      tertiaryCategory: leaf.slug
    });
    onClose();
  };

  // Keyboard navigation helpers
  const handleCatKeyDown = (e, index, cat) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextItem = dropdownRef.current?.querySelectorAll('.dropdown-cat-link')[index + 1];
      if (nextItem) nextItem.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevItem = dropdownRef.current?.querySelectorAll('.dropdown-cat-link')[index - 1];
      if (prevItem) prevItem.focus();
    } else if (e.key === 'ArrowRight' && cat.children?.length > 0) {
      e.preventDefault();
      const firstSub = dropdownRef.current?.querySelector('.dropdown-subcategories-pane a');
      if (firstSub) firstSub.focus();
    }
  };

  const hasChildren = hoveredCategory && hoveredCategory.children && hoveredCategory.children.length > 0;
  // Check if children themselves have children (nested secondary groups, e.g. Accessories)
  const hasNestedGroups = hasChildren && hoveredCategory.children.some(c => c.children && c.children.length > 0);

  return (
    <div 
      className="dorcass-category-dropdown" 
      ref={dropdownRef}
      role="menu"
      aria-label="Product Categories Menu"
    >
      <div className="dropdown-panel-container">
        {/* Left Column: Main Categories */}
        <div className="dropdown-main-categories">
          <div className="dropdown-column-header">
            <span>Shop By Category</span>
          </div>

          <ul className="dropdown-cat-list" role="none">
            {CATEGORIES_DATA.map((cat, idx) => {
              const isSelected = hoveredCategory?.id === cat.id;
              const isActiveRoute = activeCategorySlug === cat.slug;
              const hasKids = cat.children && cat.children.length > 0;

              return (
                <li 
                  key={cat.id} 
                  className={`dropdown-cat-item ${isSelected ? 'is-hovered' : ''} ${isActiveRoute ? 'is-active' : ''}`}
                  onMouseEnter={() => setHoveredCategory(cat)}
                  onFocus={() => setHoveredCategory(cat)}
                  role="none"
                >
                  <a
                    href={cat.path}
                    className="dropdown-cat-link"
                    onClick={(e) => handleCategoryClick(cat, e)}
                    onKeyDown={(e) => handleCatKeyDown(e, idx, cat)}
                    role="menuitem"
                    aria-haspopup={hasKids ? 'true' : 'false'}
                    aria-expanded={hasKids && isSelected ? 'true' : 'false'}
                  >
                    <span className="cat-name-text">{cat.name}</span>
                    {hasKids && (
                      <svg 
                        className="cat-arrow-icon" 
                        width="14" 
                        height="14" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5"
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Column: Subcategories / Nested Groups Pane */}
        {hasNestedGroups ? (
          /* Multi-Tier Secondary Group Pane (e.g. Accessories -> Anti turnis & Hair accessories) */
          <div className="dropdown-subcategories-pane dropdown-nested-pane" key={hoveredCategory.id}>
            <div className="dropdown-sub-header">
              <div>
                <span className="dropdown-sub-title">{hoveredCategory.name} Collection</span>
                <p className="dropdown-sub-desc">{hoveredCategory.description}</p>
              </div>
              <a
                href={hoveredCategory.path}
                className="dropdown-view-all-link"
                onClick={(e) => handleCategoryClick(hoveredCategory, e)}
                role="menuitem"
              >
                <span>View All {hoveredCategory.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

            <div className="dropdown-groups-container">
              {hoveredCategory.children.map((group) => {
                const isGroupActive = activeCategorySlug === hoveredCategory.slug && activeSubcategorySlug === group.slug;
                const hasLeafItems = group.children && group.children.length > 0;

                return (
                  <div key={group.id} className="dropdown-group-col">
                    <div className="dropdown-group-header">
                      <a
                        href={group.path}
                        className={`dropdown-group-title-link ${isGroupActive ? 'is-active' : ''}`}
                        onClick={(e) => handleSubcategoryClick(hoveredCategory, group, e)}
                        role="menuitem"
                      >
                        <span className="dropdown-group-title">{group.name}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </a>
                      {group.description && (
                        <p className="dropdown-group-desc">{group.description}</p>
                      )}
                    </div>

                    {hasLeafItems && (
                      <ul className="dropdown-leaf-list" role="none">
                        {group.children.map((leaf) => {
                          const isLeafActive = activeCategorySlug === hoveredCategory.slug && 
                                              activeSubcategorySlug === group.slug && 
                                              activeTertiarySlug === leaf.slug;
                          return (
                            <li key={leaf.id} className="dropdown-leaf-item" role="none">
                              <a
                                href={leaf.path}
                                className={`dropdown-leaf-link ${isLeafActive ? 'is-active' : ''}`}
                                onClick={(e) => handleTertiaryClick(hoveredCategory, group, leaf, e)}
                                role="menuitem"
                              >
                                <div className="leaf-link-dot"></div>
                                <span className="leaf-link-name">{leaf.name}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : hasChildren ? (
          /* Single-Tier Subcategories Pane (e.g. Sarees, Salwars, 2 Piece Sets) */
          <div className="dropdown-subcategories-pane" key={hoveredCategory.id}>
            <div className="dropdown-sub-header">
              <div>
                <span className="dropdown-sub-title">{hoveredCategory.name} Collection</span>
                <p className="dropdown-sub-desc">{hoveredCategory.tagline || hoveredCategory.description}</p>
              </div>
              <a
                href={hoveredCategory.path}
                className="dropdown-view-all-link"
                onClick={(e) => handleCategoryClick(hoveredCategory, e)}
                role="menuitem"
              >
                <span>View All</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

            <ul className="dropdown-sub-grid" role="none">
              {hoveredCategory.children.map((sub) => {
                const isSubActive = activeCategorySlug === hoveredCategory.slug && activeSubcategorySlug === sub.slug;
                return (
                  <li key={sub.id} className="dropdown-sub-item" role="none">
                    <a
                      href={sub.path}
                      className={`dropdown-sub-link ${isSubActive ? 'is-active' : ''}`}
                      onClick={(e) => handleSubcategoryClick(hoveredCategory, sub, e)}
                      role="menuitem"
                    >
                      <div className="sub-link-dot"></div>
                      <div className="sub-link-content">
                        <span className="sub-link-name">{sub.name}</span>
                        {sub.tagline && (
                          <span className="sub-link-desc">{sub.tagline}</span>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          /* Standalone Category Preview (e.g. Kurtis) */
          <div className="dropdown-standalone-preview" key={hoveredCategory.id}>
            <div className="standalone-preview-card">
              <span className="section-tag">{hoveredCategory.name}</span>
              <h4 className="preview-title">{hoveredCategory.name} Collection</h4>
              <p className="preview-desc">{hoveredCategory.description}</p>
              <a
                href={hoveredCategory.path}
                className="preview-btn"
                onClick={(e) => handleCategoryClick(hoveredCategory, e)}
              >
                <span>Explore {hoveredCategory.name}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

