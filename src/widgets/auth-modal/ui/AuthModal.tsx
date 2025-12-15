import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { LoginView, RegisterView, ResetView } from "./views";
import { authModalActions, useAuthModalOpen, useAuthModalView } from "@/shared/stores";
import type { AuthView } from "@/shared/stores";

const fadeAnimation = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  initial: { opacity: 0 },
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
  const isOpen = useAuthModalOpen();
  const view = useAuthModalView();

  const handleSuccess = useCallback(() => {
    authModalActions.close();
  }, []);

  const handleViewChange = useCallback((newView: AuthView) => {
    authModalActions.setView(newView);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      authModalActions.open();
    } else {
      authModalActions.reset();
    }
  }, []);

  const handleOverlayClick = useCallback(() => {
    authModalActions.reset();
  }, []);

  const renderView = () => {
    switch (view) {
      case "login": {
        return <LoginView onSuccess={handleSuccess} onViewChange={handleViewChange} />;
      }
      case "register": {
        return <RegisterView onSuccess={handleSuccess} onViewChange={handleViewChange} />;
      }
      case "reset": {
        return <ResetView onViewChange={handleViewChange} />;
      }
      default: {
        return;
      }
    }
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
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

export const AuthTrigger = () => (
  <Button variant="ghost" size="sm" className="text-lg" onClick={() => authModalActions.open()}>
    Log In
  </Button>
);
