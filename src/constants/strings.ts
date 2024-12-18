// src/types/strings.ts
export const STRINGS = {
    START_PAGE: {
        TITLE: 'Music Bracket',
        INSTRUCTIONS: 'Put your favorite songs head-to-head in this single-elimination tournament bracket! Create a Spotify playlist of the songs you want to include, then select the number of songs you want in the bracket and the playlist you created. May the best song win!',
        BRACKET_TITLE_PLACEHOLDER: 'Bracket title',
        SELECT_NUMBER_OF_SONGS: 'Select # of songs',
        SELECT_PLAYLIST: 'Select a playlist',
        GENERATE_BRACKET: 'Generate Bracket',
        LOADING_BRACKET: 'Loading bracket',
        NO_PLAYLIST_SELECTED: 'No playlist selected',
        LOGIN_WITH_SPOTIFY: 'Login with Spotify',
    },
    VICTORY_PAGE: {
        WINNER: 'Winner!',
        BACK_TO_BRACKET: 'Back to bracket',
        START_OVER: 'Start over',
        NO_WINNER: 'No winner',
    },
    MATCH_PAGE: {
        BACK_TO_BRACKET: 'Back to bracket',
        NEXT_MATCH: 'Next match',
        RESULTS: 'Results',
    },
};

export const ERRORS = {
    NO_TITLE: 'Please enter a title for the bracket.',
    NOT_ENOUGH_SONGS: 'The selected playlist does not have enough songs for the bracket.',
    NO_CONTESTANTS: 'Please select the number of songs for the bracket.',
    NO_PLAYLIST_SELECTED: 'Please select a playlist.',
    FETCH_PLAYLISTS_ERROR: "There was an error fetching your playlists.",
};