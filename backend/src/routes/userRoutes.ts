// src/routes/userRoutes.ts
import express from 'express';
import { getUserInfo, updateInterests, saveClick } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @route   GET /api/users/userinfo
 * @desc    사용자 정보 조회
 * @access  Private
 */
router.get('/userinfo', authMiddleware, getUserInfo);

/**
 * @route   PUT /api/users/update_interests
 * @desc    사용자 관심사 업데이트
 * @access  Private
 */
router.put(
  '/update_interests',
  authMiddleware,
  [
    body('interests')
      .isArray({ min: 1 })
      .withMessage('관심사는 최소 하나 이상이어야 합니다.')
      .custom((interests: any[]) => interests.every(interest => typeof interest === 'string'))
      .withMessage('모든 관심사는 문자열이어야 합니다.')
  ],
  updateInterests
);

/**
 * @route   POST /api/users/save_click
 * @desc    사용자 클릭 정보 저장
 * @access  Private
 */
router.post(
  '/save_click',
  authMiddleware,
  [
    body('user_id').isString().withMessage('user_id는 문자열이어야 합니다.'),
    body('news_title').isString().withMessage('news_title은 문자열이어야 합니다.'),
    body('news_description').isString().withMessage('news_description은 문자열이어야 합니다.'),
    body('news_url').isURL().withMessage('news_url은 유효한 URL이어야 합니다.'),
    body('publish_time').isISO8601().toDate().withMessage('publish_time은 ISO8601 형식이어야 합니다.')
  ],
  saveClick
);

export default router;
