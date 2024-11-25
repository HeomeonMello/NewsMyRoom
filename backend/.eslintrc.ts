module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    rules: {
        'prettier/prettier': 'error',
        // 추가 규칙을 원하시면 여기에 작성하세요
    }
};

