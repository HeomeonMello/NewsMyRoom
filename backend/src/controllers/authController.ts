// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// 회원가입 컨트롤러
export const register = async (req: Request, res: Response) => {
  const { username, password, userid, interests } = req.body;

  if (!username || !password || !userid) {
    return res.status(400).json({ message: '모든 필드를 채워주세요.' });
  }

  try {
    // 사용자 존재 여부 확인
    const existingUser = await User.findOne({ $or: [{ email: userid }, { userid }] });
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다.' });
    }

    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 사용자 생성
    const newUser: IUser = new User({
      username,
      email: userid, // userid를 이메일로 간주
      password: hashedPassword,
      userid,
      interests: interests || []
    });

    await newUser.save();

    res.status(201).json({ message: '사용자가 성공적으로 등록되었습니다.' });
  } catch (error) {
    console.error('회원가입 중 서버 오류:', error);
    res.status(500).json({ message: '서버 오류', error });
  }
};

// 로그인 컨트롤러
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '모든 필드를 채워주세요.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호입니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '잘못된 사용자 이름 또는 비밀번호입니다.' });
    }

    const token = jwt.sign(
        { userid: user.userid },
        process.env.JWT_SECRET || 'secret', // 환경 변수 사용
        { expiresIn: '1h' }
    );

    res.status(200).json({ message: '로그인 성공', access_token: token });
  } catch (error) {
    console.error('로그인 중 서버 오류:', error);
    res.status(500).json({ message: '서버 오류', error });
  }
};
