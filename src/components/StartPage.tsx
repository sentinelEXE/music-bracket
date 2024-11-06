// src/components/App.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const StartPage: React.FC = () => {
    const accessToken = localStorage.getItem('access_token');
    const [title, setTitle] = useState<string>('');
    const [contestantNumber, setContestantNumber] = useState<number>(2);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');

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
        navigate('/new-bracket', { state: { title, contestantNumber } });
    };

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
                value={selectedPlaylist} 
                onChange={(e) => setSelectedPlaylist(e.target.value)}
            >
                {playlists.map(playlist => (
                    <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                ))}
            </select>
            <br/>
            <button onClick={handleGenerateBracket}>Generate Bracket</button>
        </div>
    )
};