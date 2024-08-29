import type React from "react";
import type { InputHTMLAttributes } from "react";

interface CheckboxFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const CheckboxFieldComponent: React.FC<CheckboxFieldProps> = ({
  label,
  id,
  ...props
}) => {
  if (!label) {
    throw new Error("Checkbox label cannot be empty");
  }

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        id={id}
        className="peer appearance-none w-5 h-5 border border-neutral-300 dark:border-neutral-600 rounded-md checked:bg-red-500 checked:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 transition-all duration-200"
        {...props}
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 peer-disabled:text-neutral-500 dark:peer-disabled:text-neutral-400 select-none"
      >
        {label}
      </label>
      <svg
        className="absolute w-4 h-4 text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <title>Checkbox tick</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};

export default CheckboxFieldComponent;