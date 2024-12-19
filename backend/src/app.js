// backend/src/app.js

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// 라우트 파일
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const searchRoutes = require('./routes/searchRoutes'); // 기존 검색 라우트
const gdeltRoutes = require('./routes/gdeltRoutes');   // GDELT 라우트
const autocompleteRoutes = require('./routes/autocompleteRoutes'); // 자동완성 라우트

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost', // 프론트엔드 도메인으로 변경 가능
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// MongoDB 연결
console.log('MONGODB_URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Body Parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 라우트 연결
app.use('/api/auth', authRoutes); // 인증 관련 라우트
app.use('/api/news', newsRoutes); // 뉴스 기사 관련 라우트
app.use('/api/search', searchRoutes);   // 기존 검색 라우트
app.use('/api/gdelt', gdeltRoutes);     // GDELT 라우트
app.use('/api/autocomplete', autocompleteRoutes); // 자동완성 라우트

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
