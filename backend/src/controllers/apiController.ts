// src/controllers/apiController.ts
import { Request, Response } from 'express';
import { getNewsSearchResult, getBreakingHeadlines, getTrendingKeywords } from '../utils/api';
import Article from "../models/Article";

export const scrapeAndStore = async (req: Request, res: Response) => {
  try {
    const sections = [
      'politics',
      'economy',
      'society',
      'life',
      'car',
      'it',
      'world',
      'health',
      'travel',
      'food',
      'fashion',
      'exhibition',
      'book',
      'religion',
      'entertainment'
    ];

    for (const section of sections) {
      const headlines = await getNewsSearchResult(section);
      if (headlines) {
        for (const headline of headlines) {
          try {
            await insertArticle(headline);
          } catch (error) {
            console.error(`기사 삽입 오류 (${headline.title}):`, error);
          }
        }
      }
    }

    res.status(200).json({ message: '뉴스 기사 스크래핑 및 저장 성공' });
  } catch (error) {
    console.error("뉴스 스크래핑 실패:", error);
    res.status(500).json({ message: '뉴스 기사 스크래핑 실패', error });
  }
};

const insertArticle = async (headline: any) => {
  try {
    const existing = await Article.findOne({ link: headline.link });
    if (!existing) {
      const newArticle = new Article(headline);
      await newArticle.save();
    }
  } catch (error) {
    console.error("기사 삽입 오류:", error);
  }
};

export const fetchBreakingHeadlines = async (req: Request, res: Response) => {
  try {
    const headlines = await getBreakingHeadlines();
    res.status(200).json(headlines);
  } catch (error) {
    console.error("Breaking headlines 가져오기 실패:", error);
    res.status(500).json({ message: 'Breaking headlines 가져오기 실패', error });
  }
};

export const fetchTrendingKeywords = async (req: Request, res: Response) => {
  try {
    const { keywords, popularity } = await getTrendingKeywords();
    res.status(200).json({ keywords, popularity });
  } catch (error) {
    console.error("Trending keywords 가져오기 실패:", error);
    res.status(500).json({ message: 'Trending keywords 가져오기 실패', error });
  }
};
