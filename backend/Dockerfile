# backend/Dockerfile

# Node.js 공식 이미지 사용 (LTS 버전 권장)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 프로덕션 의존성만 설치
RUN npm install --only=production

# 포트 설정
EXPOSE 5000

# 애플리케이션 실행
CMD ["node", "dist/app.js"]
