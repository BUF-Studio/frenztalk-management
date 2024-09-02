"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/manage-class-name";
import { SearchBar } from "./input/searchBar";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
  notify?: number;
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  notificationClassName,
  searchTerm,
  setSearchTerm,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  notificationClassName?: string;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
  };

  const [hovering, setHovering] = useState(false);


  //TODO: Optimize this useEffect : kyang
  useEffect(() => {
    setTabs(propTabs);
    setActive((prev) => {
      const newActive = propTabs.find((tab) => tab.value === prev.value);
      return newActive ?? propTabs[0];
    });
  }, [propTabs]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "flex flex-row items-center justify-between [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        <div className="flex flex-row items-center space-x-4">
          {propTabs.map((tab, idx) => (
            <button
              type="button"
              key={tab.title}
              onClick={() => {
                moveSelectedTabToTop(idx);
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={cn(
                "relative flex flex-row px-4 py-2 rounded-full",
                tabClassName
              )}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {active.value === tab.value && (
                <motion.div
                  layoutId="clickedbutton"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  className={cn(
                    "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full ",
                    activeTabClassName
                  )}
                />
              )}

              <span className="relative block text-black dark:text-white">
                {tab.title}
              </span>
              {tab.notify && tab.notify > 0 && (
                <span
                  className={cn(
                    "z-10 bg-red-500 text-xs font-medium text-white",
                    "flex items-center justify-center",
                    "w-5 h-5 rounded-full",
                    active.value === tab.value
                      ? "absolute -top-1 -right-1"
                      : "relative ml-2"
                  )}
                >
                  {tab.notify}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-row items-center space-x-4 mr-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>

      {/* Content display area */}
      <div
        className={cn(
          "mt-4 p-4 bg-white dark:bg-zinc-900 rounded-lg",
          contentClassName
        )}
      >
        {active.content}
      </div>
    </div>
  );
};
