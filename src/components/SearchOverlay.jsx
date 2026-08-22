import React, { useState, useEffect, useRef } from 'react';

export const SearchOverlay = ({ isOpen, onClose, products, onQuickView }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() ? (products || []).filter(p => 
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase()) ||
    p.category?.toLowerCase().includes(query.toLowerCase())
  ) : [];

  return (
    <div className="search-overlay active" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="search-container">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          ref={inputRef}
          type="text" 
          className="search-input" 
          placeholder="Search sarees, graphic tees, dresses..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          style={{ position: 'static', width: '34px', height: '34px' }}
        >
          ✕
        </button>
      </div>

      <div style={{
        width: '90%',
        maxWidth: '680px',
        marginTop: '24px',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          {query.trim() ? `Search Results (${results.length})` : 'Popular Searches: "Saree", "Streetwear", "Kurti"'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {query.trim() === '' ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>
              Type keywords like "Saree", "Dress", "Graphic Tee"...
            </p>
          ) : results.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '20px' }}>
              No matching pieces found.
            </p>
          ) : (
            results.map(p => (
              <div 
                key={p.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  background: 'var(--brand-pink-subtle)',
                  padding: '10px 14px',
                  borderRadius: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  onQuickView(p.id);
                  onClose();
                }}
              >
                <img src={p.image} alt={p.title} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{p.title}</div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-pink-deep)', fontSize: '0.9rem' }}>₹{Number(p.price || 0).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
