// src/components/pages/MatchPage.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Playlist, Song } from '../../types/types';
import { getRandomSongs } from '../../utils/get-random-songs';

declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: any) => void;
  }
}



export const MatchPage: React.FC = () => {
    const songs = useSelector((state: any) => state.songs) as Song[];
    const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  
    useEffect(() => {
      if (songs.length > 0) {
        const randomSongs = getRandomSongs(songs, 2);
        setSelectedSongs(randomSongs);
      }
    }, [songs]);

    window.onSpotifyIframeApiReady = (IFrameAPI) => {
        const element = document.getElementById('song1');
        const options = {
            uri: selectedSongs[0].uri
          };
        const callback = (EmbedController: any) => {};
        IFrameAPI.createController(element, options, callback);
      };
  
    return (
      <div>
        <script src="https://open.spotify.com/embed/iframe-api/v1" async></script>
        <h1>Match Page</h1>
        {selectedSongs.length === 2 ? (
          <div>
            <div>
              <h2>{selectedSongs[0].name}</h2>
              <p>by {selectedSongs[0].artists.map(artist => artist.name).join(', ')}</p>
              {selectedSongs[0].preview_url && (
                <iframe
                  title='song1'
                  id='song1'
                  width="300"
                  height="80"
                  allow="encrypted-media"
                ></iframe>
              )}
            </div>
            <div>
              <h2>{selectedSongs[1].name}</h2>
              <p>by {selectedSongs[1].artists.map(artist => artist.name).join(', ')}</p>
              {selectedSongs[1].preview_url && (
                <iframe
                  title='song2'
                  id='song2'
                  width="300"
                  height="80"
                  allow="encrypted-media"
                ></iframe>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };
