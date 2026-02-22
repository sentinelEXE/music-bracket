// src/components/pages/VictoryPage.tsx
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { OnClickEvent } from '../../types/types';
import { restoreState, selectWinningSong } from '../../store/store';
import { STRINGS } from '../../constants/strings';
import "../../styles/pages/VictoryPage.css";

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}
export const VictoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const winningSong = useSelector((state: any) => selectWinningSong(state));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (winningSong) {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById('song');
        if (element) {
          const options = {
            uri: winningSong.uri,
            theme: 'black',
            allow: 'encrypted-media; autoplay',
            preload: true,
            loading: 'eager'
          };
          const callback = (_EmbedController: any) => { };
          IFrameAPI.createController(element, options, callback);
        }
      };
    }
  }, [winningSong]);

  const backToBracket = useCallback(() => {
    navigate('/bracket');
  }, [navigate]);

  const startOver = useCallback((_event: OnClickEvent) => {
    dispatch(restoreState());
    navigate('/start');
  }, [navigate, dispatch]);

  return (
    <div className='VictoryPage'>
      <h1>{STRINGS.VICTORY_PAGE.WINNER}</h1>
      {winningSong ? (
        <div>
          {winningSong.uri && <div id='song' />}
        </div>
      ) : (
        <p>{STRINGS.VICTORY_PAGE.NO_WINNER}</p>
      )}
      <button onClick={backToBracket}>{STRINGS.VICTORY_PAGE.BACK_TO_BRACKET}</button>
      <button onClick={startOver}>{STRINGS.VICTORY_PAGE.START_OVER}</button>
    </div>
  );
};
