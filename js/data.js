// DORCASS - Product Catalog & Store Data

const storeData = {
  categories: [
    { id: 'all', name: 'All Collections' },
    { id: 'ethnic', name: 'Sarees & Ethnic' },
    { id: 'streetwear', name: 'Graphic Tees & Tops' },
    { id: 'western', name: 'Western & Dresses' },
    { id: 'limited', name: 'Limited Edition' }
  ],
  
  products: [
    {
      id: 'prod-1',
      title: 'Elegant Saree - Rose Silk',
      subtitle: 'Timeless Beauty',
      category: 'ethnic',
      price: 1299.00,
      originalPrice: 2499.00,
      discount: '48% OFF',
      rating: 4.9,
      reviewsCount: 342,
      badge: 'Featured Look',
      image: 'assets/images/featured-saree.jpg',
      description: 'Draped in luxurious blush pink silk with handcrafted golden zari borders. Perfect for weddings, celebrations, and timeless festive evenings.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Blush Rose', hex: '#E8A5B8' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Ivory Cream', hex: '#FFF5EB' }
      ],
      fabric: '100% Pure Mulberry Silk Blend',
      inStock: true
    },
    {
      id: 'prod-2',
      title: '"Be You Do You" Graphic Tee',
      subtitle: 'Streetwear Edition',
      category: 'streetwear',
      price: 799.00,
      originalPrice: 1299.00,
      discount: '38% OFF',
      rating: 4.8,
      reviewsCount: 520,
      badge: 'Best Seller',
      image: 'assets/images/hero-model.jpg',
      description: 'Signature oversized drop-shoulder t-shirt crafted from heavy 240 GSM organic combed cotton. Features signature "Be You Do You For You" typography and butterfly art on back.',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Off-White Cream', hex: '#F9F5EE' },
        { name: 'Pastel Blush', hex: '#F7D8E0' },
        { name: 'Midnight Charcoal', hex: '#2A2829' }
      ],
      fabric: '240 GSM 100% Organic Combed Cotton',
      inStock: true
    },
    {
      id: 'prod-3',
      title: 'Royal Anarkali Kurti Set',
      subtitle: 'Floral Radiance',
      category: 'ethnic',
      price: 1899.00,
      originalPrice: 3299.00,
      discount: '42% OFF',
      rating: 4.9,
      reviewsCount: 218,
      badge: 'Trending',
      image: 'assets/images/product-kurti.jpg',
      description: 'Flared floor-length Anarkali kurti in subtle rose blush with delicate gold foil motifs, matching sheer dupatta, and embellished yoke detailing.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Blush Pink', hex: '#E8A5B8' },
        { name: 'Dusty Rose', hex: '#C77D8C' }
      ],
      fabric: 'Chanderi Silk with Cotton Voile Lining',
      inStock: true
    },
    {
      id: 'prod-4',
      title: 'Pleated Wrap Midi Dress',
      subtitle: 'Modern Silhouette',
      category: 'western',
      price: 1599.00,
      originalPrice: 2899.00,
      discount: '45% OFF',
      rating: 4.7,
      reviewsCount: 185,
      badge: 'New In',
      image: 'assets/images/product-western.jpg',
      description: 'Chic long-sleeve wrap midi dress featuring refined accordion pleats, satin belt tie, and a universally flattering V-neckline.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Rosewood', hex: '#B87280' },
        { name: 'Warm Taupe', hex: '#C9B5A8' },
        { name: 'Olive Sage', hex: '#8F9B88' }
      ],
      fabric: 'Premium Micro-Pleated Georgette',
      inStock: true
    },
    {
      id: 'prod-5',
      title: 'Embroidered Festive Saree',
      subtitle: 'Zari Weave Collection',
      category: 'ethnic',
      price: 2199.00,
      originalPrice: 3999.00,
      discount: '45% OFF',
      rating: 5.0,
      reviewsCount: 94,
      badge: 'Limited Edition',
      image: 'assets/images/featured-saree.jpg',
      description: 'Intricately woven festive saree with heritage temple motifs, contrast pallu, and unstitched matching designer blouse piece.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Blush Rose', hex: '#E8A5B8' },
        { name: 'Maroon Gold', hex: '#800020' }
      ],
      fabric: 'Tussar Silk with Antique Zari',
      inStock: true
    },
    {
      id: 'prod-6',
      title: 'Aesthetic Butterfly Crop Top',
      subtitle: 'Everyday Chic',
      category: 'streetwear',
      price: 649.00,
      originalPrice: 999.00,
      discount: '35% OFF',
      rating: 4.8,
      reviewsCount: 167,
      badge: 'Popular',
      image: 'assets/images/hero-model.jpg',
      description: 'Relaxed boxy silhouette with minimalist butterfly outline embroidery on the chest. Ultra-soft breathable feel.',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: [
        { name: 'Cream White', hex: '#FAF7F2' },
        { name: 'Blush Pink', hex: '#FADEE5' }
      ],
      fabric: '100% Breathable Cotton',
      inStock: true
    }
  ],

  testimonials: [
    {
      id: 't-1',
      name: 'Aanya Sharma',
      role: 'Fashion Stylist, Mumbai',
      avatar: 'assets/images/avatar-1.jpg',
      rating: 5,
      verified: true,
      review: 'The quality of the Elegant Saree exceeded all my expectations! The silk draping is so effortless and the rose hue looks breathtaking in natural light.',
      item: 'Purchased: Elegant Saree - Rose Silk'
    },
    {
      id: 't-2',
      name: 'Sophie Laurent',
      role: 'Creative Director, London',
      avatar: 'assets/images/avatar-2.jpg',
      rating: 5,
      verified: true,
      review: 'The "Be You Do You" oversized t-shirt has become my daily uniform. Heavyweight luxury cotton, perfect drop shoulders, and the back typography is pure art.',
      item: 'Purchased: "Be You Do You" Graphic Tee'
    },
    {
      id: 't-3',
      name: 'Priyanka Sen',
      role: 'Architect, Bangalore',
      avatar: 'assets/images/avatar-3.jpg',
      rating: 5,
      verified: true,
      review: 'I love DORCASS commitment to sustainable packaging and cruelty-free materials. The Pleated Wrap Dress arrived in gorgeous eco-luxe packaging!',
      item: 'Purchased: Pleated Wrap Midi Dress'
    }
  ],

  stats: {
    products: '10K+',
    customers: '20K+',
    countries: '50+'
  }
};
