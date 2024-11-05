import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';

// Convert __dirname to ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envFilePath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: envFilePath });

const app = express();
app.use(express.json());

const TOKEN_URL = 'https://accounts.spotify.com/api/token';

interface TokenRequestBody {
  code: string;
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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));