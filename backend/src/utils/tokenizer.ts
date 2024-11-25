// src/utils/tokenizer.ts

import fs from 'fs';
import path from 'path';

interface Tokenizer {
  wordIndex: { [key: string]: number };
  textsToSequences: (texts: string[]) => number[][];
}

export const loadTokenizer = (): Tokenizer => {
  const tokenizerPath = path.join(__dirname, 'tokenizer.json');
  if (!fs.existsSync(tokenizerPath)) {
    throw new Error('Tokenizer 파일을 찾을 수 없습니다.');
  }

  const rawData = fs.readFileSync(tokenizerPath, 'utf-8');
  const wordIndex = JSON.parse(rawData);

  const textsToSequences = (texts: string[]): number[][] => {
    return texts.map(text =>
      text
        .split(' ')
        .map(word => (wordIndex[word] ? wordIndex[word] : 0))
    );
  };

  return { wordIndex, textsToSequences };
};
