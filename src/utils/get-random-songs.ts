// src/utils/get-random-songs.ts
import { Song } from "../types/types";

export const getRandomSongs = (songs: Song[], count: number): Song[] => {
  const shuffled = [...songs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
