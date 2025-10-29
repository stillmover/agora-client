export const API_DELAYS = {
  POSTS: 300,
  POST: 300,
  COMMUNITIES: 200,
  COMMUNITY: 200,
  COMMENTS: 200,
  CREATE_POST: 500,
  CREATE_COMMENT: 300,
} as const;

export const VOTE_VALUES = {
  UP_INCREMENT: 1,
  DOWN_INCREMENT: -1,
  VOTE_CHANGE_MULTIPLIER: 2,
} as const;

export const VOTE_DIRECTIONS = {
  UP: "up",
  DOWN: "down",
} as const;

export type VoteDirection =
  (typeof VOTE_DIRECTIONS)[keyof typeof VOTE_DIRECTIONS];

export const VOTE_BUTTON_SIZES = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type VoteButtonSize =
  (typeof VOTE_BUTTON_SIZES)[keyof typeof VOTE_BUTTON_SIZES];

export const VOTE_BUTTON_ORIENTATIONS = {
  VERTICAL: "vertical",
  HORIZONTAL: "horizontal",
} as const;

export type VoteButtonOrientation =
  (typeof VOTE_BUTTON_ORIENTATIONS)[keyof typeof VOTE_BUTTON_ORIENTATIONS];

export const MAX_COMMENT_DEPTH = 3;
export const COMMENT_FORM_ROWS = 3;
export const COMMENT_FORM_PLACEHOLDER = "Write a comment...";
export const REPLY_FORM_PLACEHOLDER = "Write a reply...";

export const TIME_CONSTANTS = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

export const UI_TEXT = {
  POST: {
    NO_POSTS: "No posts yet. Be the first to post!",
    NOT_FOUND: "Post not found",
    CREATING: "Posting...",
    CREATE: "Post",
  },
  COMMENT: {
    NO_COMMENTS: "No comments yet. Be the first to comment!",
    SINGULAR: "Comment",
    PLURAL: "Comments",
    REPLY: "Reply",
    SUBMIT: "Comment",
    HIDE_REPLIES: "Hide",
    SHOW_REPLIES: "Show",
    REPLY_SINGULAR: "reply",
    REPLY_PLURAL: "replies",
    COMMENT_FORM_PLACEHOLDER: "Write a comment...",
    COMMENT_COUNT: {
      SINGULAR: "comment",
      PLURAL: "comments",
    },
  },
  LOADING: {
    SKELETON_COUNT: 3,
  },
} as const;

export const VOTE_COLORS = {
  UP: "orange-500",
  DOWN: "blue-500",
} as const;

export const AVATAR_SIZES = {
  SMALL: "h-6 w-6",
  MEDIUM: "h-8 w-8",
  LARGE: "h-9 w-9",
} as const;

export const AVATAR_FONT_SIZES = {
  SMALL: "text-xs",
  MEDIUM: "text-sm",
  LARGE: "text-base",
} as const;

export const DATE_FORMAT_OPTIONS = {
  addSuffix: true,
} as const;
