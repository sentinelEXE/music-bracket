// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { getAuthUrl, fetchAccessToken } from './api/auth';
import { StartPage } from './components/StartPage';
import { BracketPage } from './components/BracketPage';
import { MatchPage } from './components/MatchPage';
import { VictoryPage } from './components/VictoryPage';

const App: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            fetchAccessToken(code).then((data) => {
                // Save the access token and refresh token in local storage
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                navigate('/start'); // Redirect to the start page
            });
        } else if (!localStorage.getItem('access_token')) {
            // Redirect to Spotify authentication if no access token
            window.location.href = getAuthUrl();
        }
    }, [navigate]);

    return (
        <Routes>
            <Route path="/start" element={<StartPage />} />
            <Route path="/bracket" element={<BracketPage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/victory" element={<VictoryPage />} />
            <Route path="*" element={<Navigate to="/start" replace />} />
        </Routes>
    );
};

const AppWrapper: React.FC = () => (
    <Router>
        <App />
    </Router>
);

export default AppWrapper;
