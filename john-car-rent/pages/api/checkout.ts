import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { cart, userId } = req.body;

    // Log the request body for debugging
    console.log('Request body:', req.body);

    // Validate the request body
    if (!Array.isArray(cart) || typeof userId !== 'string') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
      // Validate cart items
      for (const item of cart) {
        if (!item.id || typeof item.price !== 'number') {
          console.error('Invalid cart item:', item);
          return res.status(400).json({ error: 'Invalid cart item' });
        }
      }

      // Process the checkout with the cart items and userId
      const order = await prisma.order.create({
        data: {
          userId,
          items: {
            create: cart.map((item: any) => ({
              carId: item.id,
              price: item.price,
            })),
          },
        },
      });

      res.status(200).json({ message: 'Checkout successful', order });
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ error: 'Error during checkout' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}