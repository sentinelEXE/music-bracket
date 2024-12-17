// src/components/pages/BracketPage.tsx
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bracket } from '../layout/Bracket';
import { Song } from '../../types/types';
import { fetchPlaylistSongs } from '../../api/fetch-playlist-songs';
import { getRandomSongs } from '../../utils/get-random-songs';
import { setSongs } from '../../store/store';
import { useAsync } from '../../hooks/use-async';
import { useBuildBracket } from '../../hooks/use-build-bracket';

export const BracketPage: React.FC = () => {
  const dispatch = useDispatch();
  const songs = useSelector((state: any) => state.songs) as Song[];
  const selectedPlaylist = useSelector((state: any) => state.selectedPlaylist);
  const contestantNumber = useSelector((state: any) => state.contestantNumber);
  const bracket = useSelector((state: any) => state.bracket)
  const accessToken = localStorage.getItem('access_token');

  const { execute: executeFetchPlaylist, PlaceholderComponent } = useAsync<Song[]>({
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

  const { buildBracket } = useBuildBracket();
  const hasFetchedPlaylist = useRef(false);

  useEffect(() => {
    if (!hasFetchedPlaylist.current && songs.length === 0 && selectedPlaylist && contestantNumber > 0) {
      executeFetchPlaylist();
      hasFetchedPlaylist.current = true;
    } else if (songs.length > 0 && !bracket) {
      buildBracket(songs);
    }
  }, [songs, selectedPlaylist, contestantNumber, executeFetchPlaylist, buildBracket, bracket]);
      
  return (
    <div>
      <h1>Bracket Page</h1>
      {selectedPlaylist ? (
        <PlaceholderComponent>
          <h2>{selectedPlaylist.name}</h2>
          {bracket && (
            <Bracket matches={bracket.matches} />
          )}
        </PlaceholderComponent>
      ) : (
        <p>No playlist selected</p>
      )}
    <a href='/victory'>Victory</a>
  </div>
  );
};