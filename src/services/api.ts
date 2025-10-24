import { ApiResponse, Character } from '../types';

const BASE_URL = 'https://rickandmortyapi.com/api';

export class RickAndMortyAPI {
    static async getCharacters(page: number = 1): Promise<ApiResponse<Character>> {
        const response = await fetch(`${BASE_URL}/character?page=${page}`);
        console.log(`${BASE_URL}/character?page=${page}`);

        // await new Promise((resolve) => setTimeout(resolve, 2000)); // 4 seconds delay to simulate network latency

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    static async getCharacter(id: number): Promise<Character> {
        const response = await fetch(`${BASE_URL}/character/${id}`);
        console.log(`${BASE_URL}/character/${id}`);

        // await new Promise((resolve) => setTimeout(resolve, 2000));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

}
