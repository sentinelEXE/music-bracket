import { AppState, Match, MatchState, Pair, Song } from "../types/types";
import { selectMatchById } from "./store";

export function updateMatchStateHelper(state: AppState, matchId: string, matchState: MatchState): AppState {
  const thisMatch = selectMatchById(state, matchId);
  if (!state.bracket || !thisMatch) { return state; }
  const updatedMatches = state.bracket.matches.map((match) => {
    if (match.id === matchId) {
      return { ...match, matchState };
    }
    if (isInNextChain(state, thisMatch.id, match.id)) {
      const isEvenMatch = thisMatch.matchNumber % 2 === 0;
      const isImmediate = thisMatch.nextMatchId === match.id;
      return updateNextMatchState(state, match, thisMatch, isEvenMatch, matchState, isImmediate);
    }
    return match;
  });
  return {
    ...state,
    bracket: {
      ...state.bracket,
      matches: updatedMatches,
    },
  };
}

function isInNextChain(state: AppState, matchId: string, nextMatchId: string): boolean {
  const match = selectMatchById(state, matchId);
  if (!match) { return false; }
  if (match.nextMatchId === nextMatchId) { return true; }
  if (match.nextMatchId) {
    return isInNextChain(state, match.nextMatchId, nextMatchId);
  }
  return false;
}

function isInPreviousChain(state: AppState, matchId: string | null, previousMatchId: string | null): boolean {
  if (matchId === null) { return false; }
  const match = selectMatchById(state, matchId);
  if (!match) { return false; }
  if (match.previousMatchIds?.includes(previousMatchId)) { return true; }
  if (match.previousMatchIds) {
    return match.previousMatchIds.some((id) => isInPreviousChain(state, id, previousMatchId));
  }
  return false;
}

function updateNextMatchState(state: AppState, match: Match, thisMatch: Match, isEvenMatch: boolean, matchState: MatchState, isImmediate: boolean): Match {
  if (!isImmediate) {
    const previousMatchIds = match.previousMatchIds || [];
    const isPrev1 = isInPreviousChain(state, previousMatchIds[0], thisMatch.id);
    const isPrev2 = isInPreviousChain(state, previousMatchIds[1], thisMatch.id);
    return { ...match, songs: [isPrev1 ? null : match.songs[0], isPrev2 ? null : match.songs[1]] as Pair<Song | null>, matchState: MatchState.Undecided };;
  }
  if (isEvenMatch) {
    const song0 = matchState === MatchState.Song0Wins ? thisMatch.songs[0] : matchState === MatchState.Song1Wins ? thisMatch.songs[1] : null;
    const song1 = match.songs[1];
    return { ...match, songs: [song0, song1] as Pair<Song | null>, matchState: MatchState.Undecided };
  } else {
    const song0 = match.songs[0];
    const song1 = matchState === MatchState.Song0Wins ? thisMatch.songs[0] : matchState === MatchState.Song1Wins ? thisMatch.songs[1] : null;
    return { ...match, songs: [song0, song1] as Pair<Song | null>, matchState: MatchState.Undecided };
  }
}
