// src/api/auth.ts
import axios from 'axios';
import qs from 'qs';

const CLIENT_ID = '9f8a10d8cfe74fd8a5f7f8b594d5d422';
const CLIENT_SECRET = '7aaeae8b89d642b7a0c7dfe4a7b65d87';
const REDIRECT_URI = 'http://localhost:3000/start';
const AUTH_URL = 'https://accounts.spotify.com/authorize';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

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
    const response = await axios.post(TOKEN_URL, qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET, // Be cautious with this!
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};
