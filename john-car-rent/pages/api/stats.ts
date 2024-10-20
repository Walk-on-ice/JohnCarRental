import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch the total number of cars
      const carCount = await prisma.car.count();

      // Fetch the total number of users
      const userCount = await prisma.users.count();

      // Fetch the income data from the Item model
      const incomeData = await prisma.item.findMany({
        select: {
          id: true,
          price: true,
        },
      });

      res.status(200).json({ carCount, userCount, incomeData });
    } catch (error) {
      console.error('Error fetching stats data:', error);
      res.status(500).json({ error: 'Failed to fetch stats data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}