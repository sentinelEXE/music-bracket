// src/store/store.ts
import { createStore, applyMiddleware } from 'redux';
import { thunk, ThunkMiddleware } from 'redux-thunk';
import { AppState, Playlist, Song, Bracket } from '../types/types';
import localStorageMiddleware from './localStorageMiddleware';
import { loadState } from './loadState';

// Define initial state
const initialState: AppState = {
  selectedPlaylist: null,
  songs: [],
  bracket: null,
  contestantNumber: 0,
};

// Define action types
const SET_SELECTED_PLAYLIST = 'SET_SELECTED_PLAYLIST';
const SET_SONGS = 'SET_SONGS';
const SET_BRACKET = 'SET_BRACKET';
const SET_CONTESTANT_NUMBER = 'SET_CONTESTANT_NUMBER';
const RESET_STATE = 'RESET_STATE';

// Define action creators
export const setSelectedPlaylist = (playlist: Playlist) => ({
  type: SET_SELECTED_PLAYLIST,
  payload: playlist,
});

export const setSongs = (songs: Song[]) => ({
  type: SET_SONGS,
  payload: songs,
});

export const setBracket = (bracket: Bracket) => ({
  type: SET_BRACKET,
  payload: bracket,
});

export const setContestantNumber = (number: number) => ({
  type: SET_CONTESTANT_NUMBER,
  payload: number,
});

export const resetState = () => ({
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