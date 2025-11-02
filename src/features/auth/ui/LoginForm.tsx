import { useForm } from "@tanstack/react-form";
// import { useNavigate, useSearch } from "@tanstack/react-router";
import { authActions } from "@/features/auth";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { loginSchema } from "@/features/auth/lib/schemas";

export const LoginForm = () => {
  // const navigate = useNavigate();
  // const search = useSearch({ from: "/_auth/login" }) as { redirect?: string };

  const form = useForm({
    defaultValues: { username: "", password: "" },

    validators: {
      onSubmit: loginSchema,
      onChange: loginSchema,
      onBlur: loginSchema,
    },

    onSubmit: async ({ value }) => {
      console.log(value);
      authActions.login({ id: crypto.randomUUID(), name: value.username });
      // navigate({ to: search.redirect || "/" });
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
        <form.Field name="username">
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
