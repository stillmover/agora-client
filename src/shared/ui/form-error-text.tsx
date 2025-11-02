export const FormErrorText = ({ children }: { children?: string }) =>
  children ? <p className="text-sm text-destructive mt-1">{children}</p> : null;
