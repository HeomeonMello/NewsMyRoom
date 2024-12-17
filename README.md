```
newsmyroom/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── src/
│       ├── app.js
│       ├── routes/
│       │   ├── userRoutes.js
│       │   └── trendingRoutes.js
│       ├── controllers/
│       │   ├── userController.js
│       │   └── trendingController.js
│       ├── models/
│       │   └── User.js
│       └── middleware/
│           └── auth.js
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── trends.html
│   ├── css/
│   │   └── stylesheet.css
│   ├── js/
│   │   └── auth.js
│   └── images/
│       ├── network-visual.gif
│       ├── spinningglobe.gif
│       ├── gdelt-events-nasa-night-lights.jpg
│       └── personalization.jpg
└── mongo/
    └── data/

```
사용법 : docker-compose up --build 후
        http://localhost/index 로 진입
