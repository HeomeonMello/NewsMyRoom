const makeSignature = require('./ncpApiSignature'); // 경로를 실제 위치에 맞게 수정하세요.

const method = 'GET';
const urlPath = '/CloudSearch/real/v1/domain/web/document/search/autocomplete';
const timestamp = Date.now().toString();
const accessKey = 'ncp_iam_BPAMKR3Ae05ULn773Xal'; // 실제 Access Key로 교체하세요
const secretKey = 'ncp_iam_BPKMKRG4G8LzXsjvMOpKJZ8G6MzkHbklew'; // 실제 Secret Key로 교체하세요

const signature = makeSignature(method, urlPath, timestamp, accessKey, secretKey);

console.log('Generated Signature:', signature);
console.log('Generated Signature:', timestamp);
// 생성된 서명을 사용하여 실제 API 요청을 Postman 또는 cURL로 테스트해보세요.
