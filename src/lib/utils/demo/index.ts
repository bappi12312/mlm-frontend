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
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    name: "Wireless Headphones",
    owner: "John Doe",
    description: "High-quality wireless headphones with noise cancellation.",
    isFeatured: true,
    stock: 50,
    category: "Electronics"
  },
  {
    _id: "2",
    image: "https://plus.unsplash.com/premium_photo-1679913792906-13ccc5c84d44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D",
    name: "Gaming Mouse",
    owner: "Alice Smith",
    description: "Ergonomic gaming mouse with customizable buttons and RGB lighting.",
    isFeatured: false,
    stock: 30,
    category: "Accessories"
  },
  {
    _id: "3",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    name: "Smartwatch",
    owner: "Michael Brown",
    description: "Feature-rich smartwatch with health tracking and notifications.",
    isFeatured: true,
    stock: 20,
    category: "Wearables"
  },
  {
    _id: "4",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    name: "Bluetooth Speaker",
    owner: "Sarah Johnson",
    description: "Portable Bluetooth speaker with deep bass and 10-hour battery life.",
    isFeatured: false,
    stock: 40,
    category: "Audio"
  },
  {
    _id: "5",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2R1Y3R8ZW58MHx8MHx8fDA%3D",
    name: "Mechanical Keyboard",
    owner: "David Lee",
    description: "Mechanical keyboard with customizable RGB backlighting and blue switches.",
    isFeatured: true,
    stock: 25,
    category: "Accessories"
  }
];

