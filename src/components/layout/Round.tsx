// src/components/layout/Round.tsx
import React, { useState } from 'react';
import { Match as MatchType } from '../../types/types';
import { Match } from './Match';
import '../../styles/layout/Round.css';

interface RoundProps {
  roundMatches: MatchType[];
  roundIndex: number;
}

const Round: React.FC<RoundProps> = ({ roundMatches, roundIndex }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="round-column">
      <button onClick={toggleVisibility}>
        {isVisible ? `Hide Round ${roundIndex + 1}` : `Show Round ${roundIndex + 1}`}
      </button>
      {isVisible && (
        <>
          {roundMatches.map(match => (
            <Match key={match.id} match={match} />
          ))}
        </>
      )}
    </div>
  );
};

export default Round;