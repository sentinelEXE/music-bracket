// src/components/pages/StartPage.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../../types/types';
import { setSelectedPlaylist, setContestantNumber, setBracketTitle } from '../../store/store';
import { fetchPlaylists } from '../../api/fetch-playlists';
import { useAsync } from '../../hooks/use-async';
import '../../styles/pages/StartPage.css';

export const StartPage: React.FC = () => {
    const accessToken = localStorage.getItem('access_token');
    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('');
    const [contestantNumber, setContestantNumberState] = useState<number>(2);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelectedPlaylistState] = useState<Playlist | null>();

    const navigate = useNavigate();
    const hasFetchedPlaylists = useRef(false);

    const { execute: executeFetchPlaylists } = useAsync<any[]>({
        fetchFunction: fetchPlaylists,
        params: [accessToken],
        onSuccess: (data) => {
          setPlaylists(data);
        },
        onFailure: (error) => {
          console.error('Error fetching playlists:', error);
        },
        loaded: playlists.length > 0,
    });

    useEffect(() => {
        if (accessToken && !hasFetchedPlaylists.current) {
            executeFetchPlaylists();
            hasFetchedPlaylists.current = true;
        }
    }, [accessToken, executeFetchPlaylists]);

    const handleGenerateBracket = () => {
        if (selectedPlaylist) {
          dispatch(setSelectedPlaylist(selectedPlaylist));
          dispatch(setContestantNumber(contestantNumber));
          dispatch(setBracketTitle(title));
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
        <div className='StartPage'>
            <h1>Music Bracket</h1>
            <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Bracket title'/>
            <br/>
            <label htmlFor="contestantNumber">Select number of songs:</label>
            <select 
                value={contestantNumber} 
                onChange={(e) => setContestantNumberState(Number(e.target.value))}
            >
                {[2, 4, 8, 16, 32, 64, 128].map(num => (
                    <option key={num} value={num}>{num}</option>
                ))}
            </select>
            <br/>
            <label htmlFor="playlist">Select a playlist:</label>
            <select 
                id="playlist"
                value={selectedPlaylist?.id || ""} 
                onChange={(e) => {
                    const playlist = playlists.find(p => p.id === e.target.value);
                    if (playlist) handlePlaylistChange(playlist);
                  }}
            >
                <option value="" disabled>Select a playlist</option>
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