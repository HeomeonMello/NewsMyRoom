// src/controllers/recommendationController.ts

import { Request, Response } from 'express';
import { recommendArticles } from '../utils/recommend';
import Click from '../models/Click';
import Article from '../models/Article';
import { UserData } from '../types/UserData';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * @desc    사용자에게 추천 기사 가져오기
 * @route   GET /api/recommendations
 * @access  Private
 */
export const getRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 사용자 관심사 가져오기
    const interests: string[] = user.interests;

    // 사용자가 클릭한 기사 가져오기
    const clicksData = await Click.find({ user_id: user.userid }).select('news_title news_description news_url publish_time -_id');

    // 모든 기사 가져오기
    const allArticlesData = await Article.find({}).select('title link image_url summary -_id');

    // 사용자 데이터 구성
    const userData: UserData = {
      interests,
      clicks: clicksData.map(click => ({
        title: click.news_title,              // Click 모델의 필드 이름에 맞게 수정
        description: click.news_description,  // Click 모델의 필드 이름에 맞게 수정
        url: click.news_url,                  // Click 모델의 필드 이름에 맞게 수정
        publish_time: click.publish_time.toISOString() // Date 객체를 문자열로 변환
      })),
      all_articles: allArticlesData.map(article => ({
        title: article.title,
        link: article.link,
        image_url: article.image_url,
        summary: article.summary
      }))
    };

    // 추천 알고리즘 실행
    const recommendations = await recommendArticles(userData, `${req.protocol}://${req.get('host')}/`);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("추천 가져오기 실패:", error);
    res.status(500).json({ message: '추천 가져오기 실패', error });
  }
};
