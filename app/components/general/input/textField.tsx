import type React from 'react';
import type { InputHTMLAttributes } from 'react';

interface TextFieldProps extends c {
  label: string;
  id: string;
}

const TextFieldComponent: React.FC<TextFieldProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative h-11 w-full min-w-[200px]">
      <input
        id={id}
        className="peer w-full h-full bg-transparent text-neutral-700 dark:text-neutral-200 font-sans font-normal outline-none focus:outline-none disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-neutral-300 dark:placeholder-shown:border-neutral-600 placeholder-shown:border-t-neutral-300 dark:placeholder-shown:border-t-neutral-600 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-neutral-300 dark:border-neutral-600 focus:border-neutral-900 dark:focus:border-neutral-100"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-neutral-500 dark:peer-placeholder-shown:text-neutral-400 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-neutral-500 dark:peer-disabled:peer-placeholder-shown:text-neutral-400 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-neutral-500 dark:text-neutral-400 peer-focus:text-neutral-900 dark:peer-focus:text-neutral-100 before:border-neutral-300 dark:before:border-neutral-600 peer-focus:before:!border-neutral-900 dark:peer-focus:before:!border-neutral-100 after:border-neutral-300 dark:after:border-neutral-600 peer-focus:after:!border-neutral-900 dark:peer-focus:after:!border-neutral-100"
      >
        {label}
      </label>
    </div>
  );
};

export default TextFieldComponent;
