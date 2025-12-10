export const API_DELAYS = {
  COMMENTS: 200,
  COMMUNITIES: 200,
  COMMUNITY: 200,
  CREATE_COMMENT: 300,
  CREATE_POST: 500,
  POST: 300,
  POSTS: 300,
} as const;

export const VOTE_VALUES = {
  DOWN_INCREMENT: -1,
  UP_INCREMENT: 1,
  VOTE_CHANGE_MULTIPLIER: 2,
} as const;

export const VOTE_DIRECTIONS = {
  DOWN: "down",
  UP: "up",
} as const;

export type VoteDirection = (typeof VOTE_DIRECTIONS)[keyof typeof VOTE_DIRECTIONS];

export const VOTE_BUTTON_SIZES = {
  LG: "lg",
  MD: "md",
  SM: "sm",
} as const;

export type VoteButtonSize = (typeof VOTE_BUTTON_SIZES)[keyof typeof VOTE_BUTTON_SIZES];

export const VOTE_BUTTON_ORIENTATIONS = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;

export type VoteButtonOrientation =
  (typeof VOTE_BUTTON_ORIENTATIONS)[keyof typeof VOTE_BUTTON_ORIENTATIONS];

export const MAX_COMMENT_DEPTH = 3;
export const COMMENT_FORM_ROWS = 3;
export const COMMENT_FORM_PLACEHOLDER = "Write a comment...";
export const REPLY_FORM_PLACEHOLDER = "Write a reply...";

export const TIME_CONSTANTS = {
  DAY: 24 * 60 * 60 * 1000,
  HOUR: 60 * 60 * 1000,
  MILLISECOND: 1,
  MINUTE: 60 * 1000,
  SECOND: 1000,
} as const;

export const UI_TEXT = {
  COMMENT: {
    COMMENT_COUNT: {
      PLURAL: "comments",
      SINGULAR: "comment",
    },
    COMMENT_FORM_PLACEHOLDER: "Write a comment...",
    HIDE_REPLIES: "Hide",
    NO_COMMENTS: "No comments yet. Be the first to comment!",
    PLURAL: "Comments",
    REPLY: "Reply",
    REPLY_PLURAL: "replies",
    REPLY_SINGULAR: "reply",
    SHOW_REPLIES: "Show",
    SINGULAR: "Comment",
    SUBMIT: "Comment",
  },
  LOADING: {
    SKELETON_COUNT: 3,
  },
  POST: {
    CREATE: "Post",
    CREATING: "Posting...",
    NOT_FOUND: "Post not found",
    NO_POSTS: "No posts yet. Be the first to post!",
  },
} as const;

export const VOTE_COLORS = {
  DOWN: "blue-500",
  UP: "orange-500",
} as const;

export const AVATAR_SIZES = {
  LARGE: "h-9 w-9",
  MEDIUM: "h-8 w-8",
  SMALL: "h-6 w-6",
} as const;

export const AVATAR_FONT_SIZES = {
  LARGE: "text-base",
  MEDIUM: "text-sm",
  SMALL: "text-xs",
} as const;

export const DATE_FORMAT_OPTIONS = {
  addSuffix: true,
} as const;
