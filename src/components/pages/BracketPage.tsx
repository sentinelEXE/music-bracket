// src/components/pages/BracketPage.tsx
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bracket } from '../layout/Bracket';
import { AppState, OnClickEvent } from '../../types/types';
import { storeSelectedRound } from '../../store/store';
import { STRINGS } from '../../constants/strings';
import "../../styles/pages/BracketPage.css";

export const BracketPage: React.FC = () => {;
  const dispatch = useDispatch()
  const bracket = useSelector((state: AppState) => state.bracket);
  const selectedRound = useSelector((state: AppState) => state.selectedRound);
  const { matches } = bracket ?? {};
  const rounds = Math.max(...(matches?.map(match => match.round) ?? []));

  const onClick = useCallback((event: OnClickEvent) => {
    dispatch(storeSelectedRound(parseInt(event.currentTarget.id)));
  }, []);

  return (
    <div className='BracketPage'>
      <h1>{STRINGS.BRACKET_PAGE.TITLE}</h1>
      {bracket ? (
        <>
          <h2>{bracket.name}</h2>
          <div className="round-buttons">
            {Array.from({ length: rounds }, (_, index) => index + 1).map((round) => (
              <button id={round.toString()} key={round} onClick={onClick} className={round === selectedRound ? "selected" : ""}>
                {round === selectedRound ? `Round: ${round}` : round}
              </button>
            ))}
          </div>
          <Bracket matches={bracket.matches} selectedRound={selectedRound}/>
        </>
      ) : (
        <p>No playlist selected</p>
      )}
  </div>
  );
};