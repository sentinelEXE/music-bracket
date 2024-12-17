import { AppState, MatchState, Pair, Song } from "../types/types";
import { selectMatchById } from "./store";

export function updateMatchStateHelper(state: AppState, matchId: string, matchState: MatchState): AppState {
    const thisMatch = selectMatchById(state, matchId);
    if (!state.bracket || !thisMatch) { return state; }
    const nextMatch = thisMatch?.nextMatchId ? selectMatchById(state, thisMatch.nextMatchId) : null;
    const updatedMatches = state.bracket.matches.map((match) => {
        if (match.id === matchId) {
            return { ...match, matchState };
        }
        if (match.id === nextMatch?.id) {
            if (thisMatch.matchNumber % 2 === 0) {
                if (matchState === MatchState.Song0Wins) {
                    return { ...match, songs: [thisMatch.songs[0], match.songs[1]] as Pair<Song | null> };
                } else if (matchState === MatchState.Song1Wins) {
                    return { ...match, songs: [thisMatch.songs[1], match.songs[1]] as Pair<Song | null> };
                }
            } else {
                if (matchState === MatchState.Song0Wins) {
                    return { ...match, songs: [match.songs[0], thisMatch.songs[0]] as Pair<Song | null> };
                } else if (matchState === MatchState.Song1Wins) {
                    return { ...match, songs: [match.songs[0], thisMatch.songs[1]] as Pair<Song | null> };
                }
            }
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