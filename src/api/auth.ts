// src/api/auth.ts
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = API_URL;
const AUTH_URL = 'https://accounts.spotify.com/authorize';

export const getAuthUrl = (): string => {
    const scopes = 'streaming user-read-private user-read-email playlist-modify-public user-modify-playback-state';
    return `${AUTH_URL}?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: scopes,
    })}`;
};

export const fetchAccessToken = async (code: string): Promise<any> => {
    const response = await axios.post('/api/token', { code });
    return response.data;
};

export const refreshAccessToken = async (refreshToken: string): Promise<any> => {
    const response = await axios.post('/api/refresh_token', { refresh_token: refreshToken });
    return response.data;
};

export const isTokenExpired = (): boolean => {
    const tokenExpiry = localStorage.getItem('token_expiry');
    if (!tokenExpiry) return true;
    return new Date().getTime() > parseInt(tokenExpiry, 10);
};
