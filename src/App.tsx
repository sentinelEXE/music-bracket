// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { getAuthUrl, fetchAccessToken, isTokenExpired, refreshAccessToken } from './api/auth';
import { StartPage } from './components/pages/StartPage';
import { BracketPage } from './components/pages/BracketPage';
import { MatchPage } from './components/pages/MatchPage';
import { VictoryPage } from './components/pages/VictoryPage';

const App: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        const handleToken = async () => {
            if (code && !localStorage.getItem('access_token')) {
                try {
                  const data = await fetchAccessToken(code);
                  localStorage.setItem('access_token', data.access_token);
                  localStorage.setItem('refresh_token', data.refresh_token);
                  localStorage.setItem('token_expiry', (new Date().getTime() + data.expires_in * 1000).toString());
                  navigate('/start');
                } catch (error) {
                  console.error('Error fetching access token:', error);
                }
            } else if (!localStorage.getItem('access_token')) {
                window.location.href = getAuthUrl();
            } else if (isTokenExpired()) {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const data = await refreshAccessToken(refreshToken);
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('token_expiry', (new Date().getTime() + data.expires_in * 1000).toString());
                } else {
                    window.location.href = getAuthUrl();
                }
            }
        };

        handleToken();
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
