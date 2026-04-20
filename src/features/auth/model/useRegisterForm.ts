import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useRegisterMutation } from "@/entities/session";
import { registerSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

interface UseRegisterFormOptions {
  redirect?: string;
  onSuccess?: VoidFunction;
}

export const useRegisterForm = ({ redirect, onSuccess }: UseRegisterFormOptions = {}) => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await registerMutation.mutateAsync({
          email: value.email,
          password: value.password,
          username: value.username,
        });

        onSuccess?.();

        const targetUrl = redirect ?? "/";
        navigate({ to: targetUrl });
      } catch (error) {
        logger.error("Registration failed", error);
        throw error;
      }
    },
    validators: {
      onBlur: registerSchema,
      onChange: registerSchema,
      onSubmit: registerSchema,
    },
  });

  return {
    error: registerMutation.error,
    form,
    isPending: registerMutation.isPending,
  };
};
