export const FormErrorText = ({ children }: { children?: string }) =>
  children ? <p className="text-xs text-destructive mt-1 text-left pl-4">{children}</p> : null;
