import { VOTE_VALUES, type VoteDirection } from "@/shared/constants";

export type VoteState = {
  currentVotes: number;
  userVote: VoteDirection | null;
};

export type VoteResult = {
  newVoteCount: number;
  newUserVote: VoteDirection | null;
};

export function calculateVoteChange(
  currentState: VoteState,
  direction: VoteDirection,
): VoteResult {
  const { currentVotes, userVote } = currentState;

  if (userVote === direction) {
    return {
      newVoteCount:
        currentVotes +
        (direction === "up"
          ? -VOTE_VALUES.UP_INCREMENT
          : -VOTE_VALUES.DOWN_INCREMENT),
      newUserVote: null,
    };
  }

  if (userVote === null) {
    return {
      newVoteCount:
        currentVotes +
        (direction === "up"
          ? VOTE_VALUES.UP_INCREMENT
          : VOTE_VALUES.DOWN_INCREMENT),
      newUserVote: direction,
    };
  }

  const voteChange =
    direction === "up"
      ? VOTE_VALUES.VOTE_CHANGE_MULTIPLIER
      : -VOTE_VALUES.VOTE_CHANGE_MULTIPLIER;

  return {
    newVoteCount: currentVotes + voteChange,
    newUserVote: direction,
  };
}
