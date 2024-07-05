import { users } from '../../data';
import cors, { runMiddleware } from '../../corsMiddleware';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  const { id } = req.query;
  if (req.method === 'PUT') {
    const user = users.find(user => user.user_id === parseInt(id));
    if (user) {
      const { name, email, password, last_login } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = password || user.password;
      user.updated_at = new Date().toISOString();
      user.last_login = last_login || user.last_login;
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
