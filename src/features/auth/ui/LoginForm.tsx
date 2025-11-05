import { useForm } from '@tanstack/react-form';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { authActions } from '@/features/auth';
import { uiActions } from '../model/ui.store';
import { FloatingInput } from '@/shared/ui/floating-input';
import { Button } from '@/shared/ui/button';
import { loginSchema } from '@/features/auth/lib/schemas';
import { usePostApiLogin } from '@/shared/api/endpoints/authentication/authentication';

interface LoginFormProps {
  setView: (view: 'login' | 'register' | 'reset') => void;
}

export const LoginForm = ({ setView }: LoginFormProps) => {
  const navigate = useNavigate();
  // const search = useSearch({ from: "/_auth/login" }) as { redirect?: string };

  const loginMutation = usePostApiLogin({
    mutation: {
      onSuccess: response => {
        const user = response.data?.user;
        if (!user) return;

        authActions.login({
          id: String(user.id),
          username: user.username,
        });

        uiActions.closeModal();
        navigate({ to: '/' });
      },
      onError: error => {
        console.error('Login failed: ', error);
      },
    },
  });

  const form = useForm({
    defaultValues: { usernameOrEmail: '', password: '' },

    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
      onBlur: loginSchema,
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
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="usernameOrEmail">
          {field => (
            <FloatingInput
              id={field.name}
              type="text"
              value={field.state.value}
              onChange={e => field.setValue(e.target.value)}
              onBlur={() => field.setMeta({ touched: true })}
              label="Email or username"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <form.Field name="password">
          {field => (
            <FloatingInput
              id={field.name}
              type="password"
              value={field.state.value}
              onChange={e => field.setValue(e.target.value)}
              label="Password"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <div className="text-left space-y-2 pb-4">
          <button
            type="button"
            onClick={() => setView('reset')}
            className="text-sm text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
          >
            Forgot password?
          </button>

          <p className="text-sm text-gray-600 dark:text-[#b7cad4]">
            New to Reddit?{' '}
            <button
              type="button"
              onClick={() => setView('register')}
              className="text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
            >
              Sign Up
            </button>
          </p>
        </div>

        <form.Subscribe
          selector={state => ({
            values: state.values,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ values, canSubmit, isSubmitting }) => {
            const usernameOrEmail = values?.usernameOrEmail ?? '';
            const password = values?.password ?? '';
            const isEmpty = !usernameOrEmail.trim() || !password.trim();

            const active =
              canSubmit &&
              !isEmpty &&
              !isSubmitting &&
              !loginMutation.isPending;

            return (
              <Button
                type="submit"
                variant={active ? 'reddit' : 'redditDisabled'}
                disabled={!active}
                className={`w-full p-6 font-semibold transition-colors duration-200
                  ${
                    active
                      ? 'bg-[#d93a00] hover:bg-[#bb3200] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting || loginMutation.isPending
                  ? 'Logging in...'
                  : 'Log In'}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
};
