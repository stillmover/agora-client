import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { authActions } from "@/features/auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { name: "" },
    onSubmit: async ({ value }) => {
      if (!value.name.trim()) {
        return;
      }
      authActions.login({ id: crypto.randomUUID(), name: value.name });
      navigate({ to: "/" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Register</h2>
        <p className="text-sm text-muted-foreground">
          Create a new account to get started
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="name">
          {(field) => (
            <div className="space-y-2">
              <label htmlFor={field.name} className="text-sm font-medium">
                Username
              </label>
              <Input
                id={field.name}
                placeholder="Pick a username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
              />
              {field.state.meta.errors && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          )}
        </form.Field>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
};
