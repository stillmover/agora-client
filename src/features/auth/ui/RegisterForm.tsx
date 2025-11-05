import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { authActions } from '@/features/auth';
import { uiActions } from '../model/ui.store';
import { FloatingInput } from '@/shared/ui/floating-input';
import { Button } from '@/shared/ui/button';
import { registerSchema } from '@/features/auth/lib/schemas';
import {
  usePostApiRegister,
  type PostApiRegisterMutationResponse,
} from '@/shared/api/endpoints/authentication/authentication';

interface RegisterFormProps {
  setView: (view: 'login' | 'register' | 'reset') => void;
}

export const RegisterForm = ({ setView }: RegisterFormProps) => {
  const navigate = useNavigate();

  const registerMutation = usePostApiRegister({
    mutation: {
      onSuccess: ({ username }: PostApiRegisterMutationResponse) => {
        authActions.login({
          id: crypto.randomUUID(),
          username,
        });
        uiActions.closeModal();
        navigate({ to: '/' });
      },
      onError: error => {
        console.error(error);
      },
    },
  });

  const form = useForm({
    defaultValues: { email: '', username: '', password: '' },
    validators: {
      onSubmit: registerSchema,
      onBlur: registerSchema,
      onChange: registerSchema,
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
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field name="email">
          {field => (
            <FloatingInput
              id={field.name}
              type="email"
              value={field.state.value}
              onChange={e => field.setValue(e.target.value)}
              label="Email"
              required
              error={field.state.meta.errors?.[0]?.message}
            />
          )}
        </form.Field>

        <form.Field name="username">
          {field => (
            <FloatingInput
              id={field.name}
              type="text"
              value={field.state.value}
              onChange={e => field.setValue(e.target.value)}
              label="Username"
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

        <p className="text-sm text-gray-600 text-left space-y-2 pl-4 pb-4 dark:text-[#b7cad4]">
          Already have an account?{' '}
          <button
            onClick={() => setView('login')}
            className="text-blue-600 hover:underline cursor-pointer dark:text-[#648efc]"
          >
            Log In
          </button>
        </p>

        <form.Subscribe
          selector={state => ({
            values: state.values,
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {({ values, canSubmit, isSubmitting }) => {
            const username = values?.username ?? '';
            const email = values?.email ?? '';
            const password = values?.password ?? '';
            const isEmpty =
              !username.trim() || !password.trim() || !email.trim();

            const active =
              canSubmit &&
              !isEmpty &&
              !isSubmitting &&
              !registerMutation.isPending;

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
                {isSubmitting || registerMutation.isPending
                  ? 'Sign Up...'
                  : 'Sign up'}
              </Button>
            );
          }}
        </form.Subscribe>
      </form>
    </div>
  );
};
