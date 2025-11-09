import { useCallback } from "react";
import { useVotePostMutation } from "@/shared/api";
import { usePostVote, clientStateActions } from "@/shared/stores";
import { VoteType } from "@/shared/api/gql";

export const useVote = (postId: string) => {
  const currentVote = usePostVote(postId);
  const [, executeMutation] = useVotePostMutation();

  const vote = useCallback(
    async (direction: "up" | "down") => {
      const voteValue = direction === "up" ? 1 : -1;

      const oldVote = currentVote;

      let newVote: -1 | 0 | 1 = 0;
      if (currentVote === voteValue) {
        newVote = 0;
      } else {
        newVote = voteValue as -1 | 1;
      }

      clientStateActions.votePost(postId, newVote);

      try {
        const voteType: VoteType =
          direction === "up" ? VoteType.Upvote : VoteType.Downvote;

        const result = await executeMutation({
          postId,
          voteType,
        });

        if (result.error) {
          throw result.error;
        }
      } catch (error) {
        clientStateActions.votePost(postId, oldVote);
        throw error;
      }
    },
    [postId, currentVote, executeMutation],
  );

  return {
    vote,
    currentVote,
    hasUpvoted: currentVote === 1,
    hasDownvoted: currentVote === -1,
  };
};
