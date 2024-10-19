import type { NextApiRequest, NextApiResponse } from 'next';

// Define the interface for the car items
interface Car {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

// Initialize the cart with the correct type
let cart: Car[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { car } = req.body;
    cart.push(car);
    res.status(200).json({ message: 'Car added to cart', cart });
  } else if (req.method === 'GET') {
    res.status(200).json(cart);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}