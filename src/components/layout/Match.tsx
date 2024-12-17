// src/components/layout/Match.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MatchState, Match as MatchType } from '../../types/types';
import '../../styles/Match.css';
import { selectMatchById } from '../../store/store';
import { useSelector } from 'react-redux';

interface MatchProps {
  match: MatchType;
}

export const Match: React.FC<MatchProps> = ({ match }) => {
    const isReady = useMemo(() => match.songs[0] && match.songs[1], [match.songs]);
    const matchState = match.matchState;

    //debug
    const nextMatch = useSelector((state: any) => selectMatchById(state, match.nextMatchId));
    const nextMatchNum = nextMatch?.matchNumber;
    const previousMatches = match.previousMatchIds
    // end debug

    const matchContent = (
        <div className="match-box">
          <div>{"match num: " + match.id}</div>
          <div>{"next match: " + match.nextMatchId}</div>
          <div>{"previous matches: " + previousMatches[0] + "   " + previousMatches[1]}</div>
          <div className={matchState === MatchState.Song0Wins ? "winner" : matchState === MatchState.Song1Wins ? "loser" : ""}>
            {match.songs[0]?.name ?? 'TBD'}
          </div>
          <div>
            vs
          </div>
          <div className={matchState === MatchState.Song1Wins ? "winner" : matchState === MatchState.Song0Wins ? "loser" : ""}>
            {match.songs[1]?.name ?? 'TBD'}
          </div>
        </div>
      );
    
      return (
        <div className="match-container">
          {isReady ? (
            <Link to={`/match?id=${match.id}`} className="match-link">
              {matchContent}
            </Link>
          ) : (
            <div className="match-link-disabled">
              {matchContent}
            </div>
          )}
          {match.nextMatchId && (
            <div className="connector-line" />
          )}
        </div>
      );
};