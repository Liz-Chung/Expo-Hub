import { wishlists } from '../data';
import cors, { runMiddleware } from '../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  res.status(200).json(wishlists);
}
