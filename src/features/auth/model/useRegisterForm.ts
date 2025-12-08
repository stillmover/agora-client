import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useRegisterMutation } from "@/entities/session";
import { registerSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

type UseRegisterFormOptions = {
  redirect?: string;
  onSuccess?: VoidFunction;
};

/**
 * Form hook for registration using TanStack Form + TanStack Query mutation.
 * Optimized to only validate on blur and submit (not onChange).
 */
export const useRegisterForm = ({
  redirect,
  onSuccess,
}: UseRegisterFormOptions = {}) => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    validators: {
      // Only validate on blur and submit to reduce re-renders
      onBlur: registerSchema,
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await registerMutation.mutateAsync({
          email: value.email,
          username: value.username,
          password: value.password,
        });

        onSuccess?.();

        const targetUrl = redirect ?? "/";
        navigate({ to: targetUrl });
      } catch (error) {
        logger.error("Registration failed", error);
        throw error;
      }
    },
  });

  return {
    form,
    isPending: registerMutation.isPending,
    error: registerMutation.error,
  };
};
