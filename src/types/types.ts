export interface Playlist {
    id: string;
    name: string;
    images: Image[];
    tracks: {
        total: number;
    }
}

export interface Song {
    id: string;
    name: string;
    artists: Artist[];
    popularity: number;
    href: string;
    preview_url: string;
    uri: string;
}

export interface Artist {
    id: string;
    name: string;
    images: Image[];
    popularity: number;
}

export interface Match {
    id: string;
    matchNumber: number;
    round: number;
    songs: Pair<Song | null>;
    previousMatchIds: Pair<string | null>;
    nextMatchId: string | null;
    matchState: MatchState;
}

export enum MatchState {
    Song0Wins = "Song 0 Wins",
    Song1Wins = "Song 1 Wins",
    Undecided = "Undecided",
}

export interface Bracket {
    id: string;
    name: string;
    championshipMatchId: string;
    matches: Match[];
}

export interface AppState {
    selectedPlaylist: Playlist | null;
    songs: Song[];
    bracket: Bracket | null;
    bracketName: string;
    contestantNumber: number;
    selectedRound: number;
  }

export interface Image {
    url: string;
    height: number;
    width: number;
}

export type Pair<T> = [T, T];

export interface OnClickEvent extends React.MouseEvent<HTMLButtonElement> {}