import { VOTE_VALUES } from "@/shared/constants";
import type { VoteDirection } from "@/shared/constants";

export interface VoteState {
  currentVotes: number;
  userVote: VoteDirection | null;
}

export interface VoteResult {
  newVoteCount: number;
  newUserVote: VoteDirection | null;
}

export function calculateVoteChange(currentState: VoteState, direction: VoteDirection): VoteResult {
  const { currentVotes, userVote } = currentState;

  if (userVote === direction) {
    return {
      newUserVote: null,
      newVoteCount:
        currentVotes +
        (direction === "up" ? -VOTE_VALUES.UP_INCREMENT : -VOTE_VALUES.DOWN_INCREMENT),
    };
  }

  if (userVote === null) {
    return {
      newUserVote: direction,
      newVoteCount:
        currentVotes + (direction === "up" ? VOTE_VALUES.UP_INCREMENT : VOTE_VALUES.DOWN_INCREMENT),
    };
  }

  const voteChange =
    direction === "up" ? VOTE_VALUES.VOTE_CHANGE_MULTIPLIER : -VOTE_VALUES.VOTE_CHANGE_MULTIPLIER;

  return {
    newUserVote: direction,
    newVoteCount: currentVotes + voteChange,
  };
}
