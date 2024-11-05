// src/api/auth.ts
import axios from 'axios';
import qs from 'qs';

const CLIENT_ID = '9f8a10d8cfe74fd8a5f7f8b594d5d422';
const REDIRECT_URI = 'http://localhost:3000/start';
const AUTH_URL = 'https://accounts.spotify.com/authorize';

export const getAuthUrl = (): string => {
    const scopes = 'user-read-private user-read-email playlist-modify-public'; // Add required scopes
    return `${AUTH_URL}?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: scopes,
    })}`;
};

export const fetchAccessToken = async (code: string): Promise<any> => {
    const response = await axios.post('http://localhost:3000/api/token', { code });
    return response.data;
};
