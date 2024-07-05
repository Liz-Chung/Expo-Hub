import { users } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'DELETE') {
    const userIndex = users.findIndex(user => user.user_id === parseInt(id));
    if (userIndex > -1) {
      const [deletedUser] = users.splice(userIndex, 1);
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
