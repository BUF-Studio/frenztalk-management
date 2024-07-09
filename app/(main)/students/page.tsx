"use client";

import StudentList from "./studentList";
import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/students/Page.module.scss";

const StudentPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("registered");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    console.log("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.mainContainer}>
      <SearchBar onSearch={handleSearch} />
      <StudentList />
    </div>
  );
};

export default StudentPage;
