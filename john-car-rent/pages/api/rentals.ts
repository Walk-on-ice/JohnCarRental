import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { carId, userId, startDate } = req.body;

    try {
      const rental = await prisma.rental.create({
        data: {
          carId,
          userId,
          startDate: new Date(startDate),
        },
      });
      res.status(200).json(rental);
    } catch (error) {
      res.status(500).json({ error: 'Error creating rental' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}