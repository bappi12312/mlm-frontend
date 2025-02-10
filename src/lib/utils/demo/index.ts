export interface demoProduct {
  _id: string
  image: string
  name: string
  owner: string
  description: string
  isFeatured: boolean
  stock: number
  category: string
}

export const products = [
  {
    _id: "1",
    image: "https://example.com/image1.jpg",
    name: "Wireless Headphones",
    owner: "John Doe",
    description: "High-quality wireless headphones with noise cancellation.",
    isFeatured: true,
    stock: 50,
    category: "Electronics"
  },
  {
    _id: "2",
    image: "https://example.com/image2.jpg",
    name: "Gaming Mouse",
    owner: "Alice Smith",
    description: "Ergonomic gaming mouse with customizable buttons and RGB lighting.",
    isFeatured: false,
    stock: 30,
    category: "Accessories"
  },
  {
    _id: "3",
    image: "https://example.com/image3.jpg",
    name: "Smartwatch",
    owner: "Michael Brown",
    description: "Feature-rich smartwatch with health tracking and notifications.",
    isFeatured: true,
    stock: 20,
    category: "Wearables"
  },
  {
    _id: "4",
    image: "https://example.com/image4.jpg",
    name: "Bluetooth Speaker",
    owner: "Sarah Johnson",
    description: "Portable Bluetooth speaker with deep bass and 10-hour battery life.",
    isFeatured: false,
    stock: 40,
    category: "Audio"
  },
  {
    _id: "5",
    image: "https://example.com/image5.jpg",
    name: "Mechanical Keyboard",
    owner: "David Lee",
    description: "Mechanical keyboard with customizable RGB backlighting and blue switches.",
    isFeatured: true,
    stock: 25,
    category: "Accessories"
  }
];

