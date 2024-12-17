// src/components/layout/Bracket.tsx
import React from 'react';
import { Match } from '../../types/types';

interface BracketProps {
  match: Match;
  matches: Match[];
}

export const Bracket: React.FC<BracketProps> = ({ match, matches }) => {
  const previousMatches = match.previousMatchIds.map(id => matches.find(m => m.id === id));

  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid black', paddingLeft: '10px' }}>
      <div>
        <strong>Match ID:</strong> {match.id}
      </div>
      <div>
        <strong>Round:</strong> {match.round}
      </div>
      <div>
        <strong>Songs:</strong> {match.songs[0]?.name} vs {match.songs[1]?.name}
      </div>
      <div>
        <strong>Previous Matches:</strong>
        <div>
          {previousMatches[0] && <Bracket match={previousMatches[0]!} matches={matches} />}
          {previousMatches[1] && <Bracket match={previousMatches[1]!} matches={matches} />}
        </div>
      </div>
    </div>
  );
};