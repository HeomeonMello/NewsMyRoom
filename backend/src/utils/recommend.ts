// src/utils/recommend.ts

import type { UserData, Click, Article } from '../types/UserData';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';
import { loadTokenizer } from './tokenizer';

// 추천 모델 경로
const MODEL_PATH = path.join(__dirname, '../model/model.json');
let model: tf.LayersModel | null = null;

// 추천 모델 로드 함수
export const loadModel = async () => {
  if (!model) {
    if (fs.existsSync(MODEL_PATH)) {
      model = await tf.loadLayersModel(`file://${MODEL_PATH}`);
      console.log('추천 모델이 성공적으로 로드되었습니다.');
    } else {
      console.error('추천 모델 파일을 찾을 수 없습니다.');
    }
  }
  return model;
};

// 데이터 전처리 함수
const preprocessData = (
  userInterests: string[],
  userClicks: Click[],
  allArticles: Article[],
  tokenizer: { wordIndex: { [key: string]: number }; textsToSequences: (texts: string[]) => number[][] },
  maxLen: number
) => {
  const userInterestsText = userInterests.slice(0, 3).join(' ');
  const userClicksText = userClicks.map(click => click.title).join(' ');
  const userProfile = `${userInterestsText} ${userClicksText}`;

  const articlesTexts = allArticles.map(article => article.title);

  const userSequences = tokenizer.textsToSequences([userProfile]);
  const articleSequences = tokenizer.textsToSequences(articlesTexts);
  const interestSequences = tokenizer.textsToSequences(userInterests.slice(0, 3));

  const vocabSize = Math.min(35000, Object.keys(tokenizer.wordIndex).length + 1);

  const pad = (sequences: number[][]) => {
    return tf.tensor2d(sequences.map(seq => {
      if (seq.length > maxLen) {
        return seq.slice(seq.length - maxLen);
      } else {
        const padded = Array(maxLen - seq.length).fill(0);
        return [...padded, ...seq];
      }
    }));
  };

  const userPadded = pad(userSequences);
  const articlePadded = pad(articleSequences);
  const interestPadded = pad(interestSequences);

  return { userPadded, articlePadded, interestPadded, vocabSize };
};

// 추천 알고리즘 함수
export const recommendArticles = async (
  userData: UserData,
  serverUrl: string
) => {
  const { interests, clicks, all_articles } = userData;

  // 토크나이저 로드
  const tokenizer = loadTokenizer();

  const maxLen = 100;

  const { userPadded, articlePadded, interestPadded, vocabSize } = preprocessData(
    interests,
    clicks,
    all_articles,
    tokenizer,
    maxLen
  );

  // 모델 로드
  const loadedModel = await loadModel();
  if (!loadedModel) {
    console.error('추천 모델을 로드할 수 없습니다.');
    return [];
  }

  // 예측
  const predictions = loadedModel.predict([userPadded, articlePadded, interestPadded]) as tf.Tensor;
  const scores = predictions.dataSync();

  // 기사와 점수 매핑
  const scoredArticles = all_articles.map((article, idx) => ({
    ...article,
    score: scores[idx]
  }));

  // 점수 기준 정렬 및 상위 5개 추천
  scoredArticles.sort((a, b) => b.score - a.score);
  const recommended = scoredArticles.slice(0, 5);

  return recommended;
};
