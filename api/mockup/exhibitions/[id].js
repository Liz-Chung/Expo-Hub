import { exhibitions } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const exhibition = exhibitions.find(exh => exh.exhibition_id === parseInt(id));
    if (exhibition) {
      res.status(200).json(exhibition);
    } else {
      res.status(404).json({ message: 'Exhibition not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
