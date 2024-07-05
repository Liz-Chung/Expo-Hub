import { categories } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const category = categories.find(cat => cat.category_id === parseInt(id));
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
