import type { Post as GraphQLPost } from "@/shared/api/gql";
import { VoteType } from "@/shared/api/gql";
import type { Post } from "../model/types";

const mapVoteType = (voteType: VoteType | null | undefined): -1 | 0 | 1 => {
  if (!voteType) return 0;
  return voteType === VoteType.Upvote ? 1 : -1;
};

export const mapPost = (post: GraphQLPost): Post => {
  return {
    id: post.id,
    title: post.title,
    content: post.content ?? undefined,
    score: post.score,
    comments: post.commentCount,
    isSaved: post.isSaved ?? undefined,
    userVote: mapVoteType(post.userVote),
    createdAt: post.createdAt,
    community: {
      id: post.community.id,
      name: post.community.name,
      iconUrl: post.community.iconUrl ?? undefined,
      members: 0,
      isJoined: false,
      description: post.community.description ?? undefined,
    },
    author: {
      id: post.author.id,
      name: post.author.name || post.author.username,
    },
    media:
      post.media.length > 0
        ? {
            type: post.media[0].type as "image" | "video" | "link",
            url: post.media[0].url,
            thumb:
              post.media[0].thumb ?? post.media[0].thumbnailUrl ?? undefined,
          }
        : undefined,
    flairs: post.flairs.map((flair) => ({
      id: flair.id,
      label: flair.label,
      color: flair.color ?? undefined,
    })),
  };
};
