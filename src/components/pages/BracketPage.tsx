// src/components/pages/BracketPage.tsx
import React from 'react';
import {  useSelector } from 'react-redux';
import { Bracket } from '../layout/Bracket';

export const BracketPage: React.FC = () => {
  const bracket = useSelector((state: any) => state.bracket);

  return (
    <div>
      <h1>Bracket Page</h1>
      {bracket ? (
        <>
          <h2>{bracket.title}</h2>
          <Bracket matches={bracket.matches} />
        </>
      ) : (
        <p>No playlist selected</p>
      )}
    <a href='/victory'>Victory</a>
  </div>
  );
};