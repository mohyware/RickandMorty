import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/animations/TimingAnimation');

jest.mock('react-native-reanimated', () => ({
    default: {
        call: () => { },
    },
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
    }),
    useLocalSearchParams: () => ({ id: '1' }),
}));

jest.mock('react-redux', () => ({
    useDispatch: () => jest.fn(),
    useSelector: jest.fn(),
    Provider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@shopify/flash-list', () => ({
    FlashList: 'FlatList',
}));

jest.mock('expo-image', () => ({
    Image: 'Image',
}));

// Dummy test to get rid of "Your test suite must contain at least one test." error
test('setup file', () => {
    expect(true).toBe(true);
});


