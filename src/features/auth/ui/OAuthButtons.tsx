type OAuthButtonsProps = {
  showEmailLink?: boolean;
};

export default function OAuthButtons({
  showEmailLink = false,
}: OAuthButtonsProps) {
  return (
    <div className="flex flex-col gap-2">
      <button className="bg-[#272729] hover:bg-[#2E2E2E] text-[#D7DADC] py-2 rounded-md border border-gray-700 flex items-center justify-center gap-2 transition">
        📱 Continue with phone number
      </button>

      <button className="bg-[#272729] hover:bg-[#2E2E2E] text-[#D7DADC] py-2 rounded-md border border-gray-700 flex items-center justify-center gap-2 transition">
        🔵 Continue with Google
      </button>

      <button className="bg-[#272729] hover:bg-[#2E2E2E] text-[#D7DADC] py-2 rounded-md border border-gray-700 flex items-center justify-center gap-2 transition">
        🍎 Continue with Apple
      </button>
      {showEmailLink && (
        <button className="bg-[#272729] hover:bg-[#2E2E2E] text-[#D7DADC] py-2 rounded-md border border-gray-700 flex items-center justify-center gap-2 transition">
          ✉️ Email me a one-time link
        </button>
      )}
    </div>
  );
}
