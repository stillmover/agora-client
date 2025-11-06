import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface OAuthButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const OAuthButton = ({
  icon,
  text,
  onClick,
  className,
}: OAuthButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      `relative flex items-center justify-center w-full py-2 rounded-full border border-gray-300
       bg-white hover:bg-[#f0f5fe] text-[#131313]
      transition cursor-pointer`,
      className,
    )}
  >
    <span className="absolute left-4">{icon}</span>
    <span className="font-medium text-sm">{text}</span>
  </button>
);
