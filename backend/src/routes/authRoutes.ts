// src/routes/authRoutes.ts
import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// 회원가입 라우트
router.post('/register', register);

// 로그인 라우트
router.post('/login', login);

export default router;
