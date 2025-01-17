// src/hooks/useBuildBracket.ts
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { Bracket, Match, Song, MatchState } from "../types/types";
import { storeBracket } from "../store/store";
import { Pair } from "../types/types";

function generateMatchId(matchIdCounter: number): string {
    return `match-${matchIdCounter}`;
}

function isPowerOfTwo(n: number): boolean {
    return (n & (n - 1)) === 0 && n !== 0;
}

export const useBuildBracket = (): (songs: Song[], bracketName: string, contestantNumber: number) => Bracket => {
    const dispatch = useDispatch();

    const buildBracket = useCallback((songs: Song[], bracketName: string, contestantNumber: number): Bracket => {
        if (!isPowerOfTwo(contestantNumber)) {
            throw new Error("The number of contestants must be a power of 2.");
        }
        
        const matches: Match[] = [];
        const totalMatches = contestantNumber - 1;

        // Generate all matches
        for (let i = 0; i < totalMatches; i++) {
            const round = assignRound(i, totalMatches + 1);
            const match: Match = {
                id: generateMatchId(i),
                matchNumber: i,
                round: round + 1,
                songs: [null, null] as Pair<Song | null>,
                previousMatchIds: [null, null],
                nextMatchId: null,
                matchState: MatchState.Undecided,
            };
            matches.push(match);
        }

        // Populate round 1 matches with songs
        for (let i = 0; i < contestantNumber / 2; i++) {
            matches[i].songs = [songs[i * 2], songs[i * 2 + 1]] as Pair<Song>;
        }

        // Link matches
        for (let i = 0; i < totalMatches; i++) {
            const nextMatchIndex = Math.floor(i / 2) + Math.floor(contestantNumber / 2);
            if (nextMatchIndex < totalMatches) {
                matches[i].nextMatchId = matches[nextMatchIndex].id;
                if (i % 2 === 0) {
                    matches[nextMatchIndex].previousMatchIds[0] = matches[i].id;
                } else {
                    matches[nextMatchIndex].previousMatchIds[1] = matches[i].id;
                }
            }
        }

        const championshipMatch = matches[totalMatches - 1];

        const bracket: Bracket = {
            id: "test-bracket",
            name: bracketName,
            championshipMatchId: championshipMatch.id,
            matches: matches,
        };

        dispatch(storeBracket(bracket));

        return bracket;
    }, [dispatch]);

    return buildBracket;
};

function assignRound(index: number, totalMatches: number): number {
    let round = 0;
    let matchesInRound = totalMatches / 2;

    while (index >= matchesInRound) {
        round++;
        index -= matchesInRound;
        matchesInRound /= 2;
    }

    return round;
}