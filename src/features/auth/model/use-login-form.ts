import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "@/entities/session";
import { loginSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

type UseLoginFormOptions = {
  redirect?: string;
  onSuccess?: VoidFunction;
};

/**
 * Form hook for login using TanStack Form + TanStack Query mutation.
 * Optimized to only validate on blur and submit (not onChange).
 */
export const useLoginForm = ({
  redirect,
  onSuccess,
}: UseLoginFormOptions = {}) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const form = useForm({
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
    validators: {
      // Only validate on blur and submit to reduce re-renders
      onBlur: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync({
          usernameOrEmail: value.usernameOrEmail,
          password: value.password,
        });

        onSuccess?.();

        const targetUrl = redirect ?? "/";
        navigate({ to: targetUrl });
      } catch (error) {
        logger.error("Login failed", error);
        throw error;
      }
    },
  });

  return {
    form,
    isPending: loginMutation.isPending,
    error: loginMutation.error,
  };
};
