```
newsmyroom/
├── backend/                          # 백엔드 애플리케이션 관련 코드와 설정
│   ├── Dockerfile                    # 백엔드 컨테이너 빌드를 위한 Dockerfile
│   ├── package.json                  # 백엔드 프로젝트 의존성 및 스크립트
│   ├── package-lock.json             # 의존성 고정 파일
│   ├── src/                           # 백엔드 소스 코드
│   │   ├── app.js                     # 애플리케이션 진입점 (Express 서버 설정)
│   │   ├── config/                    # 환경설정 파일
│   │   │   ├── default.json           # 기본 설정
│   │   │   └── production.json        # 프로덕션 설정
│   │   ├── controllers/               # 비즈니스 로직을 처리하는 컨트롤러
│   │   │   ├── newsController.js      # 뉴스 관련 컨트롤러
│   │   │   ├── userController.js      # 사용자 관련 컨트롤러
│   │   │   └── ...                     # 기타 컨트롤러
│   │   ├── models/                    # 데이터 모델 (MongoDB 스키마)
│   │   │   ├── User.js                 # 사용자 모델
│   │   │   ├── Article.js              # 기사 모델
│   │   │   └── ...                     # 기타 모델
│   │   ├── routes/                    # API 라우트 정의
│   │   │   ├── index.js                # 기본 라우트
│   │   │   ├── newsRoutes.js           # 뉴스 관련 라우트
│   │   │   ├── userRoutes.js           # 사용자 관련 라우트
│   │   │   └── ...                     # 기타 라우트
│   │   ├── services/                  # 외부 API 연동 및 비즈니스 로직
│   │   │   ├── gdeltService.js         # GDELT API 연동 로직
│   │   │   ├── naverService.js         # 네이버 API 연동 로직
│   │   │   └── ...                     # 기타 서비스
│   │   ├── views/                     # 서버사이드 렌더링을 사용할 경우 템플릿 파일 (ejs 등)
│   │   ├── utils/                     # 유틸리티 함수
│   │   │   ├── logger.js               # 로깅 유틸리티
│   │   │   ├── responseHandler.js      # 응답 처리 유틸리티
│   │   │   └── ...                     # 기타 유틸리티
│   │   └── tests/                     # 백엔드 유닛테스트 및 통합테스트
│   │       ├── controllers/            # 컨트롤러 테스트
│   │       ├── models/                 # 모델 테스트
│   │       ├── routes/                 # 라우트 테스트
│   │       └── services/               # 서비스 테스트
│   └── .env                           # 환경 변수 설정 파일 (로컬 개발용)
│
├── frontend/                         # 프론트엔드 애플리케이션 관련 코드와 설정
│   ├── index.html                    # 메인 HTML 파일
│   ├── about.html                    # About 페이지
│   ├── trends.html                   # Trending 페이지
│   ├── search.html                   # Search 페이지
│   ├── preferences.html              # Preferences 페이지
│   ├── register.html                 # 회원가입 페이지
│   │
│   ├── css/                           # 스타일시트 파일들
│   │   ├── stylesheet.css            # 메인 스타일시트
│   │   ├── font-awesome-4.7.0/       # Font Awesome 폰트 및 스타일
│   │   │   ├── css/
│   │   │   │   └── font-awesome.min.css
│   │   │   └── fonts/                 # Font Awesome 폰트 파일들
│   │   └── googlefonts-audiowide/     # Google Fonts (Audiowide) 스타일
│   │       └── googlefont-audiowide.css
│   │
│   ├── js/                            # JavaScript 파일들
│   │   ├── jquery.js                 # jQuery 라이브러리
│   │   └── bootstrap.js              # Bootstrap 관련 JS
│   │
│   ├── images/                        # 이미지 파일들
│   │   ├── network-visual.jpg
│   │   ├── spinningglobe.gif
│   │   └── gdelt-events-nasa-night-lights.jpg
│   │
│   └── favicon.ico                    # 파비콘
│
├── mongo/                            # MongoDB 데이터 관련 설정
│   └── data/                         # MongoDB 데이터 영구 저장소 (볼륨 마운트 경로)
│
├── docker-compose.yml                # Docker Compose 파일로 전체 애플리케이션 서비스 정의
├── .gitignore                        # Git에 포함하지 않을 파일 및 디렉토리 목록
├── README.md                         # 프로젝트에 대한 개요와 문서
└── .github/                          # GitHub 관련 워크플로우 및 설정 파일
└── workflows/
└── ci.yml                    # CI/CD 파이프라인 정의 파일 (예: 테스트, 빌드, 배포)
```