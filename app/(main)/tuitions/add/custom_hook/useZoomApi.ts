import { useState } from "react";
import axios from "axios";
import { ZoomAccount } from "@/lib/models/zoom";


export const useZoomAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the authentication token for a Zoom account
  const authToken = async (zoom: ZoomAccount) => {
    try {
      const response = await axios.post("/api/auth/authorize", {
        clientId: zoom.clientid,
        clientSecret: zoom.clientsecret,
        accountId: zoom.accountid,
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  };

  // Create a new Zoom meeting
  const createZoom = async (
    account: ZoomAccount,
    topic: string,
    start_time: string,
    duration: number,
    localTimeZone: string
  ) => {
    setIsLoading(true);
    try {
      const token = await authToken(account);
      const response = await axios.post("/api/addZoom", {
        accessToken: token,
        topic,
        start_time,
        duration,
        password: null,
        localTimeZone,
      });
      setIsLoading(false);
      return { meetingid: response.data.id, url: response.data.join_url };
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Update an existing Zoom meeting
  const updateZoom = async (
    zoom: ZoomAccount,
    meetingId: string,
    topic: string,
    start_time: string,
    localTimeZone: string,
    duration: number
  ) => {
    setIsLoading(true);
    try {
      const token = await authToken(zoom);
      const response = await axios.post("/api/updateZoom", {
        accessToken: token,
        meetingId,
        topic,
        start_time,
        localTimeZone,
        duration,
        password: null,
        recurrence: null,
      });
      setIsLoading(false);
      if (response.status >= 200 && response.status < 300) {
        return { success: true };
      }
      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
      console.error("Error updating Zoom meeting:", error);
      setIsLoading(false);
      throw error;
    }
  };

  // Get a Zoom account available for the given time range
  const getZoomAcc = (
    zoomStartTime: string,
    duration: number,
    zoomAccounts: ZoomAccount[]
  ): ZoomAccount | null => {
    const newStartTime = new Date(zoomStartTime).getTime();
    const newEndTime = newStartTime + duration * 60 * 1000;

    return (
      zoomAccounts.find((zoom) => {
        if (zoom.meetings.length === 0) return true;
        return (
          zoom.email === "bufstudio2020@gmail.com" && // Adjust this email check as needed
          !zoom.meetings.some((meeting) => {
            const meetingStartTime = new Date(meeting.start).getTime();
            const meetingEndTime =
              meetingStartTime + meeting.duration * 60 * 1000;
            return (
              (newStartTime >= meetingStartTime &&
                newStartTime < meetingEndTime) ||
              (newEndTime > meetingStartTime && newEndTime <= meetingEndTime) ||
              (newStartTime <= meetingStartTime &&
                newEndTime >= meetingEndTime)
            );
          })
        );
      }) || null
    );
  };

  return {
    createZoom,
    updateZoom,
    getZoomAcc,
  };
};
