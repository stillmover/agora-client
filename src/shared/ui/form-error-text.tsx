import type { PropsWithChildren } from "react";

export const FormErrorText = ({ children }: PropsWithChildren) => {
  if (children) {
    return <p className="text-xs text-destructive mt-1 text-left pl-4">{children}</p>;
  }
  return;
};
