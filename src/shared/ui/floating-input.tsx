import { Input } from "@/shared/ui/input";
import { FormErrorText } from "@/shared/ui/form-error-text";
import { cn } from "@/shared/lib/utils";

interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FloatingInput = ({
  id,
  label,
  error,
  required,
  className,
  value,
  ...props
}: FloatingInputProps) => (
  <div className="relative">
    <Input
      id={id}
      value={value}
      placeholder=" "
      {...props}
      className={cn(
        "peer rounded-full h-12 px-6 text-sm bg-[#E5EBEE] hover:bg-[#DBE4E9] dark:border-none dark:bg-[#2a3236] h-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        error && "border-destructive focus-visible:ring-destructive/50",
        className,
      )}
    />

    <label
      htmlFor={id}
      className={cn(
        "absolute left-6 text-gray-400 text-sm text-[#181C1F] transition-all duration-200 ease-out pointer-events-none",
        "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 dark:peer-placeholder-shown:text-[#D7DADC]",
        (value || props?.autoFocus) &&
          "top-1 -translate-y-1 text-xs text-gray-600 dark:text-[#D7DADC]",
        "peer-focus:top-1 peer-focus:-translate-y-1 peer-focus:text-xs peer-focus:text-gray-600",
      )}
    >
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <FormErrorText>{error}</FormErrorText>
  </div>
);
