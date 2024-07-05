import { wishlists } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'PUT') {
    const wishlist = wishlists.find(item => item.wishlist_id === parseInt(id));
    if (wishlist) {
      const { user_id, exhibition_id } = req.body;
      wishlist.user_id = user_id || wishlist.user_id;
      wishlist.exhibition_id = exhibition_id || wishlist.exhibition_id;
      wishlist.updated_at = new Date().toISOString();
      res.status(200).json(wishlist);
    } else {
      res.status(404).json({ message: 'Wishlist item not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
