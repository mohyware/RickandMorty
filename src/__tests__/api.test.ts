import { RickAndMortyAPI } from '../services/api';

// Mock fetch
global.fetch = jest.fn();

describe('RickAndMortyAPI', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    describe('getCharacters', () => {
        it('should fetch characters with default parameters', async () => {
            const mockResponse = {
                info: {
                    count: 826,
                    pages: 42,
                    next: 'https://rickandmortyapi.com/api/character?page=2',
                    prev: null,
                },
                results: [
                    {
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
                        episode: ['https://rickandmortyapi.com/api/episode/1'],
                        url: 'https://rickandmortyapi.com/api/character/1',
                        created: '2017-11-04T18:48:46.250Z',
                    },
                ],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await RickAndMortyAPI.getCharacters();

            expect(fetch).toHaveBeenCalledWith(
                'https://rickandmortyapi.com/api/character?page=1'
            );
            expect(result).toEqual(mockResponse);
        });

        it('should fetch characters with custom page number', async () => {
            const mockResponse = {
                info: { count: 1, pages: 1, next: null, prev: null },
                results: [],
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            await RickAndMortyAPI.getCharacters(3);

            expect(fetch).toHaveBeenCalledWith(
                'https://rickandmortyapi.com/api/character?page=3'
            );
        });

        it('should throw error when API request fails', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            await expect(RickAndMortyAPI.getCharacters()).rejects.toThrow(
                'HTTP error! status: 404'
            );
        });

        it('should handle network errors', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            await expect(RickAndMortyAPI.getCharacters()).rejects.toThrow(
                'Network error'
            );
        });
    });

    describe('getCharacter', () => {
        it('should fetch a single character by ID', async () => {
            const mockCharacter = {
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
                episode: ['https://rickandmortyapi.com/api/episode/1'],
                url: 'https://rickandmortyapi.com/api/character/1',
                created: '2017-11-04T18:48:46.250Z',
            };

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCharacter,
            });

            const result = await RickAndMortyAPI.getCharacter(1);

            expect(fetch).toHaveBeenCalledWith(
                'https://rickandmortyapi.com/api/character/1'
            );
            expect(result).toEqual(mockCharacter);
        });

        it('should throw error when character not found', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 404,
            });

            await expect(RickAndMortyAPI.getCharacter(999)).rejects.toThrow(
                'HTTP error! status: 404'
            );
        });

        it('should handle server errors', async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            await expect(RickAndMortyAPI.getCharacter(1)).rejects.toThrow(
                'HTTP error! status: 500'
            );
        });
    });
});
