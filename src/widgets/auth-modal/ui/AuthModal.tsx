import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { ResetForm } from "@/features/auth/ui/ResetForm";
import OAuthButtons from "@/features/auth/ui/OAuthButtons";
import Divider from "@/features/auth/ui/Divider";

export const AuthModal = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"login" | "register" | "reset">("login");

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="sm">
          Log In
        </Button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 flex items-center justify-center z-50"
              >
                <div
                  className="relative w-full max-w-lg rounded-[12px]
                              bg-white text-gray-900 
                              dark:bg-[#181c1f] dark:text-[#D7DADC]
                              p-16 pb-6 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-200"
                >
                  <DialogPrimitive.Close asChild>
                    <button
                      aria-label="Close"
                      className={`
                              absolute right-4 top-4 flex items-center justify-center
                              h-8 w-8 rounded-full
                              bg-gray-200 text-gray-800 
                              hover:bg-gray-300
                              dark:bg-[#2a3236] dark:text-white dark:hover:bg-gray-600
                              transition-all duration-200 cursor-pointer
                            `}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogPrimitive.Close>

                  {view === "login" && (
                    <div className="text-center space-y-4">
                      <DialogPrimitive.Title className="text-2xl font-semibold text-center text-neutral-content-strong mt-0 mb-xs font-bold">
                        Log In
                      </DialogPrimitive.Title>

                      <DialogPrimitive.Description className="text-sm text-center my-xs text-gray-600 dark:text-gray-400">
                        By continuing, you agree to our{" "}
                        <a
                          href="/user-agreement"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          User Agreement
                        </a>{" "}
                        and acknowledge that you understand the{" "}
                        <a
                          href="/privacy-policy"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Privacy Policy
                        </a>
                        .
                      </DialogPrimitive.Description>

                      <OAuthButtons showEmailLink />
                      <Divider text="OR" />
                      <LoginForm setView={setView} onSuccess={handleSuccess} />
                    </div>
                  )}

                  {view === "register" && (
                    <div className="text-center space-y-4">
                      <DialogPrimitive.Title className="text-2xl font-semibold text-center text-neutral-content-strong mt-0 mb-xs font-bold">
                        Sign Up
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="text-sm text-center my-xs text-gray-600 dark:text-gray-400">
                        By continuing, you agree to our{" "}
                        <a
                          href="/user-agreement"
                          className="text-blue-600 hover:underline dark:text-blue-400 dark:text-[#b7cad4]"
                        >
                          User Agreement
                        </a>{" "}
                        and acknowledge that you understand the{" "}
                        <a
                          href="/privacy-policy"
                          className="text-blue-600 hover:underline dark:text-blue-400 dark:text-[#b7cad4]"
                        >
                          Privacy Policy
                        </a>
                        .
                      </DialogPrimitive.Description>
                      <OAuthButtons />
                      <Divider text="OR" />
                      <RegisterForm
                        setView={setView}
                        onSuccess={handleSuccess}
                      />
                    </div>
                  )}

                  {view === "reset" && (
                    <>
                      <button
                        onClick={() => setView("login")}
                        aria-label="Back"
                        className={`
                              absolute left-4 top-4 flex items-center justify-center
                              h-8 w-8 rounded-full
                              text-gray-800 
                              hover:bg-gray-300
                              dark:text-white dark:hover:bg-gray-600
                              transition-all duration-200 cursor-pointer
                            `}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <DialogPrimitive.Title className="text-2xl font-semibold text-center text-neutral-content-strong mt-0 mb-xs font-bold">
                        Reset Password
                      </DialogPrimitive.Title>

                      <DialogPrimitive.Description className="text-sm text-center my-xs mb-2">
                        Enter your email address or username and we’ll send you
                        a link to reset your password
                      </DialogPrimitive.Description>
                      <div className="text-center space-y-4 mt-4 mb-4">
                        <ResetForm />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
