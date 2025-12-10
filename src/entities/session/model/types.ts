interface SessionUser {
  id: string;
  username: string;
  email?: string;
}

interface Session {
  user: SessionUser;
  isAuthenticated: true;
  isLoading?: boolean;
  error?: string | null;
}

interface UnauthenticatedSession {
  user: null;
  isAuthenticated: false;
  isLoading?: boolean;
  error?: string | null;
}

interface AuthenticatingSession {
  user: null;
  isAuthenticated: true;
  isLoading?: boolean;
  error?: string | null;
}

type SessionState = Session | UnauthenticatedSession | AuthenticatingSession;

export type { SessionUser, Session, UnauthenticatedSession, AuthenticatingSession, SessionState };
