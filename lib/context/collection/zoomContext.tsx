'use client';

import { AppProps } from "next/app";
import type { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ZoomAccount } from "@/lib/models/zoom";
import { updateZoomAccount, zoomAccountStream } from "@/lib/firebase/zoomAccount";

type ZoomAccountsContextType = {
  zoomAccounts: ZoomAccount[];
};

const initialContext: ZoomAccountsContextType = {
  zoomAccounts: [],
};
// Create a context to hold the data
const ZoomAccountsContext = createContext<ZoomAccountsContextType>(initialContext);

export const useZoomAccounts = () => useContext(ZoomAccountsContext);

function ZoomAccountsProvider({ children }: ScriptProps) {
  const [zoomAccounts, setZoomAccounts] = useState<ZoomAccount[]>([]);

  const cleanOldMeetings = (zoomAccounts: ZoomAccount[]) => {
    const now = new Date().getTime();
    const timeThreshold = now - 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // let meetingsRemoved = false;

    zoomAccounts.forEach(zoom => {
      const originalLength = zoom.meetings.length;
      zoom.meetings = zoom.meetings.filter(meeting => {
        const meetingStartTime = new Date(meeting.start).getTime();
        return meetingStartTime >= timeThreshold;
      });

      if (zoom.meetings.length < originalLength) {
        const newZoom = new ZoomAccount(zoom.id, zoom.email, zoom.clientid, zoom.clientsecret, zoom.accountid, zoom.meetings)
        updateZoomAccount(newZoom)

      }
    });

    // return meetingsRemoved;
  }


  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (zoomAccounts: ZoomAccount[]) => {
      console.log(zoomAccounts);
      setZoomAccounts(zoomAccounts);
      cleanOldMeetings(zoomAccounts)
    };
    const unsubscribe = zoomAccountStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <ZoomAccountsContext.Provider value={{ zoomAccounts }}>
      {children}
    </ZoomAccountsContext.Provider>
  );
}

export default ZoomAccountsProvider;
