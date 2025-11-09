import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { useRegisterForm } from "../model/useRegisterForm";

interface RegisterFormProps {
  setView?: (view: "login" | "register" | "reset") => void;
  redirect?: string;
  onSuccess?: () => void;
}

export const RegisterForm = ({
  setView,
  redirect,
  onSuccess,
}: RegisterFormProps) => {
  const { form, isPending } = useRegisterForm({ redirect, onSuccess });
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
              onBlur={() =>
                field.setMeta((prev) => ({
                  ...prev,
                  touched: true,
                }))
              }
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
              onBlur={() =>
                field.setMeta((prev) => ({
                  ...prev,
                  touched: true,
                }))
              }
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
              onBlur={() =>
                field.setMeta((prev) => ({
                  ...prev,
                  touched: true,
                }))
              }
              label="Password"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <p className="text-sm text-gray-600 text-left space-y-2 pl-4 pb-4 dark:text-[#b7cad4]">
          Already have an account?{" "}
          <button
            onClick={() => setView?.("login")}
            className="text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
          >
            Log In
          </button>
        </p>

        <form.Subscribe
          selector={(state) => ({
            values: state.values,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ values, canSubmit, isSubmitting }) => {
            const username = values?.username ?? "";
            const email = values?.email ?? "";
            const password = values?.password ?? "";
            const isEmpty =
              !username.trim() || !password.trim() || !email.trim();

            const active = canSubmit && !isEmpty && !isSubmitting && !isPending;

            return (
              <Button
                type="submit"
                variant={active ? "reddit" : "redditDisabled"}
                disabled={!active}
                className={`w-full p-6 font-semibold transition-colors duration-200
                  ${
                    active
                      ? "bg-[#d93a00] hover:bg-[#bb3200] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting || isPending ? "Sign Up..." : "Sign up"}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
};
