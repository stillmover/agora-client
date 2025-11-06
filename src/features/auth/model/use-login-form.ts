import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useLoginMutation } from "@/entities/session";
import { loginSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

type UseLoginFormOptions = {
  redirect?: string;
  onSuccess?: VoidFunction;
};

export const useLoginForm = ({
  redirect,
  onSuccess,
}: UseLoginFormOptions = {}) => {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const form = useForm({
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
      onBlur: loginSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await loginMutation.mutateAsync({
          usernameOrEmail: value.usernameOrEmail,
          password: value.password,
        });

        onSuccess?.();

        const targetUrl = redirect ?? "/";
        router.history.push(targetUrl);
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
