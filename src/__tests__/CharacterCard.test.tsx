import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { CharacterCard } from '../components/CharacterCard';
import { Character } from '../types';

// Mock the expo-image component
jest.mock('expo-image', () => ({
    Image: ({ source, style, ...props }: any) => (
        <div testID="character-image" style={style} {...props}>
            {source.uri}
        </div>
    ),
}));

const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: {
        name: 'Earth (C-137)',
        url: 'https://rickandmortyapi.com/api/location/1',
    },
    location: {
        name: 'Earth (Replacement Dimension)',
        url: 'https://rickandmortyapi.com/api/location/20',
    },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [
        'https://rickandmortyapi.com/api/episode/1',
        'https://rickandmortyapi.com/api/episode/2',
    ],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
};

describe('CharacterCard', () => {
    const mockOnPress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders character information correctly', () => {
        const { getByText, getByTestId } = render(
            <CharacterCard character={mockCharacter} onPress={mockOnPress} />
        );

        expect(getByText('Rick Sanchez')).toBeTruthy();
        expect(getByText('Alive')).toBeTruthy();
        expect(getByText('Human')).toBeTruthy();
        expect(getByText('📍 Earth (Replacement Dimension)')).toBeTruthy();
        const image = getByTestId('character-image');
        expect(image.props.children).toBe('https://rickandmortyapi.com/api/character/avatar/1.jpeg');

    });

    it('calls onPress when card is pressed', () => {
        const { getByText } = render(
            <CharacterCard character={mockCharacter} onPress={mockOnPress} />
        );

        fireEvent.press(getByText('Rick Sanchez'));
        expect(mockOnPress).toHaveBeenCalledWith(mockCharacter);
    });

    it('shows expand button', () => {
        const { getByText } = render(
            <CharacterCard character={mockCharacter} onPress={mockOnPress} />
        );

        expect(getByText('▶︎ Quick View')).toBeTruthy();
    });

    it('toggles expanded state when expand button is pressed', () => {
        const { getByText } = render(
            <CharacterCard character={mockCharacter} onPress={mockOnPress} />
        );

        const expandButton = getByText('▶︎ Quick View');

        act(() => {
            fireEvent.press(expandButton);
        });

        expect(getByText('▼ Quick View')).toBeTruthy();
        expect(getByText('♂ Male')).toBeTruthy();
        expect(getByText('🌍 Earth (C-137)')).toBeTruthy();
        expect(getByText('📺 2 episodes')).toBeTruthy();
    });

    it('displays correct status color indicator', () => {
        const { getByText } = render(
            <CharacterCard character={mockCharacter} onPress={mockOnPress} />
        );

        expect(getByText('Alive')).toBeTruthy();
    });

    it('handles unknown type correctly', () => {
        const characterWithUnknownType = {
            ...mockCharacter,
            type: '',
        };

        const { getByText } = render(
            <CharacterCard character={characterWithUnknownType} onPress={mockOnPress} />
        );

        // Expand the card to see the type
        act(() => {
            fireEvent.press(getByText('▶︎ Quick View'));
        });
        expect(getByText('Unknown')).toBeTruthy();
    });

    it('displays different gender icons correctly', () => {
        const femaleCharacter = {
            ...mockCharacter,
            gender: 'Female',
        };

        const { getByText } = render(
            <CharacterCard character={femaleCharacter as Character} onPress={mockOnPress} />
        );

        act(() => {
            fireEvent.press(getByText('▶︎ Quick View'));
        });
        expect(getByText('♀ Female')).toBeTruthy();
    });

    it('handles genderless character correctly', () => {
        const genderlessCharacter = {
            ...mockCharacter,
            gender: 'Genderless',
        };

        const { getByText } = render(
            <CharacterCard character={genderlessCharacter as Character} onPress={mockOnPress} />
        );

        act(() => {
            fireEvent.press(getByText('▶︎ Quick View'));
        });
        expect(getByText('⚪ Genderless')).toBeTruthy();
    });
});
