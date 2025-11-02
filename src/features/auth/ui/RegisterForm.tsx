import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { authActions } from "@/features/auth";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { registerSchema } from "@/features/auth/lib/schemas";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { email: "" },
    validators: {
      onSubmit: registerSchema,
      onChange: registerSchema,
      onBlur: registerSchema,
    },

    onSubmit: async ({ value }) => {
      authActions.login({ id: crypto.randomUUID(), name: value.email });
      navigate({ to: "/" });
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
              type="text"
              value={field.state.value}
              onChange={(e) => field.setValue(e.target.value)}
              label="Email"
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
