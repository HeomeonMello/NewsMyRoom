# newsmyroom Project
```
├── backend/                          # 백엔드 애플리케이션 관련 코드와 설정
│   ├── src/                          # 백엔드 애플리케이션의 주요 소스 코드
│   │   ├── controllers/              # 비즈니스 로직을 처리하는 컨트롤러
│   │   ├── models/                   # 데이터베이스 스키마와 모델 정의
│   │   ├── routes/                   # API 라우팅 설정
│   │   ├── middlewares/              # 요청 처리 과정에서 실행되는 미들웨어 함수
│   │   ├── utils/                    # 유틸리티 함수 및 헬퍼 모음
│   │   └── server.ts                 # 애플리케이션 서버 진입점
│   ├── tests/                        # 테스트 파일 (단위 및 통합 테스트)
│   ├── .eslintrc.js                  # ESLint 설정 파일 (코드 스타일 및 품질 검사)
│   ├── .prettierrc                   # Prettier 설정 파일 (코드 포맷팅 규칙)
│   ├── tsconfig.json                 # TypeScript 컴파일러 설정 파일
│   ├── package.json                  # 백엔드 의존성 및 스크립트 관리
│   ├── Dockerfile                    # 백엔드 애플리케이션 컨테이너 이미지를 정의하는 Docker 설정
│   └── README.md                     # 백엔드 관련 설명 및 문서
├── frontend/                         # 프론트엔드 애플리케이션 관련 코드와 설정
│   ├── public/                       # 정적 파일 (HTML, 아이콘 등)
│   ├── src/                          # 프론트엔드 주요 소스 코드
│   │   ├── assets/                   # 이미지, 글꼴 등 정적 리소스
│   │   ├── components/               # 재사용 가능한 React 컴포넌트
│   │   ├── pages/                    # 페이지 단위 React 컴포넌트
│   │   ├── services/                 # API 호출 및 데이터 처리 로직
│   │   ├── store/                    # 상태 관리 (예: Redux, Zustand 등)
│   │   ├── App.tsx                   # React 애플리케이션의 메인 컴포넌트
│   │   ├── main.tsx                  # React 진입점
│   │   └── setupTests.ts             # 테스트 환경 설정 파일
│   ├── .eslintrc.js                  # ESLint 설정 파일 (코드 스타일 및 품질 검사)
│   ├── .prettierrc                   # Prettier 설정 파일 (코드 포맷팅 규칙)
│   ├── tailwind.config.js            # TailwindCSS 설정 파일
│   ├── tsconfig.json                 # TypeScript 컴파일러 설정 파일
│   ├── vite.config.ts                # Vite 번들러 설정 파일
│   ├── package.json                  # 프론트엔드 의존성 및 스크립트 관리
│   ├── Dockerfile                    # 프론트엔드 애플리케이션 컨테이너 이미지를 정의하는 Docker 설정
│   └── README.md                     # 프론트엔드 관련 설명 및 문서
├── mongo/                            # MongoDB 데이터 관련 설정
│   └── data/                         # MongoDB 데이터 영구 저장소 (볼륨 마운트 경로)
├── docker-compose.yml                # Docker Compose 파일로 전체 애플리케이션 서비스 정의
├── .gitignore                        # Git에 포함하지 않을 파일 및 디렉토리 목록
├── README.md                         # 프로젝트에 대한 개요와 문서
└── .github/                          # GitHub 관련 워크플로우 및 설정 파일
└── workflows/
└── ci.yml                    # CI/CD 파이프라인 정의 파일 (예: 테스트, 빌드, 배포)
```