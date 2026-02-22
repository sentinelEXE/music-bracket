// src/api/fetchPlaylists.ts
export const fetchPlaylists = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch playlists');
  }
  const data = await response.json();
  return data.items;
};
