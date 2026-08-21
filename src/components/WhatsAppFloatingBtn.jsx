import React, { useState } from 'react';

export const WhatsAppFloatingBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '917305323208';
  const displayPhone = '+91 73053 23208';
  const email = 'dorcasspopstore@gmail.com';
  const address = '6th Street, cross cut, Gandhipuram, Coimbatore';
  const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent('Hello DORCASS, I am interested in your luxury collections. Please assist me.');

  return (
    <div className="dorcass-floating-contact-widget">
      {/* Popover Card */}
      {isOpen && (
        <div className="floating-contact-card" role="dialog" aria-label="Customer Support">
          <div className="contact-card-header">
            <div className="contact-card-brand">
              <span className="brand-dot-online"></span>
              <div>
                <span className="card-brand-title">DORCASS Concierge</span>
                <span className="card-brand-status">Online • Typically replies in minutes</span>
              </div>
            </div>
            <button 
              className="card-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close Contact Card"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="contact-card-body">
            <p className="contact-card-msg">
              Have questions about weaves, sizing, customized orders, or store visits? Connect with our fashion stylist directly.
            </p>

            {/* Action Buttons */}
            <div className="contact-action-list">
              {/* WhatsApp Action */}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-action-btn whatsapp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              {/* Email Action */}
              <a 
                href={'mailto:' + email + '?subject=' + encodeURIComponent('Inquiry: DORCASS Collections')}
                className="contact-action-btn email"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email Us</span>
              </a>

              {/* Phone Call Action */}
              <a 
                href={'tel:' + phoneNumber}
                className="contact-action-btn phone"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>Call {displayPhone}</span>
              </a>
            </div>

            {/* Store Address Details */}
            <div className="contact-store-info">
              <div className="store-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{address}</span>
              </div>
              <div className="store-info-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand-pink-primary)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Mon - Sat: 9:00 AM - 8:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button 
        className="floating-whatsapp-trigger" 
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open Contact & WhatsApp Support"
        title="Contact & WhatsApp Concierge"
      >
        <span className="floating-pulse-ring"></span>
        <div className="floating-icon-box">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFFFFF">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </div>
        <span className="floating-tooltip">Chat with us</span>
      </button>
    </div>
  );
};
