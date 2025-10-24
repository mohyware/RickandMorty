module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/__tests__/**',
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    testEnvironment: 'jsdom',
};
