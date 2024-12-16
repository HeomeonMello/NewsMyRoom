const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password, confirm_password } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // 회원가입 성공 시 로그인 페이지로 리다이렉트
        res.redirect('/login.html');
    } catch (error) {
        next(error);
    }
};
// 백엔드 로그인 컨트롤러 수정
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // HTTP-only 쿠키에 토큰 설정
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS 사용 시에만 설정
            sameSite: 'Strict', // CSRF 보호 강화
            maxAge: 3600000, // 1시간
        });

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        next(error);
    }
};