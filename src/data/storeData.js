// DORCASS - Central Store Data Configuration
import { CATEGORIES_DATA } from './categoriesData.js';
import { getStoredProducts, getStoredCategories } from '../services/storeService.js';

export const storeData = {
  get categories() {
    const cats = getStoredCategories();
    return [
      { id: 'all', name: 'All Collections' },
      ...cats.map(c => ({ id: c.slug, name: c.name, children: c.children }))
    ];
  },
  
  // Real product data managed through the Admin Portal (Initial = 0 products)
  get products() {
    return getStoredProducts();
  },

  testimonials: [
    {
      id: 't-1',
      name: 'Aanya Sharma',
      role: 'Fashion Stylist, Mumbai',
      avatar: '/assets/images/avatar-1.jpg',
      rating: 5,
      verified: true,
      review: 'The quality and silk draping of DORCASS is effortless and the natural hue looks breathtaking in natural light.',
      item: 'Verified Haute Couture Buyer'
    },
    {
      id: 't-2',
      name: 'Sophie Laurent',
      role: 'Creative Director, London',
      avatar: '/assets/images/avatar-2.jpg',
      rating: 5,
      verified: true,
      review: 'The craftsmanship and fabric quality is pure art. DORCASS delivers exceptional luxury pieces with fast express delivery.',
      item: 'Verified International Client'
    },
    {
      id: 't-3',
      name: 'Priyanka Sen',
      role: 'Architect, Bangalore',
      avatar: '/assets/images/avatar-3.jpg',
      rating: 5,
      verified: true,
      review: 'I love DORCASS commitment to sustainable packaging and pure materials. The collections are timeless!',
      item: 'Verified VIP Member'
    }
  ],

  stats: {
    products: '10K+',
    customers: '20K+',
    countries: '50+'
  }
};
