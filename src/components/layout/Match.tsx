// src/components/layout/Match.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MatchState, Match as MatchType } from '../../types/types';
import '../../styles/Match.css';

interface MatchProps {
  match: MatchType;
}

export const Match: React.FC<MatchProps> = ({ match }) => {
    const isReady = useMemo(() => match.songs[0] && match.songs[1], [match.songs]);
    const matchState = match.matchState;

    const matchContent = (
        <div className="match-box">
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