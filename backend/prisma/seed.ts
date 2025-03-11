import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create initial products
  const products = [
    {
      name: "Professional DSLR Camera",
      description: "High-end digital camera with 24.2MP sensor, 4K video recording, and advanced autofocus system",
      price: 1299.99,
      stock: 15,
      imageUrl: "https://picsum.photos/800/600?random=1"
    },
    {
      name: "Wireless Noise-Cancelling Headphones", 
      description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality",
      price: 299.99,
      stock: 50,
      imageUrl: "https://picsum.photos/800/600?random=2"
    },
    {
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life",
      price: 199.99,
      stock: 75,
      imageUrl: "https://picsum.photos/800/600?random=3"
    },
    {
      name: "Ultra-Slim Laptop",
      description: "13-inch laptop with Intel Core i7, 16GB RAM, 512GB SSD, and stunning 4K display",
      price: 1499.99,
      stock: 25,
      imageUrl: "https://picsum.photos/800/600?random=4"
    },
    {
      name: "Wireless Gaming Mouse",
      description: "High-precision gaming mouse with 16000 DPI sensor, programmable buttons, and RGB lighting",
      price: 79.99,
      stock: 100,
      imageUrl: "https://picsum.photos/800/600?random=5"
    },
    {
      name: "4K Smart TV",
      description: "55-inch 4K Ultra HD Smart TV with HDR, built-in streaming apps, and voice control",
      price: 699.99,
      stock: 30,
      imageUrl: "https://picsum.photos/800/600?random=6"
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Waterproof portable speaker with 20-hour battery life, deep bass, and 360-degree sound",
      price: 129.99,
      stock: 60,
      imageUrl: "https://picsum.photos/800/600?random=7"
    },
    {
      name: "Smart Home Security Camera",
      description: "1080p wireless security camera with night vision, two-way audio, and motion detection",
      price: 89.99,
      stock: 45,
      imageUrl: "https://picsum.photos/800/600?random=8"
    },
    {
      name: "Mechanical Gaming Keyboard",
      description: "RGB mechanical keyboard with Cherry MX switches, multimedia controls, and wrist rest",
      price: 149.99,
      stock: 40,
      imageUrl: "https://picsum.photos/800/600?random=9"
    },
    {
      name: "Wireless Earbuds",
      description: "True wireless earbuds with active noise cancellation, touch controls, and wireless charging case",
      price: 159.99,
      stock: 80,
      imageUrl: "https://picsum.photos/800/600?random=10"
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  // Create an admin user
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword, // "password123"
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN"
    }
  });

  // Create a customer user
  await prisma.user.create({
    data: {
      email: "customer@example.com",
      password: hashedPassword, // "password123"
      firstName: "Customer",  
      lastName: "User",
      role: "CUSTOMER"
    }
  });

  console.log('Seed data created successfully!');
  console.log('Admin user created:');
  console.log('Email: admin@example.com');
  console.log('Password: password123');
  console.log('Customer user created:');
  console.log('Email: customer@example.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 