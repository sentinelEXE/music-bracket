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
    song1: Song;
    song2: Song;
    winner?: Song;
}

export interface Round {
    id: string;
    matches: Match[];
}

export interface Bracket {
    id: string;
    name: string;
    rounds: Round[];
}

export interface AppState {
    selectedPlaylist: Playlist | null;
    songs: Song[];
    bracket: Bracket | null;
    contestantNumber: number;
  }

export interface Image {
    url: string;
    height: number;
    width: number;
}