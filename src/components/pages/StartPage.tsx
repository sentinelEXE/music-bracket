// src/components/pages/StartPage.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../../types/types';
import { setSelectedPlaylist, setContestantNumber, setBracketTitle } from '../../store/store';
import { fetchPlaylists } from '../../api/fetch-playlists';
import { useAsync } from '../../hooks/use-async';
import { ERRORS, STRINGS } from '../../constants/strings';
import { VALUES } from '../../constants/values';
import '../../styles/pages/StartPage.css';

export const StartPage: React.FC = () => {
    const accessToken = localStorage.getItem('access_token');
    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('');
    const [contestantNumber, setContestantNumberState] = useState<number>(0);
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
          console.error(ERRORS.FETCH_PLAYLISTS_ERROR, error);
        },
        loaded: playlists.length > 0,
    });

    useEffect(() => {
        if (accessToken && !hasFetchedPlaylists.current) {
            executeFetchPlaylists();
            hasFetchedPlaylists.current = true;
        }
    }, [accessToken, executeFetchPlaylists]);

    const handleGenerateBracket = useCallback(() => {
        if (selectedPlaylist) {
          dispatch(setSelectedPlaylist(selectedPlaylist));
          dispatch(setContestantNumber(contestantNumber));
          dispatch(setBracketTitle(title));
          navigate('/bracket');
        }
      }, [dispatch, selectedPlaylist, contestantNumber, title, navigate]);
    
    const handlePlaylistChange = (playlist: Playlist) => {
        setSelectedPlaylistState(playlist);
    };

    const errorMessage = useMemo(() => {
        if (!title) {
            return ERRORS.NO_TITLE;
        } else if (selectedPlaylist?.tracks && selectedPlaylist.tracks.total < contestantNumber) {
            return ERRORS.NOT_ENOUGH_SONGS;
        } else if (!contestantNumber || contestantNumber < 2) {
            return ERRORS.NO_CONTESTANTS;
        } else if (!selectedPlaylist) {
            return ERRORS.NO_PLAYLIST_SELECTED;
        } else {
            return "";
        }
    }, [title, selectedPlaylist, contestantNumber]);

    return (
        <div className='StartPage'>
            <h1>{STRINGS.TITLE}</h1>
            <p className='instructions'>{STRINGS.INSTRUCTIONS}</p>
            <div className='inputs'>
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Bracket title'/>
                <br/>
                <select 
                    value={contestantNumber || ""} 
                    onChange={(e) => setContestantNumberState(Number(e.target.value))}
                >
                    <option value="" disabled>{STRINGS.SELECT_NUMBER_OF_SONGS}</option>
                    {VALUES.CONTESTANT_VALUES.map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
                <br/>
                <select 
                    id="playlist"
                    value={selectedPlaylist?.id || ""} 
                    onChange={(e) => {
                        const playlist = playlists.find(p => p.id === e.target.value);
                        if (playlist) handlePlaylistChange(playlist);
                    }}
                >
                    <option value="" disabled>{STRINGS.SELECT_PLAYLIST}</option>
                    {playlists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                    ))}
                </select>
                <br/>
                {errorMessage && <p>{errorMessage}</p>}
                <br/>
                <button disabled={errorMessage !== ""} onClick={handleGenerateBracket}>{STRINGS.GENERATE_BRACKET}</button>
            </div>
        </div>
    )
};