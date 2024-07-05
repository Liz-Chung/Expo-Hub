import { reviews } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const review = reviews.find(review => review.review_id === parseInt(id));
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
