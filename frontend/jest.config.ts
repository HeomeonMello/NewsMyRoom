export default {
  roots: ['<rootDir>/src'],
  testEnvironment: 'jest-environment-jsdom', // jsdom 설정
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // TypeScript 및 JSX 변환
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // 스타일 파일 무시
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // 추가 Jest 설정
};
