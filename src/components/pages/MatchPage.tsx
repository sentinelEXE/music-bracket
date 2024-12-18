// src/components/pages/MatchPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MatchState, OnClickEvent, Song } from '../../types/types';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateMatchState, selectMatchById } from '../../store/store';
import { getFirstUndecidedMatch } from '../../utils/get-first-undecided-match';
import { STRINGS } from '../../constants/strings';
import "../../styles/pages/MatchPage.css";

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
    const championshipMatchId = useSelector((state: any) => state.bracket.championshipMatchId);
    const matches = useSelector((state: any) => state.bracket.matches); 
    const [firstSong, setFirstSong] = useState<Song | undefined>(undefined);
    const [secondSong, setSecondSong] = useState<Song | undefined>(undefined);
    const [selectedSong, setSelectedSong] = useState<Song | undefined | null>(undefined);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (match && match.songs && match.songs.length === 2) {
        setFirstSong(match.songs[0] || undefined);
        setSecondSong(match.songs[1] || undefined);
        setSelectedSong(match.matchState === MatchState.Undecided ? undefined : match.matchState === MatchState.Song0Wins ? match.songs[0] : match.songs[1])
      }
    }, [match]);

    const [firstSongSelected, secondSongSelected] = useMemo(() => {
      if (selectedSong?.id === firstSong?.id) {
        return [true, false];
      } else if (selectedSong?.id === secondSong?.id) {
        return [false, true];
      } else {
        return [false, false];
      }
    }, [selectedSong, firstSong, secondSong]);

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
        if (buttonId === selectedSong?.id) {
          setSelectedSong(undefined);
        } else if (buttonId === firstSong.id) {
          setSelectedSong(firstSong);
        } else {
          setSelectedSong(secondSong);
        }
      }
    }, [matchId, firstSong, secondSong, selectedSong]);

    const navigateBack = useCallback(() => {
      const matchState = firstSongSelected ? MatchState.Song0Wins : secondSongSelected ? MatchState.Song1Wins : MatchState.Undecided;
      dispatch(updateMatchState(matchId!, matchState));
      navigate('/bracket');
    }, [navigate, dispatch, matchId, firstSongSelected, secondSongSelected]);

    const navigateToNext = useCallback(() => {
      const matchState = firstSongSelected ? MatchState.Song0Wins : secondSongSelected ? MatchState.Song1Wins : MatchState.Undecided;
      if (matchState !== match?.matchState) {
        dispatch(updateMatchState(matchId!, matchState));
      }
      if (matchId === championshipMatchId) {
        navigate('/victory');
      } else {
        const nextMatchId = getFirstUndecidedMatch(matches, matchId || undefined);
        if (!nextMatchId) {
          navigate('/bracket');
        } else {
          navigate(`/match?id=${nextMatchId}`);
          setFirstSong(undefined);
          setSecondSong(undefined);
          setSelectedSong(undefined);
        }
      }
    }, [navigate, dispatch, match, matches, matchId, championshipMatchId, firstSongSelected, secondSongSelected]);
  
    return (
      <div className='MatchPage'>
        {firstSong && secondSong ? (
          <>
            {firstSong.uri && (
                <button
                  id={firstSong.id}
                  onClick={onDecisionClick}
                  className={`pick ${firstSongSelected ? 'selected' : ''}`}
                  >
                    <div id='song1' />
                    {firstSongSelected && <span className="checkmark">✔</span>}
                </button>
            )}
            {secondSong.uri && (
              <button
                id={secondSong.id}
                onClick={onDecisionClick}
                className={`pick ${secondSongSelected ? 'selected' : ''}`}
                >
                  <div id='song2' />
                  {secondSongSelected && <span className="checkmark">✔</span>}
            </button>
            )}
            <button id="next" onClick={navigateToNext} disabled={matchId === championshipMatchId && !selectedSong}>
              {matchId === championshipMatchId ? STRINGS.MATCH_PAGE.RESULTS : STRINGS.MATCH_PAGE.NEXT_MATCH}
            </button>
            <button id="back" onClick={navigateBack} disabled={matchId === championshipMatchId && !!selectedSong}>{STRINGS.MATCH_PAGE.BACK_TO_BRACKET}</button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
