//src/utils/get-first-undecided-match.ts

import { Match, MatchState } from "../types/types";


export function getFirstUndecidedMatch(matches: Match[], matchId: string = ""): string | undefined {
  return matches.find(match => match.matchState === MatchState.Undecided && match.id !== matchId)?.id;
}
