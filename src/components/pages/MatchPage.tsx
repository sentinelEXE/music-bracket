// src/components/pages/MatchPage.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MatchState, OnClickEvent, Song } from '../../types/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateMatchState, selectMatchById } from '../../store/store';

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const MatchPage: React.FC = () => {
    const dispatch = useDispatch();
    const query = useQuery();
    const matchId = query.get('id');
    const match = useSelector((state: any) => selectMatchById(state, matchId!));
    const [firstSong, setFirstSong] = useState<Song | undefined>(undefined);
    const [secondSong, setSecondSong] = useState<Song | undefined>(undefined);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (match) {
        setFirstSong(match.songs[0] || undefined);
        setSecondSong(match.songs[1] || undefined);
      }
    }, [match]);

    useEffect(() => {
      if (firstSong && secondSong) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          const element1 = document.getElementById('song1');
          const element2 = document.getElementById('song2');
          const options1 = {
            uri: firstSong.uri
          };
          const options2 = {
            uri: secondSong.uri
          };
          const callback = (EmbedController: any) => {};
          IFrameAPI.createController(element1, options1, callback);
          IFrameAPI.createController(element2, options2, callback);
        };
      }
    }, [firstSong, secondSong]);

    const onDecisionClick = useCallback((event: OnClickEvent) => {
      if (matchId && firstSong && secondSong) {
        const buttonId = event.currentTarget.id;
        const matchState = buttonId === firstSong.id ? MatchState.Song0Wins : MatchState.Song1Wins;
        dispatch(updateMatchState(matchId!, matchState));
      }
      navigate('/bracket');
    }, [navigate, dispatch, matchId, firstSong, secondSong]);
  
    return (
      <div>
        <h1>Match Page</h1>
        {firstSong && secondSong ? (
          <div>
            {firstSong.uri && <div id='song1'/>}
            {secondSong.uri && <div id='song2'/>}
            <div>
              <button id={firstSong.id} onClick={onDecisionClick}>{firstSong.name}</button>
              <button id={secondSong.id} onClick={onDecisionClick}>{secondSong.name}</button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
