import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useLoginMutation } from "@/entities/session";
import { loginSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

interface UseLoginFormOptions {
  redirect?: string;
  onSuccess?: VoidFunction;
}

export const useLoginForm = ({ redirect, onSuccess }: UseLoginFormOptions = {}) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const form = useForm({
    defaultValues: {
      password: "",
      usernameOrEmail: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync({
          password: value.password,
          usernameOrEmail: value.usernameOrEmail,
        });

        onSuccess?.();

        const targetUrl = redirect ?? "/";
        navigate({ to: targetUrl });
      } catch (error) {
        logger.error("Login failed", error);
        throw error;
      }
    },
    validators: {
      onBlur: loginSchema,
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
  });

  return {
    error: loginMutation.error,
    form,
    isPending: loginMutation.isPending,
  };
};
