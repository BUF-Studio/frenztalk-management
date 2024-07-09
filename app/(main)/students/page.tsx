"use client";

import Link from "next/link";
import StudentList from "./studentList";
import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";

const StudentPage = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("registered");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
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
    <div>
      <SearchBar onSearch={handleSearch} />
      <StudentList />
    </div>
    // </StudentsProvider>
  );
};

export default StudentPage;
