export const ROUTES = {
  AUTH_CALLBACK: "/auth/callback",
  COMMUNITY: "/r/",
  CREATE_POST: "/submit",
  HOME: "/",
  MESSAGES: "/messages",
  NOTIFICATIONS: "/notifications",
  POST: "/post/",
  SAVED: "/saved",
  SEARCH: "/search",
  SETTINGS: "/settings",
  USER_PROFILE: "/u/",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
