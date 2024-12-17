// src/components/pages/VictoryPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { OnClickEvent, Song } from '../../types/types';
import { getRandomSongs } from '../../utils/get-random-songs';
import { resetState } from '../../store/store';

export const VictoryPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const songs = useSelector((state: any) => state.songs) as Song[];
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  
    useEffect(() => {
      if (songs.length > 0) {
        const randomSongs = getRandomSongs(songs, 1);
        setSelectedSongs(randomSongs);
      }
    }, [songs]);

    useEffect(() => {
      if (selectedSongs.length === 1) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          const element = document.getElementById('song');
          const options = {
            uri: selectedSongs[0].uri
          };
          const callback = (EmbedController: any) => {};
          IFrameAPI.createController(element, options, callback);
        };
      }
    }, [selectedSongs]);

    const onClick = useCallback((event: OnClickEvent) => {
        const buttonId = event.currentTarget.id;
        console.log('Button clicked:', buttonId);
        dispatch(resetState());
        navigate('/start');
      }, [navigate]);

    return (
        <div>
          <h1>Winner!</h1>
          {selectedSongs.length === 1 ? (
            <div>
              {selectedSongs[0].uri && <div id='song'/>}
              <button onClick={onClick}>Start over</button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
};
