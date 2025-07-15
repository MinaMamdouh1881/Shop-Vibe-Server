import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.token?.toString().split(' ')[1];
    if (!token) {
      res.status(404).json({ error: 'Auth' });
      return;
    }
    const data = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = data;
    next();
  } catch (error) {
    throw error;
  }
}
