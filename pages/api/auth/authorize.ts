import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type TokenRequestBody = {
  clientId: string;
  clientSecret: string;
  accountId: string;

};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { clientId, clientSecret, accountId } :TokenRequestBody= req.body;


  if (!clientId || !clientSecret || !accountId) {
    return res.status(400).json({ error: 'Missing environment variables' });
  }

  const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'account_credentials');
    params.append('account_id', accountId);

    const response = await axios.post('https://zoom.us/oauth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    const { access_token } = response.data;
    return res.status(200).json({ access_token });
  } catch (error) {
    console.error('Error fetching access token:', error);
    return res.status(500).json({ error: 'Failed to fetch access token' });
  }
}
