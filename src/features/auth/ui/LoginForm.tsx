import { useNavigate } from "@tanstack/react-router";
import { FloatingInput } from "@/shared/ui/floating-input";
import { Button } from "@/shared/ui/button";
import { useLoginForm } from "../model/use-login-form";

const FIRST_ERROR_INDEX = 0;

interface LoginFormProps {
  setView?: (view: "login" | "register" | "reset") => void;
  redirect?: string;
  onSuccess?: VoidFunction;
}

const LoginFormFields = ({ form }: { form: ReturnType<typeof useLoginForm>["form"] }) => (
  <>
    <form.Field name="usernameOrEmail">
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
          label="Email or username"
          required
          error={field.state.meta.errors?.[FIRST_ERROR_INDEX]?.message}
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
          error={field.state.meta.errors?.[FIRST_ERROR_INDEX]?.message}
        />
      )}
    </form.Field>
  </>
);

const LoginFormFooter = ({
  setView,
  redirect,
}: {
  setView?: (view: "login" | "register" | "reset") => void;
  redirect?: string;
}) => {
  const navigate = useNavigate();

  const navigateTo = (to: "/reset" | "/register") =>
    navigate({
      search: (prev) => ({
        ...prev,
        redirect: redirect ?? prev.redirect,
        code: undefined,
        state: undefined,
        error: undefined,
      }),
      to,
    });

  return (
    <div className="text-left space-y-2 pb-4">
      <button
        type="button"
        onClick={() => (setView ? setView("reset") : navigateTo("/reset"))}
        className="text-sm text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
      >
        Forgot password?
      </button>

      <p className="text-sm text-gray-600 dark:text-[#b7cad4]">
        New to Reddit?{" "}
        <button
          type="button"
          onClick={() => (setView ? setView("register") : navigateTo("/register"))}
          className="text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

const LoginSubmitButton = ({
  form,
  isPending,
}: {
  form: ReturnType<typeof useLoginForm>["form"];
  isPending: boolean;
}) => (
  <form.Subscribe
    selector={(state) => ({
      canSubmit: state.canSubmit,
      isSubmitting: state.isSubmitting,
      values: state.values,
    })}
  >
    {({ values, canSubmit, isSubmitting }) => {
      const usernameOrEmail = values?.usernameOrEmail ?? "";
      const password = values?.password ?? "";
      const isEmpty = !usernameOrEmail.trim() || !password.trim();
      const active = canSubmit && !isEmpty && !isSubmitting && !isPending;

      let buttonText;
      if (isSubmitting || isPending) {
        buttonText = "Logging in...";
      } else {
        buttonText = "Log In";
      }

      let buttonClassName;
      if (active) {
        buttonClassName = "bg-[#d93a00] hover:bg-[#bb3200] text-white";
      } else {
        buttonClassName = "bg-gray-300 text-gray-500 cursor-not-allowed";
      }

      let buttonVariant: "reddit" | "redditDisabled";
      if (active) {
        buttonVariant = "reddit";
      } else {
        buttonVariant = "redditDisabled";
      }

      return (
        <Button
          type="submit"
          variant={buttonVariant}
          disabled={!active}
          className={`w-full p-6 font-semibold transition-colors duration-200 ${buttonClassName}`}
        >
          {buttonText}
        </Button>
      );
    }}
  </form.Subscribe>
);

export const LoginForm = ({ setView, redirect, onSuccess }: LoginFormProps) => {
  const { form, isPending } = useLoginForm({ onSuccess, redirect });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <LoginFormFields form={form} />
        <LoginFormFooter setView={setView} redirect={redirect} />
        <LoginSubmitButton form={form} isPending={isPending} />
      </form>
    </div>
  );
};
