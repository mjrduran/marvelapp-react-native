import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Character} from '../../model/Character';
import {
  getCharacters,
  getCharactersByName,
  getCharacterById,
} from '../services/charactersService';
import {
  queryFavoritesAsync,
  persistFavorites,
  queryFavoritesSync,
} from '../services/favoritesService';

export type SearchType = 'all' | 'byName' | 'favorites';
export type LoadingState = 'idle' | 'loading' | 'finished';
export interface SearchParams {
  limit: number;
  offset: number;
}

export interface FavoriteParams {
  id: number;
  limit: number;
  offset: number;
  name: string;
  searchType: SearchType;
}

interface MyState {
  characters: Array<Character>;
  loading: LoadingState;
  searchType: SearchType;
  error?: string;
}

const initialState = {
  characters: [],
  loading: 'idle',
  searchType: 'all',
} as MyState;

export const fetchCharacters = createAsyncThunk(
  'characters/fetchAll',
  async (params: SearchParams, {rejectWithValue}) => {
    try {
      const response = await getCharacters(params.limit, params.offset);
      return response;
    } catch (error) {
      return rejectWithValue([]);
    }
  },
);

export const fetchCharactersByName = createAsyncThunk(
  'characters/fetchByName',
  async (name: string, {rejectWithValue}) => {
    try {
      const response = await getCharactersByName(name);
      return response;
    } catch (error) {
      return rejectWithValue([]);
    }
  },
);

export const fetchFavorites = createAsyncThunk(
  'characters/fetchFavorites',
  async (_, {rejectWithValue}) => {
    try {
      let favorites = await queryFavoritesAsync();
      if (!favorites) {
        favorites = [];
      }
      const result = favorites.map(async item => {
        const found = await getCharacterById(item);
        return found;
      });
      const characters = await Promise.all(result);
      characters.forEach(item => {
        item.isFavorite = true;
      });
      return characters;
    } catch (error) {
      return rejectWithValue([]);
    }
  },
);
async function findFavorites(): Promise<Array<Character>> {
  try {
    let favorites = await queryFavoritesAsync();
    if (!favorites) {
      favorites = [];
    }
    const result = favorites.map(async item => {
      const found = await getCharacterById(item);
      return found;
    });
    const characters = await Promise.all(result);
    characters.forEach(item => {
      item.isFavorite = true;
    });
    return characters;
  } catch (error) {
    return [];
  }
}

export const saveFavorite = createAsyncThunk(
  'favorite/save',
  async (params: FavoriteParams, {rejectWithValue}) => {
    try {
      let favorites = await queryFavoritesAsync();
      if (!favorites) {
        favorites = [];
      }
      if (favorites.findIndex(item => item === params.id) === -1) {
        favorites.push(params.id);
      }
      console.log('Will persist' + JSON.stringify(favorites));
      await persistFavorites(favorites);

      let characters = [];
      if (params.searchType === 'byName') {
        characters = await getCharactersByName(params.name);
      } else if (params.searchType === 'favorites') {
        characters = await findFavorites();
      } else {
        characters = await getCharacters(params.limit, params.offset);
      }
      markFavorites(characters, favorites);
      return characters;
    } catch (error) {
      return rejectWithValue([]);
    }
  },
);

export const removeFavorite = createAsyncThunk(
  'favorite/remove',
  async (params: FavoriteParams, {rejectWithValue}) => {
    try {
      let favorites = await queryFavoritesAsync();
      if (favorites === undefined || favorites === null) {
        favorites = [];
      }
      const index = favorites.indexOf(params.id);
      if (index > -1) {
        favorites.splice(index, 1);
      }
      console.log('Will persist' + JSON.stringify(favorites));
      await persistFavorites(favorites);
      let characters = [];
      if (params.searchType === 'byName') {
        characters = await getCharactersByName(params.name);
      } else if (params.searchType === 'favorites') {
        characters = await findFavorites();
      } else {
        characters = await getCharacters(params.limit, params.offset);
      }
      markFavorites(characters, favorites);
      return characters;
    } catch (error) {
      return rejectWithValue([]);
    }
  },
);

function mergeArrays(
  array1: Array<Character>,
  array2: Array<Character>,
): Array<Character> {
  let result = [...array1];
  const array1ids = array1.map(item => {
    return item.id;
  });
  array2.forEach(item => {
    if (
      array1ids.findIndex(id => {
        id === item.id;
      }) === -1
    ) {
      result.push(item);
    }
  });
  return result;
}

function isFavorite(id: number, favorites: Array<number>): boolean {
  if (favorites !== null && favorites !== undefined) {
    return favorites.findIndex(item => item === id) !== -1;
  }
  return false;
}

function markFavorites(
  characters: Array<Character>,
  favorites: Array<number>,
): void {
  characters.forEach(item => {
    if (isFavorite(item.id, favorites)) {
      item.isFavorite = true;
    }
  });
}

const charactersSlice = createSlice({
  name: 'characters',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchCharacters.fulfilled, (state, {payload}) => {
      if (state.searchType === 'byName') {
        state.characters = payload;
      } else {
        const mergedArrays = mergeArrays(state.characters, payload);
        state.characters = mergedArrays;
      }
      let favorites = queryFavoritesSync();
      markFavorites(state.characters, favorites);
      state.searchType = 'all';
      state.loading = 'finished';
    });
    builder.addCase(fetchCharacters.pending, (state, _) => {
      state.loading = 'loading';
    });
    builder.addCase(fetchCharacters.rejected, (state, _) => {
      state.error =
        'Ops, parece que ocorreu um erro. Tente novamente mais tarde.';
      state.loading = 'finished';
    });

    builder.addCase(fetchCharactersByName.fulfilled, (state, {payload}) => {
      state.characters = payload;
      let favorites = queryFavoritesSync();
      markFavorites(state.characters, favorites);
      state.searchType = 'byName';
      state.loading = 'finished';
    });
    builder.addCase(fetchCharactersByName.pending, (state, _) => {
      state.loading = 'loading';
    });
    builder.addCase(fetchCharactersByName.rejected, (state, _) => {
      state.error =
        'Ops, parece que ocorreu um erro. Tente novamente mais tarde.';
      state.loading = 'finished';
    });

    builder.addCase(saveFavorite.fulfilled, (state, {payload}) => {
      state.characters = payload;
      state.loading = 'finished';
    });
    builder.addCase(saveFavorite.pending, (state, _) => {
      state.loading = 'loading';
    });
    builder.addCase(saveFavorite.rejected, (state, _) => {
      state.error =
        'Ops, parece que ocorreu um erro. Tente novamente mais tarde.';
      state.loading = 'finished';
    });

    builder.addCase(removeFavorite.fulfilled, (state, {payload}) => {
      state.characters = payload;
      state.loading = 'finished';
    });
    builder.addCase(removeFavorite.pending, (state, _) => {
      state.loading = 'loading';
    });
    builder.addCase(removeFavorite.rejected, (state, _) => {
      state.error =
        'Ops, parece que ocorreu um erro. Tente novamente mais tarde.';
      state.loading = 'finished';
    });

    builder.addCase(fetchFavorites.fulfilled, (state, {payload}) => {
      state.characters = payload;
      state.loading = 'finished';
      state.searchType = 'favorites';
    });
    builder.addCase(fetchFavorites.pending, (state, _) => {
      state.loading = 'loading';
    });
    builder.addCase(fetchFavorites.rejected, (state, _) => {
      state.error =
        'Ops, parece que ocorreu um erro. Tente novamente mais tarde.';
      state.loading = 'finished';
    });
  },
});

export default charactersSlice.reducer;
