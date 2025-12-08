import { VoteType } from "./index";

export const mapVoteType = (
  voteType: VoteType | null | undefined,
): -1 | 0 | 1 => {
  if (!voteType) return 0;
  return voteType === VoteType.Upvote ? 1 : -1;
};

