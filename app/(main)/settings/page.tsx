"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Bell,
  Lock,
  User,
  Globe,
  HelpCircle,
  LogOut,
  Monitor,
} from "lucide-react";

type Theme = "light" | "dark" | "system";

const SettingsPage = () => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    // Check for saved theme preference or default to 'system'
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply the theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // For 'system', check prefers-color-scheme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Save the theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Appearance */}
          <section className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Sun className="mr-2" /> Appearance
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Light Mode</span>
                <button
                  type="button"
                  onClick={() => handleThemeChange("light")}
                  className={`p-2 rounded-full ${
                    theme === "light"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-neutral-700"
                  }`}
                >
                  <Sun size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  type="button"
                  onClick={() => handleThemeChange("dark")}
                  className={`p-2 rounded-full ${
                    theme === "dark"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-neutral-700"
                  }`}
                >
                  <Moon size={20} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>System Preference</span>
                <button
                  type="button"
                  onClick={() => handleThemeChange("system")}
                  className={`p-2 rounded-full ${
                    theme === "system"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-neutral-700"
                  }`}
                >
                  <Monitor size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* Other sections remain the same */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
