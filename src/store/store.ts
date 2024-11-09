// src/store/store.ts
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { AppState, Playlist, Song, Bracket } from '../types/types';

// Define initial state
const initialState: AppState = {
  selectedPlaylist: null,
  songs: [],
  bracket: null,
  contestantNumber: 2,
};

// Define action types
const SET_SELECTED_PLAYLIST = 'SET_SELECTED_PLAYLIST';
const SET_SONGS = 'SET_SONGS';
const SET_BRACKET = 'SET_BRACKET';
const SET_CONTESTANT_NUMBER = 'SET_CONTESTANT_NUMBER';

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

// Define reducers
const selectedPlaylistReducer = (state = initialState.selectedPlaylist, action: any) => {
  switch (action.type) {
    case SET_SELECTED_PLAYLIST:
      return action.payload;
    default:
      return state;
  }
};

const songsReducer = (state = initialState.songs, action: any) => {
  switch (action.type) {
    case SET_SONGS:
      return action.payload;
    default:
      return state;
  }
};

const bracketReducer = (state = initialState.bracket, action: any) => {
  switch (action.type) {
    case SET_BRACKET:
      return action.payload;
    default:
      return state;
  }
};

const contestantNumberReducer = (state = initialState.contestantNumber, action: any) => {
  switch (action.type) {
    case SET_CONTESTANT_NUMBER:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  selectedPlaylist: selectedPlaylistReducer,
  songs: songsReducer,
  bracket: bracketReducer,
  contestantNumber: contestantNumberReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;