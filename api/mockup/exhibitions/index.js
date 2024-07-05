import { exhibitions } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    res.status(200).json(exhibitions);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}