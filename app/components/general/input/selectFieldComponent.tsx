import type React from 'react';
import type { SelectHTMLAttributes } from 'react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: { value: string | null; label: string }[];
}

const SelectFieldComponent: React.FC<SelectFieldProps> = ({ label, id, options, ...props }) => {
  return (
    <div className="relative h-11 w-full min-w-[200px]">
      <select
        id={id}
        className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-neutral-300 dark:border-neutral-600 border-t-transparent text-neutral-700 dark:text-neutral-300 outline outline-0 placeholder-shown:border placeholder-shown:border-neutral-300 dark:placeholder-shown:border-neutral-600 placeholder-shown:border-t-neutral-300 dark:placeholder-shown:border-t-neutral-600 focus:border-2 focus:border-neutral-500 dark:focus:border-neutral-400 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value ?? 'default'} value={option.value ?? ''}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-neutral-500 dark:text-neutral-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-neutral-300 dark:before:border-neutral-600 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-neutral-300 dark:after:border-neutral-600 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-neutral-500 dark:peer-placeholder-shown:text-neutral-400 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-neutral-700 dark:peer-focus:text-neutral-300 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-neutral-500 dark:peer-focus:before:!border-neutral-400 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-neutral-500 dark:peer-focus:after:!border-neutral-400 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-neutral-500 dark:peer-disabled:peer-placeholder-shown:text-neutral-400"
      >
        {label}
      </label>
    </div>
  );
};

export default SelectFieldComponent;