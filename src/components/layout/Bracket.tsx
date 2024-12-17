// src/components/layout/Bracket.tsx
import React from 'react';
import { Match } from '../../types/types';
import Round from './Round';
import '../../styles/layout/Bracket.css';

interface BracketProps {
  matches: Match[];
}

export const Bracket: React.FC<BracketProps> = ({ matches }) => {
  const rounds = Math.max(...matches.map(match => match.round));

  const matchesByRound = Array.from({ length: rounds }, (_, i) =>
    matches.filter(match => match.round === i + 1)
  );

  return (
    <div className="bracket-container">
      {matchesByRound.map((roundMatches, roundIndex) => (
        <Round key={roundIndex} roundMatches={roundMatches} roundIndex={roundIndex} />
      ))}
    </div>
  );
};