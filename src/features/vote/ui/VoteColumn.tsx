import { memo, useCallback } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { logger } from "@/shared/services/logger";
import { useVote } from "../model/useVote";
import type { VoteDirection } from "@/shared/constants";

interface VoteColumnProps {
  postId: string;
  score: number;
  userVote?: -1 | 0 | 1;
}

const formatScore = (score: number): string => {
  if (Math.abs(score) >= 10_000) {
    return `${(score / 1000).toFixed(0)}k`;
  }
  if (Math.abs(score) >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return score.toString();
};

export const VoteColumn = memo(({ postId, score, userVote = 0 }: VoteColumnProps) => {
  const { vote, currentVote, hasUpvoted, hasDownvoted, isPending } = useVote(postId, userVote);

  const handleVote = useCallback(
    async (direction: VoteDirection) => {
      try {
        await vote(direction);
      } catch (error) {
        logger.error("Failed to vote:", error);
      }
    },
    [vote]
  );

  const handleUpvote = useCallback(() => handleVote("up"), [handleVote]);
  const handleDownvote = useCallback(() => handleVote("down"), [handleVote]);

  const optimisticScore = score + currentVote;
  const formattedScore = formatScore(optimisticScore);

  return (
    <div
      className="flex flex-col items-center gap-0.5 py-1 min-w-[40px]"
      role="group"
      aria-label={`Vote on post with ${optimisticScore} points`}
    >
      <button
        onClick={handleUpvote}
        disabled={isPending}
        className={cn(
          "p-1 rounded-md transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vote-up",
          isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-vote-up/10 active:scale-90",
          hasUpvoted ? "text-vote-up bg-vote-up/10" : "text-muted-foreground hover:text-vote-up"
        )}
        aria-label={`Upvote (${optimisticScore} points)`}
        aria-pressed={hasUpvoted}
        aria-disabled={isPending}
      >
        <ArrowBigUp
          className={cn(
            "h-6 w-6 transition-transform duration-150",
            hasUpvoted && "fill-current scale-110"
          )}
        />
      </button>

      <span
        className={cn(
          "text-xs font-bold tabular-nums min-w-[32px] text-center py-0.5",
          "transition-colors duration-150",
          hasUpvoted && "text-vote-up",
          hasDownvoted && "text-vote-down",
          !hasUpvoted && !hasDownvoted && "text-foreground"
        )}
        aria-label={`${optimisticScore} votes`}
      >
        {formattedScore}
      </span>

      <button
        onClick={handleDownvote}
        disabled={isPending}
        className={cn(
          "p-1 rounded-md transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vote-down",
          isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-vote-down/10 active:scale-90",
          hasDownvoted
            ? "text-vote-down bg-vote-down/10"
            : "text-muted-foreground hover:text-vote-down"
        )}
        aria-label={`Downvote (${optimisticScore} points)`}
        aria-pressed={hasDownvoted}
        aria-disabled={isPending}
      >
        <ArrowBigDown
          className={cn(
            "h-6 w-6 transition-transform duration-150",
            hasDownvoted && "fill-current scale-110"
          )}
        />
      </button>
    </div>
  );
});

VoteColumn.displayName = "VoteColumn";
