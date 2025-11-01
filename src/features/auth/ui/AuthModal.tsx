import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";

export const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm">
          Log In
        </Button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div
                  className="relative w-full max-w-md rounded-[12px]
                              bg-white text-gray-900 
                              dark:bg-[#1A1A1B] dark:text-[#D7DADC]
                              p-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200"
                >
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close"
                      className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 transition"
                    >
                      <X className="h-5 w-5 cursor-pointer" />
                    </button>
                  </Dialog.Close>

                  {view === "login" ? (
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-semibold">Log In</h2>
                      <p className="text-sm text-gray-600">
                        New to Reddit?{" "}
                        <button
                          onClick={() => setView("register")}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <h2 className="text-xl font-semibold">Sign Up</h2>
                      <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          onClick={() => setView("login")}
                          className="text-blue-600 hover:underline cursor-pointer"
                        >
                          Log In
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
