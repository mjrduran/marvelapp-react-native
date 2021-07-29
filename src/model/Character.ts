interface SerieItem {
  resourceURI: string;
  name: string;
}

interface Series {
  available: number;
  collectionURI: string;
  returned: number;
  items: Array<SerieItem>;
}

interface EventItem {
  resourceURI: string;
  name: string;
}

interface Events {
  available: number;
  collectionURI: string;
  returned: number;
  items: Array<EventItem>;
}

export interface Thumbnail {
  path: string;
  extension: string;
}

export interface Character {
  id: number;
  name: string;
  thumbnail: Thumbnail;
  events?: Events;
  series?: Series;
  isFavorite?: boolean;
}

export function getThumbailFullPath(thumbnail: Thumbnail): string {
  return `${thumbnail.path}/landscape_incredible.${thumbnail.extension}`;
}
