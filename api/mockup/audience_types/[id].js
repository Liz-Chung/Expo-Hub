import { audience_types } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const audienceType = audience_types.find(type => type.audience_type_id === parseInt(id));
    if (audienceType) {
      res.status(200).json(audienceType);
    } else {
      res.status(404).json({ message: 'Audience type not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
