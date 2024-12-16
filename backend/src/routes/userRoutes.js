const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 회원가입 POST 요청 처리: /api/register
router.post('/register', userController.registerUser);

// 로그인 POST 요청 처리: /api/login
router.post('/login', userController.loginUser);

module.exports = router;
