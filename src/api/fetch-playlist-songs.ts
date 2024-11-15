// src/api/fetch-playlist-songs.ts
import { Song } from '../types/types';

const fetchPlaylistSongs = async (playlistId: string, accessToken: string): Promise<Song[]> => {
    const fetchSongsFromUrl = async (url: string, accumulatedTracks: Song[] = []): Promise<Song[]> => {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      const newTracks = data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
        })),
        popularity: item.track.popularity,
        href: item.track.href,
        preview_url: item.track.preview_url,
      }));
      const allTracks = [...accumulatedTracks, ...newTracks];
      if (data.next) {
        return fetchSongsFromUrl(data.next, allTracks);
      }
      return allTracks;
    };
  
    const initialUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    return fetchSongsFromUrl(initialUrl);
  };
  
  export default fetchPlaylistSongs;