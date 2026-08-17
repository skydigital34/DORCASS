import React from 'react';

export const Toast = ({ toasts }) => {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
