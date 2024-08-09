// pages/api/createMeeting.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type MeetingRequestBody = {
    topic: string;
    start_time: string;
    duration: number;
    password?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { topic, start_time, duration, password }: MeetingRequestBody = req.body;

        // Replace 'YOUR_OAUTH_ACCESS_TOKEN' with the access token you obtained
        const accessToken = "eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6ImUyMTdjZDBmLWYyNzQtNDUyNi04MGRmLTg2OGYwYjJiZmJjNSJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ3c1NNbHRqcFNfR1BpaDVQeXR1V05RIiwidmVyIjo5LCJhdWlkIjoiMjVlNTYzMjE0NGI5ZDY4NTZjMWUxODYyZGZjMGE2NzQiLCJuYmYiOjE3MjMwMzk2MjAsImNvZGUiOiI1aGRib1p5blE0T0RiSDh1WXRJazRnc0U4dmRWYm9GTHciLCJpc3MiOiJ6bTpjaWQ6RFpxR3FnR1VTUGFXZ3M1QmdyenpRIiwiZ25vIjowLCJleHAiOjE3MjMwNDMyMjAsInR5cGUiOjMsImlhdCI6MTcyMzAzOTYyMCwiYWlkIjoiNThsZHl0T1dTSVdvdjZ0ZzhpWWRjQSJ9.yGp-C4w8Calp8070gN9YvD5GYtrF-oz1WM_IjX-fGuvfG9idKWY5iE3QJDIvtPawrvrP8uux661O9i7DteEYfQ";

        if (!accessToken) {
            return res.status(500).json({ error: 'OAuth access token is not available' });
        }

        try {
            const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
                topic,
                type: 2, // Scheduled meeting
                start_time,
                duration,
                password
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            // console.log(response.data)

            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error creating Zoom meeting:', error.message);
            console.error('Error details:', error.response?.data || error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
