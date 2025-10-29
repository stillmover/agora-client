export const ROUTES = {
  COMMUNITY: "/r/",
  CREATE_POST: "/submit",
  HOME: "/",
  LOGIN: "/login",
  NOT_FOUND: "*",
  POST: "/post/",
  REGISTER: "/register",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
