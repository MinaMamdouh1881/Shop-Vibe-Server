import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

export type TokenPayload = {
  id: string;
  email: string;
  rule: 'user' | 'admin';
};

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.toString().split(' ')[1];
    if (!token) {
      res.status(404).json({ error: 'Auth' });
      return;
    }

    const data = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    req.user = data;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
