import { Label } from "@/app/components/ui/label"; // Adjust import based on your project structure
import { Input } from "@/app/components/ui/input"; // Adjust import based on your project structure

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  min? : number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "w-full",
  min,
}) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className}
        min={min}
      />
    </div>
  );
};

export default InputField;
