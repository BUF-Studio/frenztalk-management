import { useState, useEffect } from "react";

export const useSearchTableData = (dataList: any[], searchingTerm: string) => {
  const [debouncedTerm, setDebouncedTerm] = useState(searchingTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchingTerm);
    }, 300); // Adjust the delay (in milliseconds) as needed

    // Cleanup function to clear the timeout if searchingTerm changes before the timeout is completed
    return () => {
      clearTimeout(handler);
    };
  }, [searchingTerm]);

  const filteredData = dataList.filter((data) => {
    if (
      debouncedTerm === "" ||
      debouncedTerm === undefined ||
      debouncedTerm === null
    )
      return data;

    const searchInData = (
      data: Record<string, any>,
      searchingTerm: string
    ): boolean => {
      const lowerCaseTerm = searchingTerm.toLowerCase();
      return Object.values(data).some((value) => {
        if (typeof value === 'string' && value.toLowerCase().includes(lowerCaseTerm)) {
          return true;
        }
        return false;
      });
    };

    return searchInData(data, debouncedTerm);
  });

  console.log(filteredData);

  return { filteredData };
};
