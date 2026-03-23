const products = [
    {
        name: "Aloo Bhujia",
        category: "Namkeen",
        description: "Crispy and delicious potato snack with perfect spices",
        images: ["/image/aloo bhujia.webp"],
        ingredients: "Potatoes, Oil, Salt, Spices",
        expiry: "6 months",
        sizes: [
            { size: "250g", price: 120, originalPrice: 150, stock: 45 },
            { size: "500g", price: 220, originalPrice: 280, stock: 38 }
        ],
        rating: 4.5,
        reviewsCount: 128,
        totalStock: 83,
        isActive: true
    },

    {
        name: "Chikhalwali Mix",
        category: "Namkeen",
        description: "Traditional savory snack made with finest ingredients",
        images: ["/image/Chikhalwali Mix.jpg"],
        ingredients: "Flour, Oil, Salt, Cumin Seeds",
        expiry: "8 months",
        sizes: [
            { size: "250g", price: 150, originalPrice: 180, stock: 32 },
            { size: "500g", price: 280, originalPrice: 340, stock: 28 }
        ],
        rating: 4.3,
        reviewsCount: 95,
        totalStock: 60,
        isActive: true
    },

    {
        name: "Moong Dal Namkeen",
        category: "Namkeen",
        description: "Crunchy moong dal snack with special recipe",
        images: ["/image/moong dal.jpg"],
        ingredients: "Moong Dal, Oil, Salt, Spices",
        expiry: "6 months",
        sizes: [
            { size: "250g", price: 140, originalPrice: 170, stock: 58 },
            { size: "500g", price: 260, originalPrice: 320, stock: 45 }
        ],
        rating: 4.6,
        reviewsCount: 156,
        totalStock: 103,
        isActive: true
    },

    {
        name: "Gulab Jamun",
        category: "Sweet",
        description: "Soft and spongy balls dipped in sugar syrup",
        images: ["/image/Gulab Jamun.jpg"],
        ingredients: "Milk Solids, Sugar, Cardamom",
        expiry: "10 days",
        sizes: [
            { size: "250g", price: 200, originalPrice: 250, stock: 30 },
            { size: "500g", price: 380, originalPrice: 480, stock: 22 }
        ],
        rating: 4.8,
        reviewsCount: 234,
        totalStock: 52,
        isActive: true
    },

    {
        name: "Jalebi",
        category: "Sweet",
        description: "Crispy spirals soaked in sugar syrup",
        images: ["/image/Jalebi.webp"],
        ingredients: "Flour, Sugar, Saffron, Oil",
        expiry: "7 days",
        sizes: [
            { size: "250g", price: 180, originalPrice: 220, stock: 28 },
            { size: "500g", price: 340, originalPrice: 420, stock: 20 }
        ],
        rating: 4.6,
        reviewsCount: 189,
        totalStock: 48,
        isActive: true
    },

    {
        name: "Kaju Katli",
        category: "Sweet",
        description: "Diamond-shaped cashew delicacy",
        images: ["/image/KajuKatli.jpg"],
        ingredients: "Cashews, Sugar, Ghee",
        expiry: "20 days",
        sizes: [
            { size: "250g", price: 350, originalPrice: 450, stock: 20 },
            { size: "500g", price: 680, originalPrice: 860, stock: 15 }
        ],
        rating: 4.9,
        reviewsCount: 256,
        totalStock: 35,
        isActive: true
    },

    {
        name: "Pure Cow Ghee",
        category: "Ghee",
        description: "Pure cow ghee made from organic milk",
        images: ["/image/ghee.webp"],
        ingredients: "100% Cow Milk Butter",
        expiry: "12 months",
        sizes: [
            { size: "500ml", price: 600, originalPrice: 750, stock: 48 },
            { size: "1kg", price: 1150, originalPrice: 1450, stock: 35 }
        ],
        rating: 4.7,
        reviewsCount: 312,
        totalStock: 83,
        isActive: true
    },

    {
        name: "A2 Cow Ghee",
        category: "Ghee",
        description: "Premium A2 cow ghee for health benefits",
        images: ["/image/a2-ghee.webp"],
        ingredients: "100% A2 Cow Milk Butter",
        expiry: "12 months",
        sizes: [
            { size: "500ml", price: 800, originalPrice: 1000, stock: 35 },
            { size: "1kg", price: 1550, originalPrice: 1950, stock: 25 }
        ],
        rating: 4.9,
        reviewsCount: 401,
        totalStock: 60,
        isActive: true
    },

    {
        name: "Pure Cow Butter",
        category: "Makhan",
        description: "Fresh cow butter made daily",
        images: ["/image/makhan.webp"],
        ingredients: "100% Cow Milk Cream",
        expiry: "1 month",
        sizes: [
            { size: "500g", price: 400, originalPrice: 500, stock: 60 },
            { size: "1kg", price: 780, originalPrice: 980, stock: 45 }
        ],
        rating: 4.7,
        reviewsCount: 234,
        totalStock: 105,
        isActive: true
    },

    {
        name: "Mango Ice Pop",
        category: "Ice Pops",
        description: "Refreshing mango flavored ice pop",
        images: ["/image/mango-icepop.webp"],
        ingredients: "Mango Pulp, Water, Sugar",
        expiry: "3 months",
        sizes: [
            { size: "20 packs", price: 50, originalPrice: 60, stock: 150 },
            { size: "40 packs", price: 95, originalPrice: 115, stock: 100 }
        ],
        rating: 4.8,
        reviewsCount: 456,
        totalStock: 250,
        isActive: true
    }
];

export default products;
