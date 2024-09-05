"use client";

import React from "react";
import ViewZoom from "./components/viewZoom";

const SettingsPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <ViewZoom />
    </div>
  );
};

export default SettingsPage;
