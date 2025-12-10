import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string | undefined) => void;
  variant?: "circle" | "rectangle" | "banner";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  removable?: boolean;
  accept?: string;
}

const sizeConfig = {
  lg: {
    banner: "h-40 w-full",
    circle: "h-32 w-32",
    icon: "h-6 w-6",
    rectangle: "h-32 w-32",
    text: "text-sm",
  },
  md: {
    banner: "h-32 w-full",
    circle: "h-24 w-24",
    icon: "h-5 w-5",
    rectangle: "h-24 w-24",
    text: "text-sm",
  },
  sm: {
    banner: "h-20 w-full",
    circle: "h-16 w-16",
    icon: "h-4 w-4",
    rectangle: "h-16 w-16",
    text: "text-xs",
  },
};

export const ImageUpload = ({
  value,
  onChange,
  variant = "circle",
  size = "md",
  placeholder = "Upload image",
  className,
  disabled = false,
  removable = true,
  accept = "image/*",
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const config = sizeConfig[size];

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFile = React.useCallback(
    (file: File) => {
      setIsLoading(true);
      const reader = new FileReader();
      const handleLoad = (event: ProgressEvent<FileReader>) => {
        onChange?.(event.target?.result as string);
        setIsLoading(false);
        reader.removeEventListener("load", handleLoad);
        reader.removeEventListener("error", handleError);
      };
      const handleError = () => {
        setIsLoading(false);
        reader.removeEventListener("load", handleLoad);
        reader.removeEventListener("error", handleError);
      };

      reader.addEventListener("load", handleLoad);
      reader.addEventListener("error", handleError);
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleRemove = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.();
    },
    [onChange]
  );

  return (
    <div className={cn("relative inline-block", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      <motion.button
        type="button"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          "border-2 border-dashed",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variant === "circle" && "rounded-full",
          variant === "rectangle" && "rounded-xl",
          variant === "banner" && "rounded-xl",
          config[variant],
          isDragging
            ? "border-primary bg-primary/5"
            : value
              ? "border-transparent"
              : "border-border bg-muted/50 hover:border-muted-foreground/50 hover:bg-muted",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full items-center justify-center"
            >
              <Loader2 className={cn("animate-spin text-muted-foreground", config.icon)} />
            </motion.div>
          ) : value ? (
            <motion.img
              key="image"
              src={value}
              alt="Uploaded image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground"
            >
              {variant === "banner" ? (
                <ImagePlus className={config.icon} />
              ) : (
                <Camera className={config.icon} />
              )}
              {variant !== "circle" && (
                <span className={cn("font-medium", config.text)}>{placeholder}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {value && !disabled && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/50 opacity-0 transition-opacity hover:opacity-100",
              variant === "circle" && "rounded-full",
              variant !== "circle" && "rounded-xl"
            )}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </motion.button>

      {value && removable && !disabled && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={handleRemove}
          className={cn(
            "absolute -right-1 -top-1 z-10",
            "flex h-6 w-6 items-center justify-center rounded-full",
            "bg-foreground text-background shadow-lg transition-transform",
            "hover:scale-110 hover:bg-destructive",
            "focus:outline-none focus:ring-2 focus:ring-destructive",
            "cursor-pointer"
          )}
        >
          <X className="h-3 w-3" />
        </motion.button>
      )}
    </div>
  );
};
