import React, { useState } from 'react';

export const Newsletter = ({ onSubscribe }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubscribe(email);
      setEmail('');
    }
  };

  return (
    <div className="vip-newsletter-box">
      <span className="section-tag">VIP Access</span>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
        Join the DORCASS Circle
      </h3>
      <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
        Subscribe to receive private preview access to limited edition drops and get an instant <strong>20% OFF</strong> coupon code.
      </p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email address..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <button type="submit" className="newsletter-btn">Get 20% Off</button>
      </form>
    </div>
  );
};
