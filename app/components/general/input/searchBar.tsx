import { useState } from "react";
import TextFieldComponent from "./textField";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  type ?: string;
  label ?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  type = "text",
  label = "search",
}) => {
  return (
    <TextFieldComponent
      id="search"
      type= {type}
      label= {label}
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value === "" ? "" : e.target.value)
      }
      required
    />
  );
};
