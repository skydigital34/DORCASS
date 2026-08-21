// DORCASS - Centralized Navigation & Category Hierarchy Configuration

export const MAIN_NAV_ITEMS = [
  {
    id: 'new-arrivals',
    label: 'NEW ARRIVALS',
    path: '/new-arrivals',
    isNew: true
  },
  {
    id: 'categories',
    label: 'CATEGORIES',
    path: '/categories',
    hasDropdown: true
  },
  {
    id: 'about',
    label: 'ABOUT',
    path: '/about',
    sectionId: 'story'
  },
  {
    id: 'contact',
    label: 'CONTACT',
    path: '/contact',
    sectionId: 'footer'
  }
];

export const CATEGORIES_DATA = [
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    path: '/category/sarees',
    tagline: 'Timeless drapes, thoughtfully curated.',
    description: 'Pure mul-silk, handcrafted weaves, and regal heritage festive drapes for celebrations that last a lifetime.',
    image: '/assets/images/featured-saree.jpg',
    seoTitle: 'Luxury Sarees Collection | DORCASS',
    seoDescription: 'Explore handcrafted Indian silk sarees, Mal Mal cotton-silks, organic linen, and festive tissue silk at DORCASS.',
    children: [
      {
        id: 'mal-mal-sarees',
        name: 'Mal Mal sarees',
        slug: 'mal-mal-sarees',
        path: '/category/sarees/mal-mal-sarees',
        tagline: 'Feather-light ethereal cotton-silk weaves.',
        description: 'Feather-light ethereal cotton-silk weaves with delicate pastel borders and subtle gold thread work.',
        image: '/assets/images/featured-saree.jpg',
        seoTitle: 'Mal Mal Sarees | DORCASS Luxury Weaves',
        seoDescription: 'Shop handcrafted Mal Mal sarees in ethereal pastel shades and breathable silk-cotton blends.'
      },
      {
        id: 'linen',
        name: 'Linen',
        slug: 'linen',
        path: '/category/sarees/linen',
        tagline: 'Modern minimalist luxury with organic grace.',
        description: 'Breathable organic luxury linen with zari borders, dual-tone antique pallus, and hand-knotted tassels.',
        image: '/assets/images/featured-saree.jpg',
        seoTitle: 'Organic Linen Sarees | DORCASS',
        seoDescription: 'Discover pure organic handwoven linen sarees with antique zari borders for modern minimal elegance.'
      },
      {
        id: 'modal-banthini',
        name: 'Modal banthini',
        slug: 'modal-banthini',
        path: '/category/sarees/modal-banthini',
        tagline: 'Handcrafted micro-dot tie-dye heritage.',
        description: 'Traditional handcrafted tie-dye elegance created by master artisans in celebration-ready vibrant palettes.',
        image: '/assets/images/featured-saree.jpg',
        seoTitle: 'Modal Banthini Sarees | DORCASS',
        seoDescription: 'Authentic handcrafted modal bandhani sarees with artisan resist-dye craftsmanship.'
      },
      {
        id: 'chennur-silks',
        name: 'Chennur silks',
        slug: 'chennur-silks',
        path: '/category/sarees/chennur-silks',
        tagline: 'Rich luster South Indian royal weaves.',
        description: 'Rich luster South Indian heritage weaves with authentic golden zari and majestic motifs.',
        image: '/assets/images/featured-saree.jpg',
        seoTitle: 'Chennur Silks Sarees | DORCASS',
        seoDescription: 'Lustrous Chennur silk sarees featuring traditional golden zari weaving and regal silhouettes.'
      },
      {
        id: 'tissue-silk',
        name: 'Tissue silk',
        slug: 'tissue-silk',
        path: '/category/sarees/tissue-silk',
        tagline: 'Translucent metallic sheen with golden highlights.',
        description: 'Translucent metallic sheen festive sarees adorned with intricate zari motifs and opulent pallus.',
        image: '/assets/images/featured-saree.jpg',
        seoTitle: 'Tissue Silk Sarees | DORCASS',
        seoDescription: 'Festive tissue silk sarees with iridescent metallic glow and exquisite unstitched blouse pieces.'
      }
    ]
  },
  {
    id: 'salwars',
    name: 'Salwars',
    slug: 'salwars',
    path: '/category/salwars',
    tagline: 'Artisanal suit sets tailored for effortless poise.',
    description: 'Tailored suit sets with artisanal dupattas, delicate embroidery, and breathable luxury fabrics.',
    image: '/assets/images/product-kurti.jpg',
    seoTitle: 'Salwars & Suit Sets | DORCASS Luxury Fashion',
    seoDescription: 'Shop designer salwar suit sets in Malchendari, Maslin, Dolo Silk, Shinmari tissue, Gaji silk, and pure cotton.',
    children: [
      {
        id: 'malchendari',
        name: 'Malchendari',
        slug: 'malchendari',
        path: '/category/salwars/malchendari',
        tagline: 'Lightweight heritage chanderi-mul blend suits.',
        description: 'Lightweight heritage chanderi-mul blend suits with handblocked organza dupattas and intricate neckline embroidery.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Malchendari Salwar Suits | DORCASS',
        seoDescription: 'Pure Malchendari silk salwar suits featuring artisan thread embroidery and handblock prints.'
      },
      {
        id: 'maslin',
        name: 'Maslin',
        slug: 'maslin',
        path: '/category/salwars/maslin',
        tagline: 'Ultra-soft fine mul-maslin suits.',
        description: 'Ultra-soft fine mul-maslin suits with pearl lace neck accents and flowing lightweight dupattas.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Maslin Salwar Suits | DORCASS',
        seoDescription: 'Graceful fine maslin salwar suits with soft cotton lining and handcrafted dupattas.'
      },
      {
        id: 'dolo-silk',
        name: 'Dolo Silk',
        slug: 'dolo-silk',
        path: '/category/salwars/dolo-silk',
        tagline: 'Smooth liquid-drape dolo silk suits.',
        description: 'Smooth liquid-drape dolo silk straight-cut suits accompanied by jacquard weave silk dupattas and cigarette trousers.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Dolo Silk Salwars | DORCASS',
        seoDescription: 'Lustrous dolo silk festive salwar sets with rich texture and flattering drape.'
      },
      {
        id: 'shinmari-tissue',
        name: 'Shinmari tissue',
        slug: 'shinmari-tissue',
        path: '/category/salwars/shinmari-tissue',
        tagline: 'Regal lustrous partywear suits with metallic shimmer.',
        description: 'Regal lustrous partywear suits with gota patti handwork, scallop borders, and matching churidars.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Shinmari Tissue Salwars | DORCASS',
        seoDescription: 'Grand flared Shinmari tissue silk salwar suits embellished with festive gota patti.'
      },
      {
        id: 'luxury-grape',
        name: 'Luxury grape',
        slug: 'luxury-grape',
        path: '/category/salwars/luxury-grape',
        tagline: 'Flowy crepe grape finish sets.',
        description: 'Wrinkle-resistant luxury grape crepe fabric that falls seamlessly, accented with minimalist cuff detailing.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Luxury Grape Salwars | DORCASS',
        seoDescription: 'Contemporary fluid luxury grape crepe salwar suits for effortless day-to-evening style.'
      },
      {
        id: 'sinon-materials',
        name: 'Sinon Materials',
        slug: 'sinon-materials',
        path: '/category/salwars/sinon-materials',
        tagline: 'Modern silhouette structured occasion suits.',
        description: 'Modern silhouette structured occasion suits featuring asymmetric hemlines and statement sleeve cuffs.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Sinon Materials Salwars | DORCASS',
        seoDescription: 'High-fashion Sinon Materials textured silk salwar suits for cocktail evenings and celebrations.'
      },
      {
        id: 'gaji-silk',
        name: 'Gaji silk',
        slug: 'gaji-silk',
        path: '/category/salwars/gaji-silk',
        tagline: 'Glossy satin-finish heritage gaji silk suits.',
        description: 'Glossy satin-finish heritage gaji silk suits embellished with zardozi yoke work and bandhani dupattas.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Gaji Silk Salwar Sets | DORCASS',
        seoDescription: 'Authentic pure gaji silk suit sets with satin luster and zardozi embellishments.'
      },
      {
        id: 'cotton',
        name: 'Cotton',
        slug: 'cotton',
        path: '/category/salwars/cotton',
        tagline: '100% Breathable pure combed cotton daily wear.',
        description: '100% Breathable pure combed organic cotton daily wear with traditional handblock motifs and mulmul dupattas.',
        image: '/assets/images/product-kurti.jpg',
        seoTitle: 'Pure Cotton Salwars | DORCASS',
        seoDescription: 'Breathable pure combed cotton daily salwar suits with artisanal Sanganeri prints.'
      }
    ]
  },
  {
    id: '2-piece-sets',
    name: '2 Piece Sets',
    slug: '2-piece-sets',
    path: '/category/2-piece-sets',
    tagline: 'Coordinated modern elegance, elevated.',
    description: 'Coordinated contemporary tops, trousers, wrap sets, and tailored quart sets for the modern muse.',
    image: '/assets/images/product-western.jpg',
    seoTitle: '2 Piece Sets & Co-Ords | DORCASS',
    seoDescription: 'Shop luxury 2 piece sets and tailored quart set ensembles in contemporary cuts and fluid fabrics.',
    children: [
      {
        id: 'quart-set',
        name: 'Quart set',
        slug: 'quart-set',
        path: '/category/2-piece-sets/quart-set',
        tagline: 'Tailored co-ord jacket and trouser ensembles.',
        description: 'Tailored co-ord jacket and pleated trouser ensembles designed for high-fashion versatility.',
        image: '/assets/images/product-western.jpg',
        seoTitle: 'Quart Sets | DORCASS 2 Piece Sets',
        seoDescription: 'Sophisticated quart set co-ords tailored in premium georgette and structured silk blends.'
      }
    ]
  },
  {
    id: 'kurtis',
    name: 'Kurtis',
    slug: 'kurtis',
    path: '/category/kurtis',
    tagline: 'Flared majesty and everyday chic.',
    description: 'Everyday chic, straight cuts, and festive flared Anarkali silhouettes crafted in fine chanderi and silk.',
    image: '/assets/images/product-kurti.jpg',
    seoTitle: 'Designer Kurtis & Anarkalis | DORCASS',
    seoDescription: 'Explore royal flared Anarkali kurtis and everyday contemporary silhouettes in luxury silk blends.',
    children: []
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    path: '/category/accessories',
    tagline: 'The art of final touches.',
    description: 'Handcrafted waterproof anti-tarnish jewelry, hair adornments, resin bangles, and silk styling additions.',
    image: '/assets/images/hero-model.jpg',
    seoTitle: 'Luxury Fashion Accessories | DORCASS',
    seoDescription: 'Discover 18K gold anti-tarnish jewelry, chains, earrings, bracelets, clutches, and pure silk scrunchies.',
    children: [
      {
        id: 'anti-turnis',
        name: 'Anti turnis',
        slug: 'anti-turnis',
        path: '/category/accessories/anti-turnis',
        tagline: '100% Waterproof, hypoallergenic luxury jewelry.',
        description: 'Premium waterproof anti-tarnish 18K PVD gold plated jewelry built for effortless daily wear.',
        image: '/assets/images/hero-model.jpg',
        seoTitle: 'Anti Turnis Jewelry | DORCASS',
        seoDescription: 'Waterproof anti-turnis jewelry: statement chains, earings, bracelets, watches, and resin bangles.',
        children: [
          {
            id: 'chains',
            name: 'Chains',
            slug: 'chains',
            path: '/category/accessories/anti-turnis/chains',
            tagline: 'Minimalist statement & layered chains.',
            description: 'Minimalist statement and layered anti-tarnish chains in 18K gold and rose gold finishes.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Anti-Tarnish Chains | DORCASS',
            seoDescription: 'Shop waterproof layered gold and snake chains designed with anti-turnis durability.'
          },
          {
            id: 'earings',
            name: 'Earings',
            slug: 'earings',
            path: '/category/accessories/anti-turnis/earings',
            tagline: 'Timeless drops, studs & sculpted hoops.',
            description: 'Timeless drops, sculpted hoops, and minimal studs crafted with hypoallergenic titanium posts.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Earings | DORCASS Anti-Tarnish',
            seoDescription: 'Waterproof luxury earings in classic teardrop and hoop silhouettes.'
          },
          {
            id: 'bracelets',
            name: 'Bracelets',
            slug: 'bracelets',
            path: '/category/accessories/anti-turnis/bracelets',
            tagline: 'Elegant chain cuffs & delicate charms.',
            description: 'Elegant chain cuffs, tennis bracelets, and delicate charm bracelets with guaranteed anti-turnis shine.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Anti-Tarnish Bracelets | DORCASS',
            seoDescription: 'Discover elegant gold charm bracelets and cuffs that never tarnish.'
          },
          {
            id: 'watches',
            name: 'Watches',
            slug: 'watches',
            path: '/category/accessories/anti-turnis/watches',
            tagline: 'Classic luxury analog timepieces.',
            description: 'Classic luxury analog timepieces featuring mother-of-pearl dials and stainless steel mesh straps.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Luxury Watches | DORCASS',
            seoDescription: 'Minimalist rose gold and champagne gold timepieces for timeless elegance.'
          },
          {
            id: 'rasin-bangles',
            name: 'Rasin bangles',
            slug: 'rasin-bangles',
            path: '/category/accessories/anti-turnis/rasin-bangles',
            tagline: 'Hand-poured glossy resin artisanal bangles.',
            description: 'Hand-poured glossy crystalline resin artisanal bangles embedded with real dried petals and 24K gold foil.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Rasin Bangles | DORCASS Handcrafted',
            seoDescription: 'Artisan floral rasin bangles with real gold flake and botanical details.'
          }
        ]
      },
      {
        id: 'hair-accessories',
        name: 'Hair accessories',
        slug: 'hair-accessories',
        path: '/category/accessories/hair-accessories',
        tagline: 'Effortlessly chic styling essentials.',
        description: 'Effortlessly chic hair styling accessories, pearl claw clutches, and pure mulberry silk volume scrunchies.',
        image: '/assets/images/hero-model.jpg',
        seoTitle: 'Luxury Hair Accessories | DORCASS',
        seoDescription: 'Shop cellulose acetate hair clutches and 100% pure silk srunches for healthy, damage-free styling.',
        children: [
          {
            id: 'clutches',
            name: 'Clutches',
            slug: 'clutches',
            path: '/category/accessories/hair-accessories/clutches',
            tagline: 'Artisan pearl & acetate hair claw clutches.',
            description: 'Artisan pearl and cellulose acetate hair claw clutches with secure interlocking grip.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Hair Clutches | DORCASS Hair Accessories',
            seoDescription: 'Premium acetate and pearl-embellished hair claw clutches.'
          },
          {
            id: 'srunches',
            name: 'Srunches',
            slug: 'srunches',
            path: '/category/accessories/hair-accessories/srunches',
            tagline: '100% Pure mulberry silk volume scrunchies.',
            description: '100% Pure 22-momme mulberry silk volume scrunchies designed to prevent frizz and hair breakage.',
            image: '/assets/images/hero-model.jpg',
            seoTitle: 'Silk Srunches | DORCASS Hair Accessories',
            seoDescription: 'Pure mulberry silk srunches in luxury neutral and pastel shades.'
          }
        ]
      }
    ]
  }
];

