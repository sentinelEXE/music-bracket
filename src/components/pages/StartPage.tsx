// src/components/pages/StartPage.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Playlist, Song } from '../../types/types';
import { storeSelectedPlaylist, storeContestantNumber, storeBracketTitle, storeSongs } from '../../store/store';
import { fetchPlaylists } from '../../api/fetch-playlists';
import { useAsync } from '../../hooks/use-async';
import { ERRORS, STRINGS } from '../../constants/strings';
import { VALUES } from '../../constants/values';
import { useBuildBracket } from '../../hooks/use-build-bracket';
import { getRandomSongs } from '../../utils/get-random-songs';
import { fetchPlaylistSongs } from '../../api/fetch-playlist-songs';
import '../../styles/pages/StartPage.css';

enum BracketBuildState {
    NOT_BUILT,
    BUILDING,
    BUILT,
}

export const StartPage: React.FC = () => {
    const accessToken = localStorage.getItem('access_token');
    const dispatch = useDispatch();
    const [title, setTitle] = useState<string>('');
    const [contestantNumber, setContestantNumber] = useState<number>(0);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>();

    const navigate = useNavigate();
    const hasFetchedPlaylists = useRef(false);
    const [isBracketBuilt, setIsBracketBuilt] = useState(BracketBuildState.NOT_BUILT);

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

    const { execute: executeFetchPlaylist } = useAsync<Song[]>({
        fetchFunction: fetchPlaylistSongs,
        params: [selectedPlaylist?.id, accessToken],
        onSuccess: (data) => {
            if (data && data.length > 0 && contestantNumber > 0) {
                const songs = getRandomSongs(data, contestantNumber)
                dispatch(storeSongs(songs));
                buildBracket(songs, title, contestantNumber);
                setIsBracketBuilt(BracketBuildState.BUILT);
            }
        },
    });
  
    const buildBracket = useBuildBracket();

    const handleGenerateBracket = useCallback(() => {
        if (selectedPlaylist) {
            setIsBracketBuilt(BracketBuildState.BUILDING);
            dispatch(storeSelectedPlaylist(selectedPlaylist));
            dispatch(storeContestantNumber(contestantNumber));
            dispatch(storeBracketTitle(title));
            executeFetchPlaylist();
        }
    }, [dispatch, executeFetchPlaylist, selectedPlaylist, contestantNumber, title]);
    
    const handlePlaylistChange = (playlist: Playlist) => {
        setSelectedPlaylist(playlist);
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

    useEffect(() => {
        if (isBracketBuilt === BracketBuildState.BUILT) {
            navigate('/bracket');
        }
    }, [isBracketBuilt, navigate]);

    return (
        <div className='StartPage'>
            <h1>{STRINGS.START_PAGE.TITLE}</h1>
            <p className='instructions'>{STRINGS.START_PAGE.INSTRUCTIONS}</p>
            <div className='inputs'>
                <input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Bracket title'/>
                <br/>
                <select 
                    value={contestantNumber || ""} 
                    onChange={(e) => setContestantNumber(Number(e.target.value))}
                >
                    <option value="" disabled>{STRINGS.START_PAGE.SELECT_NUMBER_OF_SONGS}</option>
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
                    <option value="" disabled>{STRINGS.START_PAGE.SELECT_PLAYLIST}</option>
                    {playlists.map(playlist => (
                        <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                    ))}
                </select>
                <br/>
                {errorMessage && <p>{errorMessage}</p>}
                <br/>
                <button disabled={errorMessage !== ""} onClick={handleGenerateBracket}>
                    {isBracketBuilt === BracketBuildState.BUILDING ? 
                    <><div className='spinner'/><div className='btnText'>{STRINGS.START_PAGE.LOADING_BRACKET}</div></>
                    : 
                    <>{STRINGS.START_PAGE.GENERATE_BRACKET}</>}
                </button>
            </div>
        </div>
    )
};