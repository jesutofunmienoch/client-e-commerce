export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
  trending?: boolean;
}

export const categories = [
  { id: "electronics", name: "Electronics", icon: "Laptop" },
  { id: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "home", name: "Home & Living", icon: "Home" },
  { id: "sports", name: "Sports & Outdoors", icon: "Dumbbell" },
  { id: "books", name: "Books", icon: "Book" },
  { id: "beauty", name: "Beauty", icon: "Sparkles" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and frequent travelers.",
    price: 299000,
    salePrice: 249000,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 342,
    stock: 45,
    featured: true,
    trending: true,
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    description:
      "Advanced fitness tracking, heart rate monitoring, GPS, and seamless smartphone integration. Stay connected and healthy.",
    price: 399000,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    ],
    rating: 4.6,
    reviews: 189,
    stock: 32,
    trending: true,
  },
  {
    id: "3",
    name: "Classic Leather Jacket",
    description:
      "Timeless genuine leather jacket with premium stitching. A wardrobe essential that never goes out of style.",
    price: 249000,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    ],
    rating: 4.7,
    reviews: 156,
    stock: 18,
    featured: true,
  },
  {
    id: "4",
    name: "Minimalist Sneakers",
    description:
      "Comfortable all-day wear with clean, modern design. Made from sustainable materials with cushioned insoles.",
    price: 89999,
    salePrice: 69999,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
    ],
    rating: 4.5,
    reviews: 423,
    stock: 67,
    trending: true,
  },
  {
    id: "5",
    name: "Modern Table Lamp",
    description:
      "Elegant minimalist design with adjustable brightness. Perfect for reading or ambient lighting in any room.",
    price: 79999,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
    ],
    rating: 4.4,
    reviews: 98,
    stock: 41,
  },
  {
    id: "6",
    name: "Ceramic Coffee Mug Set",
    description:
      "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Perfect for coffee enthusiasts.",
    price: 34999,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
    ],
    rating: 4.6,
    reviews: 234,
    stock: 89,
    featured: true,
  },
  {
    id: "7",
    name: "Yoga Mat Pro",
    description:
      "Extra thick, non-slip yoga mat with carrying strap. Eco-friendly materials for your wellness journey.",
    price: 49999,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    ],
    rating: 4.7,
    reviews: 312,
    stock: 56,
  },
  {
    id: "8",
    name: "Bestseller Novel Collection",
    description:
      "Box set of 3 award-winning contemporary novels. Perfect gift for book lovers.",
    price: 44999,
    category: "books",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
    ],
    rating: 4.9,
    reviews: 567,
    stock: 134,
    trending: true,
  },
  {
    id: "9",
    name: "Organic Skincare Set",
    description:
      "Complete 5-piece skincare routine with natural ingredients. Cruelty-free and vegan-friendly.",
    price: 89999,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    ],
    rating: 4.8,
    reviews: 289,
    stock: 73,
    featured: true,
  },
  {
    id: "10",
    name: "Professional Camera Lens",
    description:
      "50mm f/1.8 prime lens for stunning portraits and low-light photography. Compatible with major camera brands.",
    price: 449000,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1606831882433-f1856e4cdd73?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606831882433-f1856e4cdd73?w=800&q=80",
    ],
    rating: 4.9,
    reviews: 178,
    stock: 23,
  },
  {
    id: "11",
    name: "Designer Sunglasses",
    description:
      "UV400 protection with polarized lenses. Modern frame design that suits any face shape.",
    price: 129999,
    salePrice: 99999,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    ],
    rating: 4.5,
    reviews: 267,
    stock: 91,
  },
  {
    id: "12",
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated 32oz bottle keeps drinks cold for 24h or hot for 12h. BPA-free and leak-proof design.",
    price: 29999,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    ],
    rating: 4.6,
    reviews: 445,
    stock: 156,
  },
];
