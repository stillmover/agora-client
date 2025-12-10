import { UI_TEXT } from "@/shared/constants";

export const formatReplyCount = (count: number): string =>
  `${count} ${count === 1 ? UI_TEXT.COMMENT.REPLY_SINGULAR : UI_TEXT.COMMENT.REPLY_PLURAL}`;
