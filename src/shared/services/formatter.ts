import { formatDistanceToNow, type FormatDistanceToNowOptions } from "date-fns";
import { UI_TEXT } from "@/shared/constants";

export function formatRelativeTime(dateString: string): string {
  const options: FormatDistanceToNowOptions = { addSuffix: true };
  return formatDistanceToNow(new Date(dateString), options);
}

export function formatCount(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function formatCommentCount(count: number): string {
  return formatCount(
    count,
    UI_TEXT.COMMENT.COMMENT_COUNT.SINGULAR,
    UI_TEXT.COMMENT.COMMENT_COUNT.PLURAL,
  );
}

export function formatReplyCount(count: number): string {
  return formatCount(
    count,
    UI_TEXT.COMMENT.REPLY_SINGULAR,
    UI_TEXT.COMMENT.REPLY_PLURAL,
  );
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}
