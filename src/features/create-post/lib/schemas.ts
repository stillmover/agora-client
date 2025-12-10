import { z } from "zod";

const TITLE_MAX_LENGTH = 300;

const createPostSchema = z.object({
  communityId: z.string().trim().min(1, "Please select a community."),
  content: z.string().trim(),
  title: z
    .string()
    .trim()
    .min(1, "Please enter a title.")
    .max(TITLE_MAX_LENGTH, `Title cannot exceed ${TITLE_MAX_LENGTH} characters.`),
});

type CreatePostValues = z.infer<typeof createPostSchema>;

const POST_LIMITS = {
  TITLE_MAX: TITLE_MAX_LENGTH,
} as const;

export { createPostSchema, POST_LIMITS };
export type { CreatePostValues };
