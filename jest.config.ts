export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
};




