// src/components/pages/BracketPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Playlist, Song } from '../../types/types';
import { fetchPlaylistSongs } from '../../api/fetch-playlist-songs';
import { getRandomSongs } from '../../utils/get-random-songs';
import { setSongs } from '../../store/store';
import { useAsync } from '../../hooks/useAsync';

export const BracketPage: React.FC = () => {
    const dispatch = useDispatch();
    const songs = useSelector((state: any) => state.songs) as Song[];
    const selectedPlaylist = useSelector((state: any) => state.selectedPlaylist) as Playlist;
    const contestantNumber = useSelector((state: any) => state.contestantNumber);
    const accessToken = localStorage.getItem('access_token');

    const { execute, PlaceholderComponent } = useAsync<Song[]>({
        fetchFunction: fetchPlaylistSongs,
        params: [selectedPlaylist?.id, accessToken],
        onSuccess: (data) => {
            if (data && data.length > 0 && contestantNumber > 0) {
                const selectedSongs = getRandomSongs(data, contestantNumber);
                dispatch(setSongs(selectedSongs));
            }
        },
        loaded: songs.length > 0
    });

    useEffect(() => {
      if (songs.length === 0 && selectedPlaylist && contestantNumber > 0) {
        execute();
      }
    }, [songs, selectedPlaylist, contestantNumber, execute]);
      
    return (
      <div>
        <h1>Bracket Page</h1>
        {selectedPlaylist ? (
          <PlaceholderComponent>
            <h2>{selectedPlaylist.name}</h2>
            <ul>
              {songs?.map((song) => (
                <li key={song.id}>
                  {song.name} by {song.artists.map(artist => artist.name).join(', ')}
                  
                </li>
              ))}
            </ul>
          </PlaceholderComponent>
        ) : (
          <p>No playlist selected</p>
        )}
      <a href="/match">Start Bracket</a>
      <a href='/victory'>Victory</a>
    </div>
    );
};

export default BracketPage;