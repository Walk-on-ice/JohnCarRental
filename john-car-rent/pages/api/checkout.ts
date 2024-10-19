import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import * as z from 'zod';

// Define a schema for input validation
const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
});

const cartSchema = z.array(cartItemSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { cart } = req.body;
      const validatedCart = cartSchema.parse(cart);

      // Calculate the total price of the cart
      const total = validatedCart.reduce((sum, item) => sum + item.price, 0);

      // Save the total to the Income table
      const newIncome = await db.income.create({
        data: {
          total,
        },
      });

      return res.status(200).json({ message: 'Checkout successful!', total: newIncome.total });
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid cart data', details: error.errors });
      }
      return res.status(500).json({ error: 'Failed to process checkout', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}