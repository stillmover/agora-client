import { OAuthButton } from '@/shared/ui/oauth-button';
import phoneIcon from '@/shared/assets/phone.svg';
import googleIcon from '@/shared/assets/google.svg';
import appleIcon from '@/shared/assets/apple.svg';
import linkIcon from '@/shared/assets/link.svg';

type OAuthButtonsProps = {
  showEmailLink?: boolean;
};

export default function OAuthButtons({
  showEmailLink = false,
}: OAuthButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <OAuthButton
        icon={
          <div className="w-6 h-6 flex items-center justify-center">
            <img src={phoneIcon} alt="Phone" className="w-5 h-5" />
          </div>
        }
        text="Continue with phone number"
      />
      <OAuthButton
        icon={
          <div className="w-6 h-6 flex items-center justify-center">
            <img src={googleIcon} alt="Google" className="w-5 h-5" />
          </div>
        }
        text="Continue with Google"
      />
      <OAuthButton
        icon={
          <div className="w-6 h-6 flex items-center justify-center">
            <img src={appleIcon} alt="Apple" className="w-8 h-8" />
          </div>
        }
        text="Continue with Apple"
      />
      {showEmailLink && (
        <OAuthButton
          icon={
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={linkIcon} alt="Link" className="w-12 h-12" />
            </div>
          }
          text="Email me a one-time link"
        />
      )}
    </div>
  );
}
