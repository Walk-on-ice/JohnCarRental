import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const cars = await prisma.car.findMany();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch cars' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}