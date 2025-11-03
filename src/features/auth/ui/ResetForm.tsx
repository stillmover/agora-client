import { useForm } from "@tanstack/react-form";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { resetSchema } from "@/features/auth/lib/schemas";

export const ResetForm = () => {
  const form = useForm({
    defaultValues: { username: "" },
    validators: {
      onSubmit: resetSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Password reset request for:", value.username);
      // simulate API call
    },
  });

  return (
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
            label="Email or username"
            value={field.state.value}
            onChange={(e) => field.setValue(e.target.value)}
            required
            error={field.state.meta.errors?.[0]?.message}
          />
        )}
      </form.Field>

      <Button type="submit" className="w-full" disabled={!form.state.canSubmit}>
        Reset password
      </Button>
    </form>
  );
};
