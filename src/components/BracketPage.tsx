// src/components/BracketPage.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Playlist, Song } from '../types/types';
import fetchPlaylistSongs from '../api/fetch-playlist-songs';

export const BracketPage: React.FC = () => {
  const selectedPlaylist = useSelector((state: any) => state.selectedPlaylist) as Playlist;
  const contestantNumber = useSelector((state: any) => state.contestantNumber);
  const [songs, setSongs] = useState<Song[]>([]);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (selectedPlaylist && accessToken) {
      fetchPlaylistSongs(selectedPlaylist.id, accessToken)
        .then(allTracks => setSongs(allTracks))
        .catch(error => console.error('Error fetching playlist details:', error));
    }
  }, [selectedPlaylist, accessToken]);

  useEffect(() => {
    console.log({ songs: songs });
  }, [songs]);

  return (
    <div>
      <h1>Bracket Page</h1>
      {selectedPlaylist ? (
        <div>
          <h2>{selectedPlaylist.name}</h2>
          <ul>
            {songs.map((song) => (
              <li key={song.id}>{song.name} by {song.artists.map(artist => artist.name).join(', ')}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No playlist selected</p>
      )}
    </div>
  );
};

export default BracketPage;