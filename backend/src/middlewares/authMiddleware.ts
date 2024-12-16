// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // 인증 로직을 여기에 구현하세요.
  const token = req.headers.authorization;

  if (token) {
    // 토큰 검증 로직
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
