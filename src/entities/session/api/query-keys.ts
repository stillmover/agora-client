export const sessionKeys = {
  all: ["session"] as const,
  details: () => [...sessionKeys.all, "details"] as const,
  me: () => [...sessionKeys.all, "me"] as const,
} as const;
