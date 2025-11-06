export const sessionKeys = {
  all: ["session"] as const,
  me: () => [...sessionKeys.all, "me"] as const,
  details: () => [...sessionKeys.all, "details"] as const,
} as const;
