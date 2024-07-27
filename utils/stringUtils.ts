// utils/stringUtils.ts

/**
 * Capitalizes the first letter of each word in a string.
 * @param str The input string to be capitalized.
 * @returns A new string with the first letter of each word capitalized, or an empty string if input is invalid.
 */
export function capitalizeWords(str: string | null | undefined): string {
  // Check if the input is null, undefined, or not a string
  if (typeof str !== 'string') {
    return '';
  }

  // Trim the string and check if it's empty
  const trimmedStr = str.trim();
  if (trimmedStr === '') {
    return '';
  }

  // Split the string into words
  return trimmedStr
    .split(/\s+/)  // Split on one or more whitespace characters
    // Capitalize the first letter of each word
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // Join the words back into a string
    .join(' ');
}

// Example usage:
// import { capitalizeWords } from '../utils/stringUtils';
// 
// console.log(capitalizeWords('hello world'));  // Output: "Hello World"
// console.log(capitalizeWords('  HELLO   WORLD  '));  // Output: "Hello World"
// console.log(capitalizeWords(''));  // Output: ""
// console.log(capitalizeWords(null));  // Output: ""
// console.log(capitalizeWords(undefined));  // Output: ""