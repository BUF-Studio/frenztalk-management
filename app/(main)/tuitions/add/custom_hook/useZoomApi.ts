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
    startTime: string,
    duration: number,
    repeatWeeks: number,
    zoomAccounts: ZoomAccount[]
  ): ZoomAccount | null => {
    const baseStartTime = new Date(startTime).getTime();

    console.log("Base Start Time:", baseStartTime);

    return (
      zoomAccounts.find((zoom) => {
        console.log("Checking Zoom Account:", zoom.id);

        // Check across all weeks for conflicts
        for (let i = 0; i < repeatWeeks; i++) {
          const newStartTime = baseStartTime + i * 7 * 24 * 60 * 60 * 1000; // Each new start time, week by week
          const newEndTime = newStartTime + duration * 60 * 1000;

          console.log(`Week ${i + 1}: Checking newStartTime: ${new Date(newStartTime).toISOString()}, newEndTime: ${new Date(newEndTime).toISOString()}`);

          const conflict = zoom.meetings.some((meeting) => {
            const meetingStartTime = new Date(meeting.start).getTime();
            const meetingEndTime = meetingStartTime + meeting.duration * 60 * 1000;

            console.log("Comparing with Meeting:", {
              meetingStartTime: new Date(meetingStartTime).toISOString(),
              meetingEndTime: new Date(meetingEndTime).toISOString(),
            });

            // Check if the new meeting conflicts with this meeting
            const isConflicting =
              (newStartTime >= meetingStartTime && newStartTime < meetingEndTime) ||
              (newEndTime > meetingStartTime && newEndTime <= meetingEndTime) ||
              (newStartTime <= meetingStartTime && newEndTime >= meetingEndTime);

            if (isConflicting) {
              console.log("Conflict found with meeting:", {
                meetingStartTime: new Date(meetingStartTime).toISOString(),
                meetingEndTime: new Date(meetingEndTime).toISOString(),
              });
            }

            return isConflicting;
          });

          // If any conflict is found for any week, skip this account
          if (conflict) {
            console.log(`Conflict found in week ${i + 1} for Zoom Account: ${zoom.id}`);
            return false; // Break and move to the next Zoom account
          }
        }

        // No conflicts found, return this Zoom account
        console.log("No conflicts found for Zoom Account:", zoom.id);
        return true;
      }) || null
    );
  };

  const deleteZoom = async (
    zoom: ZoomAccount,
    meetingId: string,

  ) => {
    try {
      const token = await authToken(zoom);
      const response = await axios.post("/api/deleteZoom", {
        accessToken: token,
        meetingId,

      });
      if (response.status >= 200 && response.status < 300) {
        return { success: true };
      }
      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
      console.error("Error updating Zoom meeting:", error);
      throw error;
    }
  };

  return {
    createZoom,
    updateZoom,
    getZoomAcc,
    deleteZoom,
  };
};
