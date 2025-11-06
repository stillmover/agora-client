import { useForm } from "@tanstack/react-form";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { resetSchema } from "@/features/auth/lib/schemas";

export const ResetForm = () => {
  const isFormValid = (values: { usernameOrEmail: string }) => {
    try {
      resetSchema.parse(values);
      return true;
    } catch {
      return false;
    }
  };

  const form = useForm({
    defaultValues: { usernameOrEmail: "" },
    validators: {
      onSubmit: resetSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Password reset request for:", value.usernameOrEmail);
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
      <div className="flex flex-col space-y-1">
        <form.Field name="usernameOrEmail">
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

        <a
          href="/help"
          className="text-blue-600 hover:underline dark:text-blue-400 dark:text-[#b7cad4] text-left pl-4 pt-4 pb-4"
        >
          Need help?
        </a>
      </div>

      <Button
        type="submit"
        variant={isFormValid(form.state.values) ? "reddit" : "redditDisabled"}
        disabled={!isFormValid(form.state.values)}
        className="w-full p-6"
      >
        {" "}
        Reset password{" "}
      </Button>
    </form>
  );
};
