// Product Database for Maavdi E-commerce

const products = {
  namkeen: [
    {
      id: 'namkeen-1',
      name: 'Aloo Bhujia',
      category: 'Namkeen',
      price: 120,
      originalPrice: 150,
      image: '/image/aloo bhujia.webp',
      rating: 4.5,
      reviews: 128,
      description: 'Crispy and delicious potato snack with perfect spices',
      stock: 45,
      weight: '250g',
      sizes: [
        { size: '250g', price: 120, originalPrice: 150, stock: 45 },
        { size: '500g', price: 220, originalPrice: 280, stock: 38 }
      ],
      ingredients: 'Potatoes, Oil, Salt, Spices',
      expiry: '6 months'
    },
    {
      id: 'namkeen-2',
      name: 'Chikhalwali',
      category: 'Namkeen',
      price: 150,
      originalPrice: 180,
      image: '/image/Chikhalwali Mix.jpg',
      rating: 4.3,
      reviews: 95,
      description: 'Traditional savory snack made with finest ingredients',
      stock: 32,
      weight: '250g',
      sizes: [
        { size: '250g', price: 150, originalPrice: 180, stock: 32 },
        { size: '500g', price: 280, originalPrice: 340, stock: 28 }
      ],
      ingredients: 'Flour, Oil, Salt, Cumin Seeds',
      expiry: '8 months'
    },
    {
      id: 'namkeen-3',
      name: 'Moong Dal Namkeen',
      category: 'Namkeen',
      price: 140,
      originalPrice: 170,
      image: '/image/moong dal.jpg',
      rating: 4.6,
      reviews: 156,
      description: 'Crunchy moong dal snack with special recipe',
      stock: 58,
      weight: '250g',
      sizes: [
        { size: '250g', price: 140, originalPrice: 170, stock: 58 },
        { size: '500g', price: 260, originalPrice: 320, stock: 45 }
      ],
      ingredients: 'Moong Dal, Oil, Salt, Spices',
      expiry: '6 months'
    },
    {
      id: 'namkeen-4',
      name: 'Bundi Masala',
      category: 'Namkeen',
      price: 130,
      originalPrice: 160,
      image: '/image/boondi-masala-.webp',
      rating: 4.4,
      reviews: 112,
      description: 'Spicy round pearl-shaped namkeen snack',
      stock: 40,
      weight: '250g',
      sizes: [
        { size: '250g', price: 130, originalPrice: 160, stock: 40 },
        { size: '500g', price: 240, originalPrice: 300, stock: 35 }
      ],
      ingredients: 'Chickpea Flour, Oil, Salt, Red Chili',
      expiry: '6 months'
    },
    {
      id: 'namkeen-5',
      name: 'Chikhalwali Mix',
      category: 'Namkeen',
      price: 160,
      originalPrice: 200,
      image: '/image/Chikhalwali Mix.jpg',
      rating: 4.7,
      reviews: 189,
      description: 'Premium mix of multiple savory snacks',
      stock: 65,
      weight: '250g',
      sizes: [
        { size: '250g', price: 160, originalPrice: 200, stock: 65 },
        { size: '500g', price: 300, originalPrice: 380, stock: 50 }
      ],
      ingredients: 'Multiple namkeen varieties',
      expiry: '7 months'
    }
  ],
  sweet: [
    {
      id: 'sweet-1',
      name: 'Gulab Jamun',
      category: 'Sweet',
      price: 200,
      originalPrice: 250,
      image: '/image/Gulab Jamun.jpg',
      rating: 4.8,
      reviews: 234,
      description: 'Soft and spongy balls dipped in sugar syrup',
      stock: 30,
      weight: '250g',
      sizes: [
        { size: '250g', price: 200, originalPrice: 250, stock: 30 },
        { size: '500g', price: 380, originalPrice: 480, stock: 22 },
        { size: '1kg', price: 720, originalPrice: 900, stock: 15 }
      ],
      ingredients: 'Milk Solids, Sugar, Cardamom',
      expiry: '10 days'
    },
    {
      id: 'sweet-2',
      name: 'Jalebi',
      category: 'Sweet',
      price: 180,
      originalPrice: 220,
      image: '/image/Jalebi.webp',
      rating: 4.6,
      reviews: 189,
      description: 'Crispy spirals soaked in sugar syrup',
      stock: 28,
      weight: '250g',
      sizes: [
        { size: '250g', price: 180, originalPrice: 220, stock: 28 },
        { size: '500g', price: 340, originalPrice: 420, stock: 20 },
        { size: '1kg', price: 640, originalPrice: 800, stock: 12 }
      ],
      ingredients: 'Flour, Sugar, Saffron, Oil',
      expiry: '7 days'
    },
    {
      id: 'sweet-3',
      name: 'Laddu',
      category: 'Sweet',
      price: 220,
      originalPrice: 280,
      image: '/image/MotichoorLaddu4.webp',
      rating: 4.7,
      reviews: 167,
      description: 'Round sweet balls made with traditional recipe',
      stock: 35,
      weight: '250g',
      sizes: [
        { size: '250g', price: 220, originalPrice: 280, stock: 35 },
        { size: '500g', price: 420, originalPrice: 540, stock: 28 },
        { size: '1kg', price: 800, originalPrice: 1020, stock: 18 }
      ],
      ingredients: 'Gram Flour, Ghee, Sugar, Dry Fruits',
      expiry: '15 days'
    },
    {
      id: 'sweet-4',
      name: 'Kaju Katli',
      category: 'Sweet',
      price: 350,
      originalPrice: 450,
      image: '/image/KajuKatli.jpg',
      rating: 4.9,
      reviews: 256,
      description: 'Diamond-shaped cashew brittle delicacy',
      stock: 20,
      weight: '250g',
      sizes: [
        { size: '250g', price: 350, originalPrice: 450, stock: 20 },
        { size: '500g', price: 680, originalPrice: 860, stock: 15 },
        { size: '1kg', price: 1300, originalPrice: 1640, stock: 10 }
      ],
      ingredients: 'Cashews, Sugar, Ghee',
      expiry: '20 days'
    },
    {
      id: 'sweet-5',
      name: 'Rasgulla',
      category: 'Sweet',
      price: 210,
      originalPrice: 260,
      image: '/image/rasgulla-recipe.jpg',
      rating: 4.8,
      reviews: 198,
      description: 'Spongy white balls in light sugar syrup',
      stock: 25,
      weight: '250g',
      sizes: [
        { size: '250g', price: 210, originalPrice: 260, stock: 25 },
        { size: '500g', price: 400, originalPrice: 500, stock: 18 },
        { size: '1kg', price: 760, originalPrice: 950, stock: 12 }
      ],
      ingredients: 'Milk Solids, Sugar, Rose Essence',
      expiry: '5 days'
    }
  ],
  ghee: [
    {
      id: 'ghee-1',
      name: 'Pure Cow Ghee',
      category: 'Ghee',
      price: 600,
      originalPrice: 750,
      image: '/image/Gulab Jamun.jpg',
      rating: 4.7,
      reviews: 312,
      description: 'Pure cow ghee made from organic milk',
      stock: 48,
      weight: '500ml',
      sizes: [
        { size: '500ml', price: 600, originalPrice: 750, stock: 48 },
        { size: '1kg', price: 1150, originalPrice: 1450, stock: 35 }
      ],
      ingredients: '100% Cow Milk Butter',
      expiry: '12 months'
    },
    {
      id: 'ghee-2',
      name: 'Buffalo Ghee',
      category: 'Ghee',
      price: 550,
      originalPrice: 680,
      image: '/image/aloo bhujia.webp',
      rating: 4.6,
      reviews: 267,
      description: 'Rich and creamy buffalo ghee',
      stock: 55,
      weight: '500ml',
      sizes: [
        { size: '500ml', price: 550, originalPrice: 680, stock: 55 },
        { size: '1kg', price: 1050, originalPrice: 1300, stock: 42 }
      ],
      ingredients: '100% Buffalo Milk Butter',
      expiry: '12 months'
    },
    {
      id: 'ghee-3',
      name: 'A2 Cow Ghee',
      category: 'Ghee',
      price: 800,
      originalPrice: 1000,
      image: '/image/KajuKatli.jpg',
      rating: 4.9,
      reviews: 401,
      description: 'Premium A2 cow ghee for health benefits',
      stock: 35,
      weight: '500ml',
      sizes: [
        { size: '500ml', price: 800, originalPrice: 1000, stock: 35 },
        { size: '1kg', price: 1550, originalPrice: 1950, stock: 25 }
      ],
      ingredients: '100% A2 Cow Milk Butter',
      expiry: '12 months'
    },
    {
      id: 'ghee-4',
      name: 'Organic Desi Ghee',
      category: 'Ghee',
      price: 650,
      originalPrice: 800,
      image: '/image/rasgulla-recipe.jpg',
      rating: 4.8,
      reviews: 289,
      description: 'Pure organic desi ghee',
      stock: 40,
      weight: '500ml',
      sizes: [
        { size: '500ml', price: 650, originalPrice: 800, stock: 40 },
        { size: '1kg', price: 1250, originalPrice: 1550, stock: 28 }
      ],
      ingredients: '100% Organic Cow Milk Butter',
      expiry: '12 months'
    },
    {
      id: 'ghee-5',
      name: 'Herbal Infused Ghee',
      category: 'Ghee',
      price: 700,
      originalPrice: 900,
      image: '/image/Jalebi.webp',
      rating: 4.6,
      reviews: 178,
      description: 'Ghee infused with herbs for health',
      stock: 42,
      weight: '500ml',
      sizes: [
        { size: '500ml', price: 700, originalPrice: 900, stock: 42 },
        { size: '1kg', price: 1350, originalPrice: 1750, stock: 32 }
      ],
      ingredients: 'Cow Ghee, Herbs, Spices',
      expiry: '12 months'
    }
  ],
  makhan: [
    {
      id: 'makhan-1',
      name: 'Pure Cow Butter',
      category: 'Makhan',
      price: 400,
      originalPrice: 500,
      image: '/image/MotichoorLaddu4.webp',
      rating: 4.7,
      reviews: 234,
      description: 'Pure fresh cow butter made daily',
      stock: 60,
      weight: '500g',
      sizes: [
        { size: '500g', price: 400, originalPrice: 500, stock: 60 },
        { size: '1kg', price: 780, originalPrice: 980, stock: 45 }
      ],
      ingredients: '100% Cow Milk Cream',
      expiry: '1 month'
    },
    {
      id: 'makhan-2',
      name: 'Salted Butter',
      category: 'Makhan',
      price: 380,
      originalPrice: 480,
      image: '/image/boondi-masala-.webp',
      rating: 4.5,
      reviews: 189,
      description: 'Salted butter for cooking and baking',
      stock: 52,
      weight: '500g',
      sizes: [
        { size: '500g', price: 380, originalPrice: 480, stock: 52 },
        { size: '1kg', price: 740, originalPrice: 940, stock: 40 }
      ],
      ingredients: 'Cow Milk Cream, Salt',
      expiry: '2 months'
    },
    {
      id: 'makhan-3',
      name: 'Unsalted Butter',
      category: 'Makhan',
      price: 420,
      originalPrice: 520,
      image: '/image/moong dal.jpg',
      rating: 4.8,
      reviews: 267,
      description: 'Pure unsalted butter for baking',
      stock: 48,
      weight: '500g',
      sizes: [
        { size: '500g', price: 420, originalPrice: 520, stock: 48 },
        { size: '1kg', price: 820, originalPrice: 1020, stock: 35 }
      ],
      ingredients: '100% Cow Milk Cream',
      expiry: '1 month'
    },
    {
      id: 'makhan-4',
      name: 'Organic Makhan',
      category: 'Makhan',
      price: 500,
      originalPrice: 650,
      image: '/image/Chikhalwali Mix.jpg',
      rating: 4.9,
      reviews: 312,
      description: 'Certified organic butter from grass-fed cows',
      stock: 35,
      weight: '500g',
      sizes: [
        { size: '500g', price: 500, originalPrice: 650, stock: 35 },
        { size: '1kg', price: 980, originalPrice: 1280, stock: 25 }
      ],
      ingredients: '100% Organic Cow Milk Cream',
      expiry: '1.5 months'
    },
    {
      id: 'makhan-5',
      name: 'Cultured Butter',
      category: 'Makhan',
      price: 450,
      originalPrice: 580,
      image: '/image/rasgulla-recipe.jpg',
      rating: 4.6,
      reviews: 198,
      description: 'Cultured butter with tangy flavor',
      stock: 42,
      weight: '500g',
      sizes: [
        { size: '500g', price: 450, originalPrice: 580, stock: 42 },
        { size: '1kg', price: 880, originalPrice: 1140, stock: 30 }
      ],
      ingredients: 'Cultured Cow Milk Cream, Salt',
      expiry: '2 months'
    }
  ],
  icepops: [
    {
      id: 'icepops-1',
      name: 'Mango Ice Pop',
      category: 'Ice Pops',
      price: 50,
      originalPrice: 60,
      image: '/image/Gulab Jamun.jpg',
      rating: 4.8,
      reviews: 456,
      description: 'Refreshing mango flavored ice pop',
      stock: 150,
      weight: '20 packs',
      sizes: [
        { size: '20 packs', price: 50, originalPrice: 60, stock: 150 },
        { size: '40 packs', price: 95, originalPrice: 115, stock: 100 }
      ],
      ingredients: 'Mango Pulp, Water, Sugar',
      expiry: '3 months'
    },
    {
      id: 'icepops-2',
      name: 'Strawberry Ice Pop',
      category: 'Ice Pops',
      price: 50,
      originalPrice: 60,
      image: '/image/KajuKatli.jpg',
      rating: 4.7,
      reviews: 389,
      description: 'Sweet strawberry ice pop',
      stock: 140,
      weight: '20 packs',
      sizes: [
        { size: '20 packs', price: 50, originalPrice: 60, stock: 140 },
        { size: '40 packs', price: 95, originalPrice: 115, stock: 95 }
      ],
      ingredients: 'Strawberry Pulp, Water, Sugar',
      expiry: '3 months'
    },
    {
      id: 'icepops-3',
      name: 'Orange Ice Pop',
      category: 'Ice Pops',
      price: 50,
      originalPrice: 60,
      image: '/image/Jalebi.webp',
      rating: 4.6,
      reviews: 334,
      description: 'Citrusy orange ice pop',
      stock: 135,
      weight: '20 packs',
      sizes: [
        { size: '20 packs', price: 50, originalPrice: 60, stock: 135 },
        { size: '40 packs', price: 95, originalPrice: 115, stock: 90 }
      ],
      ingredients: 'Orange Juice, Water, Sugar',
      expiry: '3 months'
    },
    {
      id: 'icepops-4',
      name: 'Mixed Fruit Ice Pop',
      category: 'Ice Pops',
      price: 55,
      originalPrice: 70,
      image: '/image/MotichoorLaddu4.webp',
      rating: 4.9,
      reviews: 512,
      description: 'Blend of multiple fruits in one pop',
      stock: 160,
      weight: '20 packs',
      sizes: [
        { size: '20 packs', price: 55, originalPrice: 70, stock: 160 },
        { size: '40 packs', price: 105, originalPrice: 135, stock: 105 }
      ],
      ingredients: 'Mixed Fruits, Water, Sugar',
      expiry: '3 months'
    },
    {
      id: 'icepops-5',
      name: 'Kulfi Ice Pop',
      category: 'Ice Pops',
      price: 60,
      originalPrice: 80,
      image: '/image/boondi-masala-.webp',
      rating: 4.9,
      reviews: 578,
      description: 'Traditional kulfi flavored ice pop',
      stock: 170,
      weight: '20 packs',
      sizes: [
        { size: '20 packs', price: 60, originalPrice: 80, stock: 170 },
        { size: '40 packs', price: 115, originalPrice: 155, stock: 110 }
      ],
      ingredients: 'Milk, Sugar, Cardamom, Pistachios',
      expiry: '3 months'
    }
  ]
};

export default products;
