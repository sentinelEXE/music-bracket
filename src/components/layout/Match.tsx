// src/components/layout/Match.tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MatchState, Match as MatchType } from '../../types/types';
import '../../styles/layout/Match.css';

interface MatchProps {
  match: MatchType;
}

export const Match: React.FC<MatchProps> = ({ match }) => {
    const isReady = useMemo(() => match.songs[0] && match.songs[1], [match.songs]);
    const matchState = match.matchState;
    const song0Wins = matchState === MatchState.Song0Wins;
    const song1Wins = matchState === MatchState.Song1Wins;

    const matchContent = (
        <div className="match-box">
          <div className={song0Wins ? "winner" : ""}>
            {song0Wins && <span className="checkmark">✔ </span>} {match.songs[0]?.name ?? 'TBD'}
          </div>
          <div>
            vs
          </div>
          <div className={song1Wins ? "winner" : ""}>
            {song1Wins && <span className="checkmark">✔ </span>}{match.songs[1]?.name ?? 'TBD'}
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
        </div>
      );
};
