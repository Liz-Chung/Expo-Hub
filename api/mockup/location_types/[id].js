import { location_types } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const locationType = location_types.find(type => type.location_type_id === parseInt(id));
    if (locationType) {
      res.status(200).json(locationType);
    } else {
      res.status(404).json({ message: 'Location type not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
