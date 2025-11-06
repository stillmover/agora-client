import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useRegisterMutation } from "@/entities/session";
import { registerSchema } from "../lib/schemas";
import { logger } from "@/shared/services";

type UseRegisterFormOptions = {
  redirect?: string;
  onSuccess?: VoidFunction;
};

export const useRegisterForm = ({
  redirect,
  onSuccess,
}: UseRegisterFormOptions = {}) => {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const form = useForm({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    validators: {
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

        if (redirect) {
          router.history.push(redirect);
        } else {
          router.navigate({ to: "/" });
        }
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