// Helper: Normalize route and resolve aliases for backward compatibility
export function normalizePath(rawPath) {
  let path = (rawPath || '/').toLowerCase().replace(/\/$/, '') || '/';
  
  // Normalise /categories/... to /category/...
  if (path === '/categories') {
    path = '/category/sarees';
  } else if (path.startsWith('/categories/')) {
    path = path.replace('/categories/', '/category/');
  }

  // Legacy aliases
  if (path.includes('/salvars')) {
    path = path.replace('/salvars', '/salwars');
  }
  if (path.includes('/2-piece-set') && !path.includes('/2-piece-sets')) {
    path = path.replace('/2-piece-set', '/2-piece-sets');
  }
  if (path.includes('/kurties')) {
    path = path.replace('/kurties', '/kurtis');
  }
  
  return path;
}

// Helper: Find category, subcategory or tertiary category by URL path
export function resolveNavigationFromPath(pathname) {
  const normalizedPath = normalizePath(pathname);

  // Check /new-arrivals
  if (normalizedPath === '/new-arrivals') {
    const item = MAIN_NAV_ITEMS.find(i => i.id === 'new-arrivals');
    return {
      type: 'new-arrivals',
      item,
      isNewArrivals: true,
      categorySlug: 'all',
      subcategorySlug: null,
      tertiarySlug: null,
      title: 'New Arrivals',
      tagline: 'Latest Runway Drops & Fresh Artisanal Silhouettes',
      description: 'Explore the newest handcrafted luxury sarees, suit sets, contemporary co-ords, and accessories.',
      image: '/assets/images/featured-saree.jpg',
      breadcrumbs: [
        { label: 'Home', path: '/' },
        { label: 'New Arrivals', path: '/new-arrivals' }
      ]
    };
  }

  // Check root /category
  if (normalizedPath === '/category' || normalizedPath === '/category/all') {
    return {
      type: 'category',
      category: null,
      subcategory: null,
      tertiaryCategory: null,
      categorySlug: 'all',
      subcategorySlug: null,
      tertiarySlug: null,
      title: 'All Collections',
      tagline: 'Where Comfort Meets Confidence',
      description: 'Immerse yourself in pieces made from pure mul-silk, organic cotton, and precision tailoring.',
      image: '/assets/images/featured-saree.jpg',
      breadcrumbs: [
        { label: 'Home', path: '/' },
        { label: 'All Collections', path: '/category/all' }
      ]
    };
  }

  // Search categories tree (Level 1, Level 2, Level 3)
  for (const cat of CATEGORIES_DATA) {
    const catPath = normalizePath(cat.path);
    if (catPath === normalizedPath) {
      return {
        type: 'category',
        category: cat,
        subcategory: null,
        tertiaryCategory: null,
        categorySlug: cat.slug,
        subcategorySlug: null,
        tertiarySlug: null,
        title: cat.name,
        tagline: cat.tagline,
        description: cat.description,
        image: cat.image,
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: cat.name, path: cat.path }
        ]
      };
    }

    if (cat.children && cat.children.length > 0) {
      for (const sub of cat.children) {
        const subPath = normalizePath(sub.path);
        if (subPath === normalizedPath) {
          return {
            type: 'subcategory',
            category: cat,
            subcategory: sub,
            tertiaryCategory: null,
            categorySlug: cat.slug,
            subcategorySlug: sub.slug,
            tertiarySlug: null,
            title: `${cat.name}: ${sub.name}`,
            tagline: sub.tagline || cat.tagline,
            description: sub.description || cat.description,
            image: sub.image || cat.image,
            breadcrumbs: [
              { label: 'Home', path: '/' },
              { label: cat.name, path: cat.path },
              { label: sub.name, path: sub.path }
            ]
          };
        }

        // Level 3 (e.g. Accessories -> Anti turnis -> Chains)
        if (sub.children && sub.children.length > 0) {
          for (const leaf of sub.children) {
            const leafPath = normalizePath(leaf.path);
            if (leafPath === normalizedPath) {
              return {
                type: 'tertiary',
                category: cat,
                subcategory: sub,
                tertiaryCategory: leaf,
                categorySlug: cat.slug,
                subcategorySlug: sub.slug,
                tertiarySlug: leaf.slug,
                title: `${sub.name}: ${leaf.name}`,
                tagline: leaf.tagline || sub.tagline || cat.tagline,
                description: leaf.description || sub.description || cat.description,
                image: leaf.image || sub.image || cat.image,
                breadcrumbs: [
                  { label: 'Home', path: '/' },
                  { label: cat.name, path: cat.path },
                  { label: sub.name, path: sub.path },
                  { label: leaf.name, path: leaf.path }
                ]
              };
            }
          }
        }
      }
    }
  }

  // Check main nav items (e.g. /about, /contact)
  for (const item of MAIN_NAV_ITEMS) {
    if (normalizePath(item.path) === normalizedPath) {
      return {
        type: 'nav',
        item,
        categorySlug: null,
        subcategorySlug: null,
        tertiarySlug: null,
        sectionId: item.sectionId,
        breadcrumbs: [
          { label: 'Home', path: '/' },
          { label: item.label, path: item.path }
        ]
      };
    }
  }

  // Not found in configured tree
  return null;
}


