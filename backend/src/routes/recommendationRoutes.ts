// src/routes/recommendationRoutes.ts

import express from 'express';
import { getRecommendations } from '../controllers/recommendationController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   GET /api/recommendations
 * @desc    사용자에게 추천 기사 가져오기
 * @access  Private
 */
router.get('/', authMiddleware, getRecommendations);

export default router;
