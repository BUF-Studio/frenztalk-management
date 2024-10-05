// pages/api/createMeeting.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type MeetingRequestBody = {
    accessToken: string;
    meetingId: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { accessToken, meetingId }: MeetingRequestBody = req.body;

        // Replace 'YOUR_OAUTH_ACCESS_TOKEN' with the access token you obtained
        // const accessToken = "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImUyMTdjZDBmLWYyNzQtNDUyNi04MGRmLTg2OGYwYjJiZmJjNSJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ3c1NNbHRqcFNfR1BpaDVQeXR1V05RIiwidmVyIjo5LCJhdWlkIjoiMjVlNTYzMjE0NGI5ZDY4NTZjMWUxODYyZGZjMGE2NzQiLCJuYmYiOjE3MjMwMzk2MjAsImNvZGUiOiI1aGRib1p5blE0T0RiSDh1WXRJazRnc0U4dmRWYm9GTHciLCJpc3MiOiJ6bTpjaWQ6RFpxR3FnR1VTUGFXZ3M1QmdyenpRIiwiZ25vIjowLCJleHAiOjE3MjMwNDMyMjAsInR5cGUiOjMsImlhdCI6MTcyMzAzOTYyMCwiYWlkIjoiNThsZHl0T1dTSVdvdjZ0ZzhpWWRjQSJ9.yGp-C4w8Calp8070gN9YvD5GYtrF-oz1WM_IjX-fGuvfG9idKWY5iE3QJDIvtPawrvrP8uux661O9i7DteEYfQ";

        if (!accessToken) {
            return res.status(500).json({ error: 'OAuth access token is not available' });
        }

        try {
            const response = await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            // console.log(response.data)

            return res.status(200).json(response.data);
        } catch (error: any) {
            console.error('Error delete Zoom meeting:', error.message);
            if (error.response) {

                // More detailed error information from the response
                console.error('Response data:', error.response.data);
                return res.status(error.response.status).json({ error: error.response.data.message });
            } else {
                // General error handling
                return res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
