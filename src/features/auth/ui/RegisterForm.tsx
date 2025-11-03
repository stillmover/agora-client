import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { authActions } from "@/features/auth";
import { uiActions } from "../model/ui.store";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { registerSchema } from "@/features/auth/lib/schemas";
import {
  usePostApiRegister,
  type PostApiRegisterMutationResponse,
} from "@/shared/api/endpoints/authentication/authentication";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const registerMutation = usePostApiRegister({
    mutation: {
      onSuccess: ({
        usernameOrEmail,
        password,
      }: PostApiRegisterMutationResponse) => {
        authActions.login({
          id: crypto.randomUUID(),
          usernameOrEmail,
          password,
        });
        uiActions.closeModal();
        navigate({ to: "/" });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  });

  const form = useForm({
    defaultValues: { email: "", username: "", password: "" },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate({
        data: {
          email: value.email,
          username: value.username,
          password: value.password,
        },
      });
    },
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="email">
          {(field) => (
            <FloatingInput
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              label="Email"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <form.Field name="username">
          {(field) => (
            <FloatingInput
              id={field.name}
              type="text"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              label="Username"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <FloatingInput
              id={field.name}
              type="password"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              label="Password"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <Button
          type="submit"
          className="w-full"
          disabled={!form.state.canSubmit}
        >
          Continue
        </Button>
      </form>
    </div>
  );
};
