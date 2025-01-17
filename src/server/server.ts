import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import https from 'https';
import fs from 'fs';

// Convert __dirname to ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envFilePath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

const app = express();
app.use(express.json());

const corsOptions = {
  origin: `https://${process.env.HOST}:${process.env.PORT}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

interface TokenRequestBody {
  code: string;
}

interface RefreshTokenRequestBody {
  refresh_token: string;
}

app.post('/api/token', async (req: Request<{}, {}, TokenRequestBody>, res: Response) => {
  const { code } = req.body;
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
    res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error fetching access token:', (error as Error).message);
    }
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
});

app.post('/api/refresh_token', async (req: Request<{}, {}, RefreshTokenRequestBody>, res: Response) => {
  const { refresh_token } = req.body;
  try {
    const response = await axios.post(
      TOKEN_URL,
      qs.stringify({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error refreshing access token:', (error as Error).message);
    }
    res.status(500).json({ error: 'Failed to refresh access token' });
  }
});

app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

app.options('*', cors());

const API_PORT = 3001;
const HOST = process.env.HOST;

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '../../server.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../server.crt')),
};

https.createServer(httpsOptions, app).listen(API_PORT, HOST, () => {
  console.log(`Server running on https://${HOST}:${API_PORT}`);
});
