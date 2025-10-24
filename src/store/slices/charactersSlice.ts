import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RickAndMortyAPI } from '../../services/api';
import { Character } from '../../types';

interface CharactersState {
    data: Character[];
    loading: boolean;
    error: string | null;
    hasNextPage: boolean;
    currentPage: number;
    selectedCharacter: Character | null;
}

const initialState: CharactersState = {
    data: [],
    loading: false,
    error: null,
    hasNextPage: true,
    currentPage: 1,
    selectedCharacter: null,
};

export const fetchCharacters = createAsyncThunk(
    'characters/fetchCharacters',
    async ({ page }: { page: number }) => {
        const response = await RickAndMortyAPI.getCharacters(page);
        return { response, page };
    }
);

export const fetchCharacterById = createAsyncThunk(
    'characters/fetchCharacterById',
    async (id: number) => {
        return await RickAndMortyAPI.getCharacter(id);
    }
);


const charactersSlice = createSlice({
    name: 'characters',
    initialState,
    reducers: {
        setSelectedCharacter: (state, action: PayloadAction<Character | null>) => {
            state.selectedCharacter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetCharacters: (state) => {
            state.data = [];
            state.currentPage = 1;
            state.hasNextPage = true;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch characters
            .addCase(fetchCharacters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.loading = false;
                const { response, page } = action.payload;

                if (page === 1) {
                    state.data = response.results;
                } else {
                    state.data = [...state.data, ...response.results];
                }

                state.currentPage = page;
                state.hasNextPage = !!response.info.next;
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch characters';
            })
            // Fetch character by ID
            .addCase(fetchCharacterById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCharacterById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedCharacter = action.payload;
            })
            .addCase(fetchCharacterById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch character';
            })
    },
});

export const { setSelectedCharacter, clearError, resetCharacters } = charactersSlice.actions;
export default charactersSlice.reducer;
