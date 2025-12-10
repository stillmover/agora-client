export interface AuthUserData {
  id: number;
  username: string;
  email?: string;
}

export interface AuthSuccessResponse {
  success: true;
  data: {
    user: AuthUserData;
  };
}

export interface AuthErrorResponse {
  success: false;
  error?: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export const isAuthSuccessResponse = (response: unknown): response is AuthSuccessResponse => {
  if (typeof response !== "object" || response === null) {
    return false;
  }

  const resp = response as Record<string, unknown>;

  if (resp.success !== true) {
    return false;
  }

  if (typeof resp.data !== "object" || resp.data === null) {
    return false;
  }

  const data = resp.data as Record<string, unknown>;

  if (typeof data.user !== "object" || data.user === null) {
    return false;
  }

  const user = data.user as Record<string, unknown>;

  return (
    typeof user.id === "number" &&
    typeof user.username === "string" &&
    (user.email === undefined || typeof user.email === "string")
  );
};

export const extractUserFromResponse = (response: unknown): AuthUserData | null => {
  if (isAuthSuccessResponse(response)) {
    return response.data.user;
  }
  return;
};
