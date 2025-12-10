import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { calculateVoteChange } from "../lib/vote-calculator";
import { VOTE_BUTTON_SIZES, VOTE_BUTTON_ORIENTATIONS } from "@/shared/constants";
import type { VoteButtonSize, VoteButtonOrientation, VoteDirection } from "@/shared/constants";
import { useIsAuthenticated } from "@/entities/session";
import { useNavigate } from "@tanstack/react-router";

interface VoteButtonProps {
  votes: number;
  onVote: (direction: VoteDirection) => void;
  userVote?: VoteDirection | null;
  size?: VoteButtonSize;
  orientation?: VoteButtonOrientation;
}

const SIZE_CLASSES: Record<VoteButtonSize, string> = {
  [VOTE_BUTTON_SIZES.SM]: "h-4 w-4",
  [VOTE_BUTTON_SIZES.MD]: "h-5 w-5",
  [VOTE_BUTTON_SIZES.LG]: "h-6 w-6",
} as const;

export const VoteButton = ({
  votes,
  onVote,
  userVote,
  size = VOTE_BUTTON_SIZES.MD,
  orientation = VOTE_BUTTON_ORIENTATIONS.VERTICAL,
}: VoteButtonProps) => {
  const [localVotes, setLocalVotes] = useState(votes);
  const [localUserVote, setLocalUserVote] = useState<VoteDirection | null>(userVote ?? null);
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalVotes(votes);
  }, [votes]);

  useEffect(() => {
    setLocalUserVote(userVote ?? null);
  }, [userVote]);

  const handleVote = (direction: VoteDirection) => {
    if (!isAuthenticated) {
      navigate({
        to: "/login",
        search: {
          redirect: window.location.pathname + window.location.search,
        },
      });
      return;
    }

    const result = calculateVoteChange(
      { currentVotes: localVotes, userVote: localUserVote },
      direction
    );

    setLocalVotes(result.newVoteCount);
    setLocalUserVote(result.newUserVote);
    onVote(direction);
  };

  const isUpVoted = localUserVote === "up";
  const isDownVoted = localUserVote === "down";
  const isPositive = localVotes > 0;
  const isNegative = localVotes < 0;

  const voteButtonBaseClasses = "h-8 w-8";
  const upVoteButtonClasses = cn(
    voteButtonBaseClasses,
    isUpVoted && "text-orange-500 hover:text-orange-500"
  );
  const downVoteButtonClasses = cn(
    voteButtonBaseClasses,
    isDownVoted && "text-blue-500 hover:text-blue-500"
  );

  const voteCountClasses = cn(
    "text-sm font-medium",
    isPositive && "text-orange-500",
    isNegative && "text-blue-500"
  );

  if (orientation === VOTE_BUTTON_ORIENTATIONS.HORIZONTAL) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleVote("up");
          }}
          className={cn(voteButtonBaseClasses, isUpVoted && "text-orange-500")}
        >
          <ChevronUp className={SIZE_CLASSES[size]} />
        </Button>
        <span className={cn(voteCountClasses, "min-w-[2ch] text-center")}>{localVotes}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            handleVote("down");
          }}
          className={cn(voteButtonBaseClasses, isDownVoted && "text-blue-500")}
        >
          <ChevronDown className={SIZE_CLASSES[size]} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleVote("up");
        }}
        className={upVoteButtonClasses}
      >
        <ChevronUp className={SIZE_CLASSES[size]} />
      </Button>
      <span className={voteCountClasses}>{localVotes}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleVote("down");
        }}
        className={downVoteButtonClasses}
      >
        <ChevronDown className={SIZE_CLASSES[size]} />
      </Button>
    </div>
  );
};
