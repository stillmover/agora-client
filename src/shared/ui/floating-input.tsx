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
  ...props
}: FloatingInputProps) => (
  <div className="relative">
    <Input
      id={id}
      {...props}
      className={cn(
        `peer ${props.value ? "placeholder:opacity-0" : ""}`,
        className,
      )}
    />
    <label
      htmlFor={id}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
        peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
        peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary"
    >
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <FormErrorText>{error}</FormErrorText>
  </div>
);
