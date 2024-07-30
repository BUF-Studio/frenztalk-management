"use client";

import { educationLevelStream } from "@/lib/firebase/educationLevel";
import type { EducationLevel } from "@/lib/models/educationLevel";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit, Trash2 } from "lucide-react";
import styles from "./Page.module.scss";

const EducationLevelList = () => {
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [expandedSyllabus, setSyllabus] = useState<string[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribeEducationLevels = educationLevelStream(
      (updatedEducationLevels) => {
        setEducationLevels(updatedEducationLevels);
      }
    );

    return () => unsubscribeEducationLevels();
  }, []);

  const toggleSyllabus = (categoryId: string) => {
    setSyllabus((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleLevel = (levelId: string) => {
    setExpandedLevels((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  const renderLevel = (level: string) => (
    <div className="mb-2 last:mb-0 border border-gray-200 rounded">
      <div className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100">
        <span className="flex-grow ml-2">{level}</span>
        <div className="flex space-x-2">
          <Edit
            size={16}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
          <Trash2
            size={16}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderEducationLevel = (educationLevel: EducationLevel) => (
    <div
      key={educationLevel.id}
      className="mb-4 last:mb-0 border border-gray-300 rounded shadow"
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="flex items-center justify-between p-4 bg-gray-100 cursor-pointer hover:bg-gray-200"
        onClick={() =>
          toggleSyllabus(educationLevel.id ? educationLevel.id : "")
        }
      >
        {expandedSyllabus.includes(
          educationLevel.id ? educationLevel.id : ""
        ) ? (
          <ChevronDown size={24} />
        ) : (
          <ChevronRight size={24} />
        )}
        <span className="flex-grow ml-2 font-semibold">
          {educationLevel.name}
        </span>
        <div className="flex space-x-2">
          <Plus
            size={20}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
          <Edit
            size={20}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
          <Trash2
            size={20}
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
          />
        </div>
      </div>
      {expandedSyllabus.includes(
        educationLevel.id ? educationLevel.id : ""
      ) && <div className="p-4">{educationLevel.levels.map(renderLevel)}</div>}
    </div>
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Education Level</h2>
        <p>Manage your education levels here</p>
      </div>
      <div className={styles.cardContent}>
        {educationLevels.map(renderEducationLevel)}
      </div>
    </div>
  );
};

export default EducationLevelList;
