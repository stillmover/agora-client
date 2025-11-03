import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { authActions } from "@/features/auth";
import { uiActions } from "../model/ui.store";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { loginSchema } from "@/features/auth/lib/schemas";
import {
  usePostApiLogin,
  type PostApiLoginMutationResponse,
} from "@/shared/api/endpoints/authentication/authentication";

export const LoginForm = () => {
  const navigate = useNavigate();
  // const search = useSearch({ from: "/_auth/login" }) as { redirect?: string };

  const loginMutation = usePostApiLogin({
    mutation: {
      onSuccess: ({
        usernameOrEmail,
        password,
      }: PostApiLoginMutationResponse) => {
        authActions.login({
          id: crypto.randomUUID(),
          usernameOrEmail,
          password,
        });
        uiActions.closeModal();
        navigate({ to: "/" });
      },
      onError: (error) => {
        console.error("Login failed: ", error);
      },
    },
  });

  const form = useForm({
    defaultValues: { usernameOrEmail: "", password: "" },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      loginMutation.mutate({
        data: {
          usernameOrEmail: value.usernameOrEmail,
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
        <form.Field name="usernameOrEmail">
          {(field) => (
            <FloatingInput
              id={field.name}
              type="text"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              label="Email or username"
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
          Log In
        </Button>
      </form>
    </div>
  );
};
