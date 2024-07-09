// components/SearchBar.tsx
import { useState, useEffect, type ChangeEvent } from "react";
import styles from "@/styles/components/dashboard/SearchBar.module.scss";

interface SearchBarProps {
  onSearch: (keyword: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        onSearch(e.target.value);
      }, 1000),
    );
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchInput}
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Search keyword"
      />
    </div>
  );
};

export default SearchBar;
