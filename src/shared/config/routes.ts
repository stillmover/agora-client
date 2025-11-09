export const ROUTES = {
  COMMUNITY: "/r/",
  CREATE_POST: "/submit",
  HOME: "/",
  LOGIN: "/login",
  NOT_FOUND: "*",
  POST: "/post/",
  REGISTER: "/register",
  SUBMIT: "/submit",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
