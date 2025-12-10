import { z } from "zod";

const COMMUNITY_NAME_MIN_LENGTH = 3;
const COMMUNITY_NAME_MAX_LENGTH = 21;
const DISPLAY_NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 500;

const communityNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter a community name.")
  .min(
    COMMUNITY_NAME_MIN_LENGTH,
    `Community name must be at least ${COMMUNITY_NAME_MIN_LENGTH} characters.`
  )
  .max(
    COMMUNITY_NAME_MAX_LENGTH,
    `Community name cannot exceed ${COMMUNITY_NAME_MAX_LENGTH} characters.`
  )
  .regex(/^[a-zA-Z0-9_]+$/, "Community name can only contain letters, numbers, and underscores.");

const createCommunitySchema = z.object({
  communityType: z.enum(["public", "restricted", "private"]),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`),
  displayName: z
    .string()
    .trim()
    .min(1, "Please enter a display name.")
    .max(
      DISPLAY_NAME_MAX_LENGTH,
      `Display name cannot exceed ${DISPLAY_NAME_MAX_LENGTH} characters.`
    ),
  name: communityNameSchema,
});

type CreateCommunityValues = z.infer<typeof createCommunitySchema>;

const COMMUNITY_LIMITS = {
  DESCRIPTION_MAX: DESCRIPTION_MAX_LENGTH,
  DISPLAY_NAME_MAX: DISPLAY_NAME_MAX_LENGTH,
  NAME_MAX: COMMUNITY_NAME_MAX_LENGTH,
  NAME_MIN: COMMUNITY_NAME_MIN_LENGTH,
} as const;

export { createCommunitySchema, communityNameSchema, COMMUNITY_LIMITS };
export type { CreateCommunityValues };
