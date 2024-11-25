// src/controllers/userController.ts
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import Click from '../models/Click';

interface AuthRequest extends Request {
  user?: any;
}

export const getUserInfo = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  res.status(200).json({
    username: req.user.username,
    email: req.user.email,
    interests: req.user.interests
  });
};

export const updateInterests = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  const { interests } = req.body;

  try {
    req.user.interests = interests;
    await req.user.save();

    res.status(200).json({ message: '관심사가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '관심사 업데이트 실패', error });
  }
};

export const saveClick = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.user) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }

  const { user_id, news_title, news_description, news_url, publish_time } = req.body;

  if (req.user.userid !== user_id) {
    return res.status(401).json({ message: '권한이 없습니다.' });
  }

  try {
    const newClick = new Click({
      user_id,
      news_title,
      news_description,
      news_url,
      publish_time
    });

    await newClick.save();

    res.status(200).json({ message: '클릭이 성공적으로 저장되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '클릭 저장 실패', error });
  }
};
