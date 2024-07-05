import { reviews } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { user_id, exhibition_id, rating, comment } = req.body;
    const review_id = reviews.length + 1;
    const newReview = {
      review_id,
      user_id,
      exhibition_id,
      rating,
      comment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    reviews.push(newReview);
    res.status(201).json(newReview);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
