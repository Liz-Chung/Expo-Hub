import { wishlists } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'DELETE') {
    const wishlistIndex = wishlists.findIndex(item => item.wishlist_id === parseInt(id));
    if (wishlistIndex > -1) {
      const [deletedWishlist] = wishlists.splice(wishlistIndex, 1);
      res.status(200).json(deletedWishlist);
    } else {
      res.status(404).json({ message: 'Wishlist item not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
