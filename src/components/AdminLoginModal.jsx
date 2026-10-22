import React, { useState } from 'react';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    // Verify credentials: dorcass / dorcass@2026
    setTimeout(() => {
      if (trimmedUser === 'dorcass' && trimmedPass === 'dorcass@2026') {
        setIsLoading(false);
        setUsername('');
        setPassword('');
        setError('');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setIsLoading(false);
        setError('Invalid username or password. Please try again.');
      }
    }, 300);
  };

  return (
    <div 
      className="login-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(23, 18, 20, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div 
        className="login-modal-card"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid rgba(232, 61, 112, 0.15)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1F191B 0%, #2D2327 100%)',
          padding: '24px 24px 20px',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center'
        }}>
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              title="Close"
            >
              ✕
            </button>
          )}

          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(232, 61, 112, 0.2)',
            border: '1.5px solid var(--brand-pink-primary, #E83D70)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: 'var(--brand-pink-primary, #E83D70)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>

          <h3 style={{
            margin: '0 0 4px',
            fontFamily: 'var(--font-display, inherit)',
            fontSize: '1.35rem',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            DORCASS Portal Login
          </h3>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            Enter your credentials to access the administration portal.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#B91C1C',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#374151',
              marginBottom: '6px'
            }}>
              Username
            </label>
            <input 
              type="text"
              autoFocus
              className="admin-input-text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#374151',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'}
                className="admin-input-text"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #E5E7EB',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #E83D70 0%, #D42B5E 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(232, 61, 112, 0.35)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? 'Verifying...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
