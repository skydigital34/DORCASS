import React from 'react';

export const Reviews = ({ testimonials }) => {
  return (
    <section className="store-section">
      <div className="section-header">
        <span className="section-tag">Real Stories</span>
        <h2 className="section-title">Loved by Trendsetters Worldwide</h2>
        <p className="section-subtitle">Over 20,000+ happy customers embracing their style with DORCASS.</p>
      </div>

      <div className="reviews-grid">
        {testimonials.map(item => (
          <div className="review-card" key={item.id}>
            <div>
              <div className="review-stars">{'★'.repeat(item.rating)}</div>
              <p className="review-text">"{item.review}"</p>
            </div>
            <div className="review-user-info">
              <div className="reviewer-avatar">
                <img src={item.avatar} alt={item.name} />
              </div>
              <div>
                <div className="reviewer-name">{item.name}</div>
                <div className="reviewer-role">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
