// 성공 응답
exports.success = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// 에러 응답
exports.error = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
};
