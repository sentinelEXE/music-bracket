import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert __dirname to ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envFilePath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://192.168.0.43:3000',
}));

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

interface TokenRequestBody {
  code: string;
}

interface RefreshTokenRequestBody {
  refresh_token: string;
}

const fetchAccessToken = async (code: string): Promise<any> => {
  try {
    const response = await axios.post(
      TOKEN_URL,
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error fetching access token:', (error as Error).message);
    }
    throw new Error(error instanceof Error ? error.message : 'An error occurred');
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(TOKEN_URL, 
      qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error refreshing access token:', (error as Error).message);
    }
    throw new Error(error instanceof Error ? error.message : 'An error occurred');
  }
};

app.post('/api/token', async (req: Request<{}, {}, TokenRequestBody>, res: Response) => {
  const { code } = req.body;

  try {
    const data = await fetchAccessToken(code);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/token route:', (error as Error).message);
    res.status(500).send({ message: 'An unexpected error occurred', error: (error as Error).message });
  }
});

app.post('/api/refresh_token', async (req: Request<{}, {}, RefreshTokenRequestBody>, res: Response) => {
  const { refresh_token } = req.body;

  try {
    const data = await refreshAccessToken(refresh_token);
    res.json(data);
  } catch (error) {
    console.error('Error in /api/refresh_token route:', (error as Error).message);
    res.status(500).send({ message: 'An unexpected error occurred', error: (error as Error).message });
  }
});

app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));