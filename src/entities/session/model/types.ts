type SessionUser = {
  id: string;
  username: string;
  email?: string;
};

type Session = {
  user: SessionUser;
  isAuthenticated: true;
  isLoading?: boolean;
  error?: string | null;
};

type UnauthenticatedSession = {
  user: null;
  isAuthenticated: false;
  isLoading?: boolean;
  error?: string | null;
};

type AuthenticatingSession = {
  user: null;
  isAuthenticated: true;
  isLoading?: boolean;
  error?: string | null;
};

type SessionState = Session | UnauthenticatedSession | AuthenticatingSession;

export type {
  SessionUser,
  Session,
  UnauthenticatedSession,
  AuthenticatingSession,
  SessionState,
};
