import type { Post as GraphQLPost } from "@/shared/api/gql";
import { VoteType } from "@/shared/api/gql";
import { hydrateJoinedCommunity } from "@/entities/community/api/mappers";
import type { Post } from "../model/types";

const mapVoteType = (voteType: VoteType | null | undefined): -1 | 0 | 1 => {
  if (!voteType) {
    return 0;
  }
  return voteType === VoteType.Upvote ? 1 : -1;
};

export const mapPost = (post: GraphQLPost): Post => {
  hydrateJoinedCommunity(post.community);

  return {
    author: {
      id: post.author.id,
      name: post.author.name || post.author.username,
    },
    comments: post.commentCount,
    community: {
      description: post.community.description ?? undefined,
      iconUrl: post.community.iconUrl ?? undefined,
      id: post.community.id,
      isJoined: post.community.isJoined ?? false,
      members: post.community.memberCount,
      name: post.community.name,
    },
    content: post.content ?? undefined,
    createdAt: post.createdAt,
    flairs: post.flairs.map((flair) => ({
      color: flair.color ?? undefined,
      id: flair.id,
      label: flair.label,
    })),
    id: post.id,
    isSaved: post.isSaved ?? undefined,
    media:
      post.media.length > 0
        ? {
            thumb: post.media[0].thumb ?? post.media[0].thumbnailUrl ?? undefined,
            type: post.media[0].type as "image" | "video" | "link",
            url: post.media[0].url,
          }
        : undefined,
    score: post.score,
    title: post.title,
    userVote: mapVoteType(post.userVote),
  };
};
