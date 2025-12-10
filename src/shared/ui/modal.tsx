import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const overlayVariants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 }, y: 10 },
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { damping: 25, stiffness: 300, type: "spring" },
    y: 0,
  },
};

interface ModalContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
};

interface ModalProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Modal = ({ children, open, onOpenChange, defaultOpen }: ModalProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );

  return (
    <ModalContext.Provider value={{ onOpenChange: handleOpenChange, open: isOpen }}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </DialogPrimitive.Root>
    </ModalContext.Provider>
  );
};

const ModalTrigger = DialogPrimitive.Trigger;

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
}

const sizeClasses = {
  full: "max-w-4xl",
  lg: "max-w-lg",
  md: "max-w-md",
  sm: "max-w-sm",
  xl: "max-w-xl",
};

const ModalContent = ({
  children,
  className,
  size = "lg",
  showCloseButton = true,
}: ModalContentProps) => {
  const { open, onOpenChange } = useModalContext();

  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal forceMount>
          <DialogPrimitive.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => onOpenChange(false)}
            />
          </DialogPrimitive.Overlay>

          <DialogPrimitive.Content asChild>
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className={cn(
                  "relative w-full rounded-2xl bg-white shadow-2xl dark:bg-zinc-900",
                  "ring-1 ring-black/5 dark:ring-white/10",
                  "max-h-[90vh] overflow-hidden",
                  sizeClasses[size],
                  className
                )}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {showCloseButton && (
                  <DialogPrimitive.Close asChild>
                    <button
                      aria-label="Close modal"
                      className={cn(
                        "absolute right-4 top-4 z-10",
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        "bg-zinc-100 text-zinc-500 transition-all",
                        "hover:bg-zinc-200 hover:text-zinc-700",
                        "dark:bg-zinc-800 dark:text-zinc-400",
                        "dark:hover:bg-zinc-700 dark:hover:text-zinc-200",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                        "dark:focus:ring-offset-zinc-900",
                        "cursor-pointer"
                      )}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogPrimitive.Close>
                )}
                {children}
              </motion.div>
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const ModalHeader = ({ children, className }: ModalHeaderProps) => (
  <div
    className={cn(
      "sticky top-0 z-10 border-b border-zinc-200 bg-white px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900",
      className
    )}
  >
    {children}
  </div>
);

interface ModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

const ModalTitle = ({ children, className }: ModalTitleProps) => (
  <DialogPrimitive.Title
    className={cn(
      "text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
      className
    )}
  >
    {children}
  </DialogPrimitive.Title>
);

interface ModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const ModalDescription = ({ children, className }: ModalDescriptionProps) => (
  <DialogPrimitive.Description
    className={cn("mt-1 text-sm text-zinc-500 dark:text-zinc-400", className)}
  >
    {children}
  </DialogPrimitive.Description>
);

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={cn("overflow-y-auto px-6 py-6", className)}>{children}</div>
);

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ModalFooter = ({ children, className }: ModalFooterProps) => (
  <div
    className={cn(
      "sticky bottom-0 flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50",
      className
    )}
  >
    {children}
  </div>
);

Modal.Trigger = ModalTrigger;
Modal.Content = ModalContent;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
