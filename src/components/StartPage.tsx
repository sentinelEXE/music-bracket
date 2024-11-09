// src/components/App.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../types/types';
import { setSelectedPlaylist } from '../store/store';

export const StartPage: React.FC = () => {
    const accessToken = localStorage.getItem('access_token');
    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('');
    const [contestantNumber, setContestantNumber] = useState<number>(2);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelectedPlaylistState] = useState<Playlist | null>();

    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken) {
            fetch('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(data => setPlaylists(data.items))
            .catch(error => console.error('Error fetching playlists:', error));
        }
    }, [accessToken]);

    const handleGenerateBracket = () => {
        if (selectedPlaylist) {
          dispatch(setSelectedPlaylist(selectedPlaylist));
          navigate('/bracket');
        }
      };
    
    const handlePlaylistChange = (playlist: Playlist) => {
        setSelectedPlaylistState(playlist);
    };

    const errorMessage = useMemo(() => {
        if (selectedPlaylist?.tracks && selectedPlaylist.tracks.total < contestantNumber) {
            return "This playlist does not have enough songs to start a bracket."
        }
        else if (!selectedPlaylist) {
            return "Please select a playlist."
        }
        else {
            return "";
        }
    }, [selectedPlaylist, contestantNumber]);

    return (
        <div>
            <h1>Welcome to Music Bracket</h1>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Bracket title'/>
            <br/>
            <label htmlFor="contestantNumber">Select number of songs:</label>
            <select 
                value={contestantNumber} 
                onChange={(e) => setContestantNumber(Number(e.target.value))}
            >
                {[2, 4, 8, 16, 32, 64, 128].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
            <br/>
            <label htmlFor="playlist">Select a playlist:</label>
            <select 
                id="playlist"
                value={selectedPlaylist?.id} 
                onChange={(e) => {
                    const playlist = playlists.find(p => p.id === e.target.value);
                    if (playlist) handlePlaylistChange(playlist);
                  }}
            >
                {playlists.map(playlist => (
                    <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
            </select>
            <br/>
            {errorMessage && <p>{errorMessage}</p>}
            <br/>
            <button disabled={errorMessage !== ""} onClick={handleGenerateBracket}>Generate Bracket</button>
        </div>
    )
};