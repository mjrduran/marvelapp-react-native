import MMKVStorage from 'react-native-mmkv-storage';
const MMKV = new MMKVStorage.Loader().initialize();
const FAVORITES_KEY = 'favorites_storage';

export async function persistFavorites(
  favorites: Array<number>,
): Promise<boolean> {
  return await MMKV.setArrayAsync(FAVORITES_KEY, favorites);
}

export async function queryFavoritesAsync(): Promise<Array<number>> {
  return (await MMKV.getArrayAsync(FAVORITES_KEY)) as Array<number>;
}

export function queryFavoritesSync(): Array<number> {
  return MMKV.getArray(FAVORITES_KEY) as Array<number>;
}
