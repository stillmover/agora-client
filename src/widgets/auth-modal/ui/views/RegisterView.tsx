import * as DialogPrimitive from "@radix-ui/react-dialog";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import OAuthButtons from "@/features/auth/ui/OAuthButtons";
import Divider from "@/features/auth/ui/Divider";
import { PolicyLinks } from "./PolicyLinks";
import type { AuthViewProps } from "./types";

export const RegisterView = ({ onSuccess, onViewChange }: AuthViewProps) => (
  <div className="text-center space-y-4">
    <DialogPrimitive.Title className="text-2xl font-semibold text-center text-neutral-content-strong mt-0 mb-xs font-bold">
      Sign Up
    </DialogPrimitive.Title>

    <DialogPrimitive.Description className="text-sm text-center my-xs text-gray-600 dark:text-gray-400">
      <PolicyLinks />
    </DialogPrimitive.Description>

    <OAuthButtons />
    <Divider text="OR" />
    <RegisterForm setView={onViewChange} onSuccess={onSuccess} />
  </div>
);
