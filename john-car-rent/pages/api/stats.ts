import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const carCount = await db.car.count();
      const userCount = await db.users.count();
      const incomeData = await db.income.findMany();

      return res.status(200).json({ carCount, userCount, incomeData });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}