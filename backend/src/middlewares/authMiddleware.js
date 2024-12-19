// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT 토큰을 검증하고 사용자 정보를 요청 객체에 추가하는 미들웨어
 */
const protect = async (req, res, next) => {
    let token;

    // Authorization 헤더에서 토큰 추출
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: '인증되지 않았습니다. 토큰 검증에 실패했습니다.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: '인증되지 않았습니다. 토큰이 제공되지 않았습니다.' });
    }
};

module.exports = { protect };
