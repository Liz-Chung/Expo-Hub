import { reviews } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'DELETE') {
    const reviewIndex = reviews.findIndex(review => review.review_id === parseInt(id));
    if (reviewIndex > -1) {
      const [deletedReview] = reviews.splice(reviewIndex, 1);
      res.status(200).json(deletedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
