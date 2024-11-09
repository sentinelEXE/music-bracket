import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';


export const BracketPage: React.FC = () => {
    const selectedPlaylist = useSelector((state: any) => state.selectedPlaylist);

    useEffect(() => {
        console.log({SelectedPlaylist: selectedPlaylist});
    }, [selectedPlaylist]);

    return (
        <div>
            {/* Render your component's content here */}
        </div>
    );
};
