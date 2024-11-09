// src/components/BracketPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Playlist, Song } from '../types/types';
import fetchPlaylistSongs from '../api/fetch-playlist-songs';
import { getRandomSongs } from '../utils/get-random-songs';
import { setSongs } from '../store/store';

export const BracketPage: React.FC = () => {
    const dispatch = useDispatch();
    const selectedPlaylist = useSelector((state: any) => state.selectedPlaylist) as Playlist;
    const contestantNumber = useSelector((state: any) => state.contestantNumber);
    const [songs, setSongsState] = useState<Song[]>([]);
    const [songsRandomized, setSongsRandomized] = useState<boolean>(false);
    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        if (selectedPlaylist && accessToken) {
        fetchPlaylistSongs(selectedPlaylist.id, accessToken)
            .then(allTracks => setSongsState(allTracks))
            .catch(error => console.error('Error fetching playlist details:', error));
        }
    }, [selectedPlaylist, accessToken]);

    useEffect(() => {
        if (songs.length > 0 && contestantNumber > 0 && !songsRandomized) {
            const selectedSongs = getRandomSongs(songs, contestantNumber);
            setSongsState(selectedSongs);
            dispatch(setSongs(selectedSongs));
            setSongsRandomized(true);
        }
    }, [songs, contestantNumber, dispatch]);

    return (
        <div>
        <h1>Bracket Page</h1>
        {selectedPlaylist ? (
            <div>
            <h2>{selectedPlaylist.name}</h2>
            <ul>
                {songs.map((song) => (
                <li key={song.id}>{song.name} by {song.artists.map(artist => artist.name).join(', ')}</li>
                ))}
            </ul>
            </div>
        ) : (
            <p>No playlist selected</p>
        )}
        </div>
    );
};

export default BracketPage;