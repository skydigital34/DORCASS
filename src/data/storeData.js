// DORCASS - Product Catalog & Store Data (React Edition)
import { CATEGORIES_DATA } from './categoriesData.js';

export const storeData = {
  categories: [
    { id: 'all', name: 'All Collections' },
    ...CATEGORIES_DATA.map(c => ({ id: c.slug, name: c.name, children: c.children }))
  ],
  
  products: [
    // ==========================================
    // 1. SAREES
    // ==========================================
    {
      id: 'prod-saree-malmal',
      title: 'Ethereal Mal Mal Saree',
      subtitle: 'Feather-Light Drape • Mal Mal sarees',
      category: 'sarees',
      subcategory: 'mal-mal-sarees',
      price: 1499.00,
      originalPrice: 2699.00,
      discount: '44% OFF',
      rating: 4.8,
      reviewsCount: 128,
      badge: 'Bestseller',
      image: '/assets/images/featured-saree.jpg',
      description: 'Handspun ethereal mal mal cotton-silk with delicate pastel borders and subtle gold thread weaving. Incredibly soft against the skin.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Powder Rose', hex: '#F8D7DA' },
        { name: 'Pristine White', hex: '#FAF9F6' }
      ],
      fabric: 'Fine Pure Mul-Mal Mal Silk Blend',
      inStock: true
    },
    {
      id: 'prod-saree-linen',
      title: 'Artisanal Organic Linen Saree',
      subtitle: 'Modern Minimalist • Linen',
      category: 'sarees',
      subcategory: 'linen',
      price: 1799.00,
      originalPrice: 2999.00,
      discount: '40% OFF',
      rating: 4.9,
      reviewsCount: 95,
      badge: 'New Arrival',
      image: '/assets/images/featured-saree.jpg',
      description: 'Crafted from 100 count certified organic linen with dual-tone antique zari pallu and tassel details.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Warm Taupe', hex: '#C9B5A8' },
        { name: 'Blush Sand', hex: '#EED9D1' }
      ],
      fabric: '100% Organic Handwoven Linen',
      inStock: true
    },
    {
      id: 'prod-saree-modal-banthini',
      title: 'Modal Banthini Handcrafted Saree',
      subtitle: 'Heritage Tie-Dye • Modal banthini',
      category: 'sarees',
      subcategory: 'modal-banthini',
      price: 2199.00,
      originalPrice: 3899.00,
      discount: '43% OFF',
      rating: 5.0,
      reviewsCount: 88,
      badge: 'Artisan Crafted',
      image: '/assets/images/featured-saree.jpg',
      description: 'Intricate micro-dot Bandhani resist-dyed by master artisans in vibrant celebration palettes with rich contrast pallu.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Sunset Rose', hex: '#E56B6F' },
        { name: 'Maroon Gold', hex: '#800020' }
      ],
      fabric: 'Modal Silk with Fine Bandhani',
      inStock: true
    },
    {
      id: 'prod-saree-chennur',
      title: 'Elegant Saree - Rose Chennur Silk',
      subtitle: 'Timeless Beauty • Chennur silks',
      category: 'sarees',
      subcategory: 'chennur-silks',
      price: 1299.00,
      originalPrice: 2499.00,
      discount: '48% OFF',
      rating: 4.9,
      reviewsCount: 342,
      badge: 'Featured Look',
      image: '/assets/images/featured-saree.jpg',
      description: 'Draped in luxurious blush pink chennur silk with handcrafted golden zari borders. Perfect for weddings and timeless festive evenings.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Blush Rose', hex: '#E8A5B8' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Ivory Cream', hex: '#FFF5EB' }
      ],
      fabric: '100% Pure Chennur Silk Blend',
      inStock: true
    },
    {
      id: 'prod-saree-tissue',
      title: 'Embroidered Festive Saree',
      subtitle: 'Zari Weave • Tissue silk',
      category: 'sarees',
      subcategory: 'tissue-silk',
      price: 2199.00,
      originalPrice: 3999.00,
      discount: '45% OFF',
      rating: 5.0,
      reviewsCount: 94,
      badge: 'Limited Edition',
      image: '/assets/images/featured-saree.jpg',
      description: 'Intricately woven festive tissue silk saree with heritage temple motifs, subtle metallic sheen, and matching unstitched blouse piece.',
      sizes: ['Free Size'],
      colors: [
        { name: 'Blush Rose', hex: '#E8A5B8' },
        { name: 'Maroon Gold', hex: '#800020' }
      ],
      fabric: 'Tissue Silk with Antique Zari',
      inStock: true
    },

    // ==========================================
    // 2. SALWARS
    // ==========================================
    {
      id: 'prod-salwar-malchendari',
      title: 'Malchendari Embroidered Salwar Suit',
      subtitle: 'Artisan Heritage • Malchendari',
      category: 'salwars',
      subcategory: 'malchendari',
      price: 1899.00,
      originalPrice: 3199.00,
      discount: '40% OFF',
      rating: 4.9,
      reviewsCount: 65,
      badge: 'New Arrival',
      image: '/assets/images/product-kurti.jpg',
      description: 'Lightweight malchendari silk suit set featuring delicate thread embroidery on the yoke with floral handblocked dupatta.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Blush Rose', hex: '#E8A5B8' },
        { name: 'Ivory Gold', hex: '#FFF8DC' }
      ],
      fabric: 'Pure Malchendari Chanderi-Mul Blend',
      inStock: true
    },
    {
      id: 'prod-salwar-maslin',
      title: 'Embellished Maslin Salwar Suit',
      subtitle: 'Graceful Flow • Maslin',
      category: 'salwars',
      subcategory: 'maslin',
      price: 1699.00,
      originalPrice: 2899.00,
      discount: '41% OFF',
      rating: 4.8,
      reviewsCount: 110,
      badge: 'Trending',
      image: '/assets/images/product-kurti.jpg',
      description: 'Breathable maslin salwar suit set with intricate pearl lace neck embroidery and printed pure organza dupatta.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Rose Blush', hex: '#E8A5B8' },
        { name: 'Ivory Cream', hex: '#FFF5EB' }
      ],
      fabric: 'Pure Mul-Maslin with Cotton Lining',
      inStock: true
    },
    {
      id: 'prod-salwar-dolo',
      title: 'Royal Dolo Silk Festive Salwar Set',
      subtitle: 'Lustrous Glow • Dolo Silk',
      category: 'salwars',
      subcategory: 'dolo-silk',
      price: 1999.00,
      originalPrice: 3499.00,
      discount: '43% OFF',
      rating: 4.9,
      reviewsCount: 76,
      badge: 'Festive Pick',
      image: '/assets/images/product-kurti.jpg',
      description: 'Rich liquid drape dolo silk straight-cut suit accompanied by jacquard weave silk dupatta and tailored cigarette trousers.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Rose Gold', hex: '#B76E79' },
        { name: 'Deep Wine', hex: '#4A1525' }
      ],
      fabric: 'Premium Dolo Silk',
      inStock: true
    },
    {
      id: 'prod-salwar-shinmari',
      title: 'Shinmari Tissue Anarkali Salwar',
      subtitle: 'Regal Ensemble • Shinmari tissue',
      category: 'salwars',
      subcategory: 'shinmari-tissue',
      price: 2399.00,
      originalPrice: 4299.00,
      discount: '44% OFF',
      rating: 5.0,
      reviewsCount: 64,
      badge: 'Luxury Drop',
      image: '/assets/images/product-kurti.jpg',
      description: 'Grand flared Shinmari tissue silk suit with gota patti handwork, scallop borders, and comfortable matching churidar.',
      sizes: ['M', 'L', 'XL'],
      colors: [
        { name: 'Ruby Pink', hex: '#9B111E' },
        { name: 'Dusty Rose', hex: '#C77D8C' }
      ],
      fabric: 'Shinmari Tissue Heritage Silk',
      inStock: true
    },
    {
      id: 'prod-salwar-grape',
      title: 'Luxury Grape Crepe Salwar Suit',
      subtitle: 'Contemporary Fluidity • Luxury grape',
      category: 'salwars',
      subcategory: 'luxury-grape',
      price: 1849.00,
      originalPrice: 3199.00,
      discount: '42% OFF',
      rating: 4.7,
      reviewsCount: 82,
      badge: 'Comfort Luxe',
      image: '/assets/images/product-kurti.jpg',
      description: 'Wrinkle-resistant luxury grape crepe fabric that falls seamlessly. Accented with minimalist thread work on the cuffs and hem.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Mauve Orchid', hex: '#997A8D' },
        { name: 'Powder Blush', hex: '#FADEE5' }
      ],
      fabric: 'Fine Grape Crepe Silk',
      inStock: true
    },
    {
      id: 'prod-salwar-sinon',
      title: 'Sinon Materials Designer Salwar',
      subtitle: 'Modern Silhouette • Sinon Materials',
      category: 'salwars',
      subcategory: 'sinon-materials',
      price: 2149.00,
      originalPrice: 3699.00,
      discount: '42% OFF',
      rating: 4.8,
      reviewsCount: 53,
      badge: 'Runway Edit',
      image: '/assets/images/product-kurti.jpg',
      description: 'Structured high-fashion Sinon Materials suit featuring asymmetric hemline, statement sleeve cuffs, and matching straight pants.',
      sizes: ['S', 'M', 'L'],
      colors: [
        { name: 'Champagne Blush', hex: '#F7E7CE' },
        { name: 'Rosewood', hex: '#B87280' }
      ],
      fabric: 'Sinon Materials Textured Silk',
      inStock: true
    },
    {
      id: 'prod-salwar-gaji',
      title: 'Gaji Silk Embroidered Salwar Set',
      subtitle: 'Satin Finish • Gaji silk',
      category: 'salwars',
      subcategory: 'gaji-silk',
      price: 2499.00,
      originalPrice: 4599.00,
      discount: '45% OFF',
      rating: 4.9,
      reviewsCount: 71,
      badge: 'Artisan Pick',
      image: '/assets/images/product-kurti.jpg',
      description: 'High-gloss pure gaji silk suit embellished with zardozi yoke work, bandhani dupatta, and matching silk salwar.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Crimson Rose', hex: '#9E2A2B' },
        { name: 'Blush Gold', hex: '#E8A5B8' }
      ],
      fabric: '100% Pure Gaji Silk',
      inStock: true
    },
    {
      id: 'prod-salwar-cotton',
      title: 'Handblock Pure Cotton Salwar Suit',
      subtitle: 'Daily Breathability • Cotton',
      category: 'salwars',
      subcategory: 'cotton',
      price: 1199.00,
      originalPrice: 1999.00,
      discount: '40% OFF',
      rating: 4.8,
      reviewsCount: 190,
      badge: 'Daily Classic',
      image: '/assets/images/product-kurti.jpg',
      description: 'Crafted from 100% fine organic cotton with traditional Sanganeri handblock motifs and lightweight mulmul dupatta.',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Pastel Blush', hex: '#F7D8E0' },
        { name: 'Ivory Bloom', hex: '#FAF5EE' }
      ],
      fabric: '100% Organic Combed Cotton',
      inStock: true
    },

    // ==========================================
    // 3. 2 PIECE SETS
    // ==========================================
    {
      id: 'prod-2piece-quart',
      title: 'Tailored Luxury Quart Set',
      subtitle: 'Modern Silhouette • Quart set',
      category: '2-piece-sets',
      subcategory: 'quart-set',
      price: 1699.00,
      originalPrice: 2999.00,
      discount: '43% OFF',
      rating: 4.8,
      reviewsCount: 142,
      badge: 'New In',
      image: '/assets/images/product-western.jpg',
      description: 'Chic co-ord quart set featuring an asymmetrical tailored wrap blazer with matching wide-leg pleated trousers.',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Rosewood', hex: '#B87280' },
        { name: 'Warm Taupe', hex: '#C9B5A8' },
        { name: 'Olive Sage', hex: '#8F9B88' }
      ],
      fabric: 'Premium Micro-Pleated Georgette Blend',
      inStock: true
    },

    // ==========================================
    // 4. KURTIS
    // ==========================================
    {
      id: 'prod-kurti-anarkali',
      title: 'Royal Anarkali Flared Kurti',
      subtitle: 'Floral Radiance • Kurtis',
      category: 'kurtis',
      subcategory: null,
      price: 1899.00,
      originalPrice: 3299.00,
      discount: '42% OFF',
      rating: 4.9,
      reviewsCount: 218,
      badge: 'Trending',
      image: '/assets/images/product-kurti.jpg',
      description: 'Flared floor-length Anarkali kurti in subtle rose blush with delicate gold foil motifs, sheer sleeves, and embellished yoke detailing.',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { name: 'Blush Pink', hex: '#E8A5B8' },
        { name: 'Dusty Rose', hex: '#C77D8C' }
      ],
      fabric: 'Chanderi Silk with Cotton Voile Lining',
      inStock: true
    },

    // ==========================================
    // 5. ACCESSORIES
    // ==========================================
    // 5A. Anti turnis
    {
      id: 'prod-acc-chains',
      title: 'Layered Anti-Tarnish Gold Chain',
      subtitle: 'Waterproof Luxury • Anti turnis: Chains',
      category: 'accessories',
      subcategory: 'anti-turnis',
      tertiaryCategory: 'chains',
      price: 899.00,
      originalPrice: 1499.00,
      discount: '40% OFF',
      rating: 4.9,
      reviewsCount: 310,
      badge: 'Best Seller',
      image: '/assets/images/hero-model.jpg',
      description: 'Hypoallergenic 18K gold plated anti-turnis herringbone and snake chain set. 100% waterproof and sweat-resistant.',
      sizes: ['Adjustable (16-20 in)'],
      colors: [
        { name: '18K Gold', hex: '#D4AF37' },
        { name: 'Rose Gold', hex: '#B76E79' },
        { name: 'Silver Platinum', hex: '#E5E4E2' }
      ],
      fabric: 'Anti-Tarnish 316L Stainless Steel with 18K PVD Plating',
      inStock: true
    },
    {
      id: 'prod-acc-earings',
      title: 'Sculpted Golden Drop Earings',
      subtitle: 'Timeless Glow • Anti turnis: Earings',
      category: 'accessories',
      subcategory: 'anti-turnis',
      tertiaryCategory: 'earings',
      price: 699.00,
      originalPrice: 1199.00,
      discount: '41% OFF',
      rating: 4.8,
      reviewsCount: 185,
      badge: 'Trending',
      image: '/assets/images/hero-model.jpg',
      description: 'Feather-light anti-turnis teardrop earings designed for all-day elegance without irritation or discoloration.',
      sizes: ['One Size'],
      colors: [
        { name: '18K Gold', hex: '#D4AF37' },
        { name: 'Blush Gold', hex: '#E8A5B8' }
      ],
      fabric: 'Anti-Tarnish PVD Coated Brass & Titanium Posts',
      inStock: true
    },
    {
      id: 'prod-acc-bracelets',
      title: 'Artisan Anti-Tarnish Charm Bracelet',
      subtitle: 'Delicate Sheen • Anti turnis: Bracelets',
      category: 'accessories',
      subcategory: 'anti-turnis',
      tertiaryCategory: 'bracelets',
      price: 799.00,
      originalPrice: 1399.00,
      discount: '42% OFF',
      rating: 4.9,
      reviewsCount: 92,
      badge: 'New In',
      image: '/assets/images/hero-model.jpg',
      description: 'Minimalist cable link bracelet accented with pearl and gold coin charms. Guaranteed anti-turnis finish.',
      sizes: ['Adjustable (6.5-8 in)'],
      colors: [
        { name: '18K Gold', hex: '#D4AF37' },
        { name: 'Rose Gold', hex: '#B76E79' }
      ],
      fabric: '18K Gold PVD Anti-Tarnish Steel',
      inStock: true
    },
    {
      id: 'prod-acc-watches',
      title: 'Classic Luxe Rose-Tone Watch',
      subtitle: 'Precision Elegance • Anti turnis: Watches',
      category: 'accessories',
      subcategory: 'anti-turnis',
      tertiaryCategory: 'watches',
      price: 2499.00,
      originalPrice: 4499.00,
      discount: '44% OFF',
      rating: 5.0,
      reviewsCount: 78,
      badge: 'Artisan Edit',
      image: '/assets/images/hero-model.jpg',
      description: 'Ultra-slim anti-turnis watch with mother-of-pearl dial, rose gold mesh strap, and precision quartz movement.',
      sizes: ['Adjustable Mesh Strap'],
      colors: [
        { name: 'Rose Gold', hex: '#B76E79' },
        { name: 'Champagne Gold', hex: '#D4AF37' }
      ],
      fabric: 'Anti-Tarnish Stainless Steel & Sapphire Glass',
      inStock: true
    },
    {
      id: 'prod-acc-rasin-bangles',
      title: 'Handcrafted Floral Rasin Bangles',
      subtitle: 'Artisanal Resin • Anti turnis: Rasin bangles',
      category: 'accessories',
      subcategory: 'anti-turnis',
      tertiaryCategory: 'rasin-bangles',
      price: 599.00,
      originalPrice: 999.00,
      discount: '40% OFF',
      rating: 4.8,
      reviewsCount: 114,
      badge: 'Handmade',
      image: '/assets/images/hero-model.jpg',
      description: 'Set of 4 hand-poured crystalline rasin bangles embedded with real dried rose petals and 24K gold foil flakes.',
      sizes: ['2.4', '2.6', '2.8'],
      colors: [
        { name: 'Rose Gold Foil', hex: '#E8A5B8' },
        { name: 'Clear Gold Flake', hex: '#D4AF37' }
      ],
      fabric: 'Eco-Resin with Gold Leaf Embellishment',
      inStock: true
    },

    // 5B. Hair accessories
    {
      id: 'prod-acc-clutches',
      title: 'Artisan Pearl Claw Hair Clutches',
      subtitle: 'Effortless Style • Hair accessories: Clutches',
      category: 'accessories',
      subcategory: 'hair-accessories',
      tertiaryCategory: 'clutches',
      price: 499.00,
      originalPrice: 899.00,
      discount: '44% OFF',
      rating: 4.9,
      reviewsCount: 204,
      badge: 'Popular',
      image: '/assets/images/hero-model.jpg',
      description: 'Durable cellulose acetate hair claw clutch adorned with lustrous faux pearls and strong interlocking grip teeth.',
      sizes: ['Large (4.2 in)'],
      colors: [
        { name: 'Pearl Cream', hex: '#FFF5EB' },
        { name: 'Blush Tortoise', hex: '#E8A5B8' }
      ],
      fabric: 'Eco Acetate & Reinforced Steel Spring',
      inStock: true
    },
    {
      id: 'prod-acc-srunches',
      title: 'Pure Mulberry Silk Volume Srunches',
      subtitle: 'Hair Loving Luxe • Hair accessories: Srunches',
      category: 'accessories',
      subcategory: 'hair-accessories',
      tertiaryCategory: 'srunches',
      price: 399.00,
      originalPrice: 699.00,
      discount: '42% OFF',
      rating: 5.0,
      reviewsCount: 360,
      badge: 'Must Have',
      image: '/assets/images/hero-model.jpg',
      description: 'Pack of 3 oversized pure 22-momme silk srunches designed to prevent frizz, hair breakage, and crease marks.',
      sizes: ['Pack of 3'],
      colors: [
        { name: 'Rose / Champagne / Ivory', hex: '#E8A5B8' }
      ],
      fabric: '100% Pure 22-Momme Mulberry Silk',
      inStock: true
    }
  ],

  testimonials: [
    {
      id: 't-1',
      name: 'Aanya Sharma',
      role: 'Fashion Stylist, Mumbai',
      avatar: '/assets/images/avatar-1.jpg',
      rating: 5,
      verified: true,
      review: 'The quality of the Mal Mal saree and Chennur silk exceeded all my expectations! The silk draping is so effortless and the rose hue looks breathtaking in natural light.',
      item: 'Purchased: Elegant Saree - Rose Chennur Silk'
    },
    {
      id: 't-2',
      name: 'Sophie Laurent',
      role: 'Creative Director, London',
      avatar: '/assets/images/avatar-2.jpg',
      rating: 5,
      verified: true,
      review: 'The craftsmanship of the Shinmari tissue suit is pure art. DORCASS delivers exceptional haute-couture quality with fast express shipping.',
      item: 'Purchased: Shinmari Tissue Anarkali Salwar'
    },
    {
      id: 't-3',
      name: 'Priyanka Sen',
      role: 'Architect, Bangalore',
      avatar: '/assets/images/avatar-3.jpg',
      rating: 5,
      verified: true,
      review: 'I love DORCASS commitment to sustainable packaging and cruelty-free materials. The Tailored Luxury Quart Set arrived in gorgeous eco-luxe packaging!',
      item: 'Purchased: Tailored Luxury Quart Set'
    }
  ],

  stats: {
    products: '10K+',
    customers: '20K+',
    countries: '50+'
  }
};

