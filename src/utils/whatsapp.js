/**
 * DORCASS Luxury Fashion - WhatsApp Integration Helper
 */

export const DORCASS_WHATSAPP_NUMBER = '917305323208';

/**
 * Formats full cart details into a clean, professional order message
 * @param {Array} cart - Array of cart items { id, title, price, quantity, size, color, image }
 * @returns {string} WhatsApp direct chat URL with encoded message
 */
export const generateCartWhatsAppUrl = (cart) => {
  if (!cart || cart.length === 0) {
    return `https://wa.me/${DORCASS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello DORCASS Team, I would like to inquire about your fashion collection.')}`;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  let message = `Hello DORCASS Team,\n\n`;
  message += `I would like to place an order for the following items:\n\n`;
  message += `Order Details:\n`;

  cart.forEach((item, index) => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    message += `${index + 1}. Product: ${item.title}\n`;
    if (item.size) message += `   Size: ${item.size}\n`;
    if (item.color) message += `   Color: ${item.color}\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Unit Price: Rs. ${item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
    message += `   Item Total: Rs. ${Number(itemTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n\n`;
  });

  message += `Order Summary:\n`;
  message += `Total Items: ${totalItems}\n`;
  message += `Grand Total: Rs. ${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
  message += `Shipping: Free Express Delivery Included\n\n`;
  message += `Please confirm item availability and share the payment details to proceed with this order.\n\n`;
  message += `Thank you.`;

  return `https://wa.me/${DORCASS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Formats a single product inquiry/order into a clean, professional message
 */
export const generateSingleProductWhatsAppUrl = (product, size = null, color = null, quantity = 1) => {
  let message = `Hello DORCASS Team,\n\n`;
  message += `I would like to inquire about and place an order for the following product:\n\n`;
  message += `Product Name: ${product.title}\n`;
  message += `Price: Rs. ${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}\n`;
  if (size) message += `Size: ${size}\n`;
  if (color) message += `Color: ${color}\n`;
  if (quantity > 1) message += `Quantity: ${quantity}\n`;
  message += `\n`;
  message += `Please let me know about availability and delivery options.\n\n`;
  message += `Thank you.`;

  return `https://wa.me/${DORCASS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
