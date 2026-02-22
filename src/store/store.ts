// src/store/store.ts
import { createStore, applyMiddleware } from 'redux';
import { thunk, ThunkMiddleware } from 'redux-thunk';
import { AppState, Playlist, Song, Bracket, MatchState, Match } from '../types/types';
import localStorageMiddleware from './localStorageMiddleware';
import { loadState } from './loadState';
import { updateMatchStateHelper } from './update-match-state-helper';

// Define initial state
const initialState: AppState = {
  selectedPlaylist: null,
  songs: [],
  bracket: null,
  bracketName: "",
  contestantNumber: 0,
  selectedRound: 1,
};

export const selectMatchById = (state: AppState, matchId: string | undefined): Match | undefined => {
  return state.bracket?.matches.find((match) => match.id === matchId);
};

export const selectWinningSong = (state: AppState): Song | null => {
  const championshipMatch = selectMatchById(state, state.bracket?.championshipMatchId);
  if (!championshipMatch || championshipMatch.matchState === MatchState.Undecided) { return null; }
  const winningSong = championshipMatch.matchState === MatchState.Song0Wins ? championshipMatch.songs[0] : championshipMatch.songs[1];
  return winningSong;
};

// Define action types
const SET_SELECTED_PLAYLIST = 'SET_SELECTED_PLAYLIST';
const SET_SONGS = 'SET_SONGS';
const SET_BRACKET = 'SET_BRACKET';
const SET_CONTESTANT_NUMBER = 'SET_CONTESTANT_NUMBER';
const SET_BRACKET_TITLE = 'SET_BRACKET_TITLE';
const SET_SELECTED_ROUND = 'SET_SELECTED_ROUND';
const UPDATE_MATCH_STATE = 'UPDATE_MATCH_STATE';
const RESET_STATE = 'RESET_STATE';

// Define action creators
export const storeSelectedPlaylist = (playlist: Playlist) => ({
  type: SET_SELECTED_PLAYLIST,
  payload: playlist,
});

export const storeSongs = (songs: Song[]) => ({
  type: SET_SONGS,
  payload: songs,
});

export const storeBracket = (bracket: Bracket) => ({
  type: SET_BRACKET,
  payload: bracket,
});

export const storeContestantNumber = (number: number) => ({
  type: SET_CONTESTANT_NUMBER,
  payload: number,
});

export const storeBracketTitle = (title: string) => ({
  type: SET_BRACKET_TITLE,
  payload: title,
});

export const storeSelectedRound = (round: number) => ({
  type: SET_SELECTED_ROUND,
  payload: round,
});

export const updateMatchState = (matchId: string, matchState: MatchState) => ({
  type: UPDATE_MATCH_STATE,
  payload: { matchId, matchState },
});

export const restoreState = () => ({
  type: RESET_STATE,
});

const rootReducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case SET_SELECTED_PLAYLIST:
      return { ...state, selectedPlaylist: action.payload };
    case SET_SONGS:
      return { ...state, songs: action.payload };
    case SET_BRACKET:
      return { ...state, bracket: action.payload };
    case SET_CONTESTANT_NUMBER:
      return { ...state, contestantNumber: action.payload };
    case SET_BRACKET_TITLE:
      return { ...state, bracketName: action.payload };
    case SET_SELECTED_ROUND:
      return { ...state, selectedRound: action.payload };
    case UPDATE_MATCH_STATE:
      const { matchId, matchState } = action.payload;
      return updateMatchStateHelper(state, matchId, matchState);
    case RESET_STATE:
      localStorage.removeItem('reduxState');
      return { ...initialState };
    default:
      return state;
  }
};

const persistedState = loadState();

const store = createStore(
  rootReducer,
  persistedState,
  applyMiddleware(thunk as ThunkMiddleware<AppState>, localStorageMiddleware)
);

export default store;
