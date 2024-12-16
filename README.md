```
newsmyroom/
├── backend/                          # 백엔드 애플리케이션 관련 코드와 설정
|
│
├── frontend/                         # 프론트엔드 애플리케이션 관련 코드와 설정
│   ├── index.html                    # 메인 HTML 파일
│   ├── login.html                    # login 페이지
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
│   │   └── ...
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