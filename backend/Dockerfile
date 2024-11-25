# 베이스 이미지 선택
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 프로덕션 단계
FROM node:20-alpine

WORKDIR /app

# 빌드된 파일 복사
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# 의존성 설치 (프로덕션용)
RUN npm install --only=production

# 환경 변수 설정
ENV NODE_ENV=production

# 포트 노출
EXPOSE 5000

# 애플리케이션 실행
CMD ["node", "dist/server.js"]
