export const calculateVoteValue = (
  currentVote: -1 | 0 | 1,
  direction: "up" | "down"
): -1 | 0 | 1 => {
  const voteValue = direction === "up" ? 1 : -1;
  return currentVote === voteValue ? 0 : (voteValue as -1 | 1);
};

export const getVoteState = (currentVote: -1 | 0 | 1) => ({
  hasDownvoted: currentVote === -1,
  hasUpvoted: currentVote === 1,
});
