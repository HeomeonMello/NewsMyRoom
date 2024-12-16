# frontend/Dockerfile

# Stage 1: Serve 단계
FROM nginx:alpine

# 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기존 Nginx 기본 파일 제거
RUN rm -rf ./*

# 호스트의 frontend 디렉토리의 모든 파일을 컨테이너의 작업 디렉토리로 복사
COPY . .

# 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
