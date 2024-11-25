// src/types/UserData.ts

export interface Click {
  title: string;
  description: string;
  url: string;
  publish_time: string; // 문자열로 정의
}

export interface Article {
  title: string;
  link: string;
  image_url: string;
  summary: string;
}

export interface UserData {
  interests: string[];
  clicks: Click[];
  all_articles: Article[];
}
