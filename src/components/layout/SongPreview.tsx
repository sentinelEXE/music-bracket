// src/components/layouts/SongPreview.tsx
import React from 'react';
import { Song } from '../../types/types';

interface SongPreviewProps {
    song: Song
}

const SongPreview: React.FC<SongPreviewProps> = ({ song }) => {
    return (
        <iframe
            title={song.name}
            src={`https://open.spotify.com/embed/track/${song.id}`}
            width="300"
            height="80"
            frameBorder="0"
            allow="encrypted-media"
        ></iframe>
    );
};

export default SongPreview;