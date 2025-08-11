import jwt from 'jsonwebtoken';
export default async function createToken(payload: {
  id: string;
  rule: 'user' | 'admin';
}) {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
