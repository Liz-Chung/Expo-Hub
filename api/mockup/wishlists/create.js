import { wishlists } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { user_id, exhibition_id } = req.body;
    const wishlist_id = wishlists.length + 1;
    const newWishlistItem = {
      wishlist_id,
      user_id,
      exhibition_id,
      created_at: new Date().toISOString()
    };
    wishlists.push(newWishlistItem);
    res.status(201).json(newWishlistItem);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
