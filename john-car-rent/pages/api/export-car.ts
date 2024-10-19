import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import * as z from 'zod';

// Define a schema for input validation
const carSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().positive('Price must be a positive number'),
  imageUrl: z.string().url('Invalid URL'),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const body = req.body;
      console.log('Request body:', body); // Log the request body for debugging

      const { name, brand, price, imageUrl } = carSchema.parse(body);

      const existingCarByName = await db.car.findFirst({
        where: {
          name: name,
        },
      });
      if (existingCarByName) {
        return res.status(409).json({ user: null, message: 'Car with this name already exists' });
      }

      const existingCarByBrand = await db.car.findFirst({
        where: {
          brand: brand,
        },
      });
      if (existingCarByBrand) {
        return res.status(409).json({ user: null, message: 'Car with this brand already exists' });
      }

      const newCar = await db.car.create({
        data: {
          name,
          brand,
          price,
          imageUrl,
        },
      });

      const { ...rest } = newCar;
      return res.status(201).json({ user: rest, message: 'Car created successfully' });
    } catch (error) {
      console.error('Error exporting car:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid car data', details: error.errors });
      }
      return res.status(500).json({ error: 'Failed to export car', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}