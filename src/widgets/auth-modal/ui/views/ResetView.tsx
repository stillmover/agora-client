import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft } from "lucide-react";
import { ResetForm } from "@/features/auth/ui/ResetForm";
import type { AuthViewProps } from "./types";

export const ResetView = ({ onViewChange }: Omit<AuthViewProps, "onSuccess">) => (
  <>
    <button
      onClick={() => onViewChange("login")}
      aria-label="Back"
      className="absolute left-4 top-4 flex items-center justify-center h-8 w-8 rounded-full text-gray-800 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
    >
      <ArrowLeft size={20} />
    </button>

    <DialogPrimitive.Title className="text-2xl font-semibold text-center text-neutral-content-strong mt-0 mb-xs font-bold">
      Reset Password
    </DialogPrimitive.Title>

    <DialogPrimitive.Description className="text-sm text-center my-xs mb-2">
      Enter your email address or username and we&apos;ll send you a link to reset your password
    </DialogPrimitive.Description>

    <div className="text-center space-y-4 mt-4 mb-4">
      <ResetForm />
    </div>
  </>
);
