import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('API route hit!'); // Ensure this logs
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      data: [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' }
      ],
    });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
