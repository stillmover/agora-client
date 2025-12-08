import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { LoginView, RegisterView, ResetView, type AuthView } from "./views";

const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
};

const CloseButton = () => (
  <DialogPrimitive.Close asChild>
    <button
      aria-label="Close"
      className="absolute right-4 top-4 flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#2a3236] dark:text-white dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
    >
      <X className="h-4 w-4" />
    </button>
  </DialogPrimitive.Close>
);

export const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");

  const handleSuccess = useCallback(() => {
    setOpen(false);
  }, []);

  const handleViewChange = useCallback((newView: AuthView) => {
    setView(newView);
  }, []);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setView("login");
    }
  }, []);

  const handleOverlayClick = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const renderView = () => {
    switch (view) {
      case "login":
        return (
          <LoginView
            onSuccess={handleSuccess}
            onViewChange={handleViewChange}
          />
        );
      case "register":
        return (
          <RegisterView
            onSuccess={handleSuccess}
            onViewChange={handleViewChange}
          />
        );
      case "reset":
        return <ResetView onViewChange={handleViewChange} />;
      default:
        return null;
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="sm" className="text-lg">
          Log In
        </Button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={handleOverlayClick}
                {...fadeAnimation}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                key={view}
                {...fadeAnimation}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div className="relative w-full max-w-lg rounded-[12px] bg-white text-gray-900 dark:bg-[#181c1f] dark:text-[#D7DADC] p-16 pb-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200">
                  <CloseButton />
                  {renderView()}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
