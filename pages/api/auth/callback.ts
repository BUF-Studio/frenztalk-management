// pages/api/auth/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function callback(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, refresh_token } = response.data;

    res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code for access token' });
  }
}
