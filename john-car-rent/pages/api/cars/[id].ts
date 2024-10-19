import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const carId = Array.isArray(id) ? id[0] : id;
      await db.car.delete({
        where: { id: carId },
      });
      res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
      console.error('Error deleting car:', error);
      res.status(500).json({ error: 'Failed to delete car' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}