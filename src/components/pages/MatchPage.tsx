// src/components/pages/MatchPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { OnClickEvent, Song } from '../../types/types';
import { getRandomSongs } from '../../utils/get-random-songs';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}

export const MatchPage: React.FC = () => {
    const songs = useSelector((state: any) => state.songs) as Song[];
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (songs.length > 0) {
        const randomSongs = getRandomSongs(songs, 2);
        setSelectedSongs(randomSongs);
      }
    }, [songs]);

    useEffect(() => {
      if (selectedSongs.length === 2) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          const element1 = document.getElementById('song1');
          const element2 = document.getElementById('song2');
          const options1 = {
            uri: selectedSongs[0].uri
          };
          const options2 = {
            uri: selectedSongs[1].uri
          };
          const callback = (EmbedController: any) => {};
          IFrameAPI.createController(element1, options1, callback);
          IFrameAPI.createController(element2, options2, callback);
        };
      }
    }, [selectedSongs]);

    const onClick = useCallback((event: OnClickEvent) => {
      const buttonId = event.currentTarget.id;
      console.log('Button clicked:', buttonId);
      navigate('/bracket');
    }, [navigate]);
  
    return (
      <div>
        <h1>Match Page</h1>
        {selectedSongs.length === 2 ? (
          <div>
            {selectedSongs[0].uri && <div id='song1'/>}
            {selectedSongs[1].uri && <div id='song2'/>}
            <div>
              <button id={selectedSongs[0].id} onClick={onClick}>{selectedSongs[0].name}</button>
              <button id={selectedSongs[1].id} onClick={onClick}>{selectedSongs[1].name}</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
