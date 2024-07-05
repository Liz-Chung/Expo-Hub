import { themes } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'GET') {
    const theme = themes.find(thm => thm.theme_id === parseInt(id));
    if (theme) {
      res.status(200).json(theme);
    } else {
      res.status(404).json({ message: 'Theme not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
