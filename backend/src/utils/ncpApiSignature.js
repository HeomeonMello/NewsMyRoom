// backend/src/utils/ncpApiSignature.js

const crypto = require('crypto');

/**
 * Naver Cloud Platform API 서명을 생성합니다.
 * @param {string} method - HTTP 메서드 (GET, POST 등)
 * @param {string} urlPath - API 엔드포인트 경로 (예: /CloudSearch/real/v1/domain/web/document/search/autocomplete)
 * @param {string} timestamp - 현재 타임스탬프 (밀리초 단위)
 * @param {string} accessKey - NCP Access Key
 * @param {string} secretKey - NCP Secret Key
 * @returns {string} - 생성된 서명
 */
function makeSignature(method, urlPath, timestamp, accessKey, secretKey) {
    const space = ' ';
    const newLine = '\n';
    const message = method + space + urlPath + newLine + timestamp + newLine + accessKey;
    const hash = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
    return hash;
}

module.exports = makeSignature;
