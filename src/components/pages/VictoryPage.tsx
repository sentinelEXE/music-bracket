// src/components/pages/VictoryPage.tsx
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { OnClickEvent } from '../../types/types';
import { resetState, selectWinningSong } from '../../store/store';

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
      if (winningSong) {
        window.onSpotifyIframeApiReady = (IFrameAPI) => {
          const element = document.getElementById('song');
          if (element) {
            const options = {
              uri: winningSong.uri,
            };
            const callback = (EmbedController: any) => {};
            IFrameAPI.createController(element, options, callback);
          }
        };
      }
    }, [winningSong]);

    const backToBracket = useCallback(() => {
      navigate('/bracket');
  }, [navigate]);

    const startOver = useCallback((event: OnClickEvent) => {
        dispatch(resetState());
        navigate('/start');
    }, [navigate, dispatch]);

    return (
        <div>
          <h1>Winner!</h1>
          {winningSong ? (
            <div>
              {winningSong.uri && <div id='song'/>}
            </div>
          ) : (
            <p>No winner yet</p>
          )}
          <button onClick={backToBracket}>Back to bracket</button>
          <button onClick={startOver}>Start over</button>
        </div>
      );
};
