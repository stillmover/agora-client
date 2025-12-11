import type { Post as GraphQLPost } from "@/shared/api/gql";
import { VoteType } from "@/shared/api/gql";
import { mapCommunity } from "@/entities/community/api/mappers";
import type { Post } from "../model/types";

const mapVoteType = (voteType: VoteType | null | undefined): -1 | 0 | 1 => {
  if (!voteType) {
    return 0;
  }
  return voteType === VoteType.Upvote ? 1 : -1;
};

export const mapPost = (post: GraphQLPost): Post => {
  const primaryMedia = post.media?.[0];

  return {
    author: {
      id: post.author.id,
      name: post.author.name || post.author.username,
    },
    comments: post.commentCount ?? 0,
    community: mapCommunity(post.community),
    content: post.content ?? undefined,
    createdAt: post.createdAt,
    flairs: post.flairs.map((flair) => ({
      color: flair.color ?? undefined,
      id: flair.id,
      label: flair.label,
    })),
    id: post.id,
    isSaved: Boolean(post.isSaved),
    media:
      primaryMedia && post.media.length > 0
        ? {
            thumb: primaryMedia.thumb ?? primaryMedia.thumbnailUrl ?? undefined,
            type: primaryMedia.type as "image" | "video" | "link",
            url: primaryMedia.url,
          }
        : undefined,
    score: post.score ?? 0,
    title: post.title,
    userVote: mapVoteType(post.userVote),
  };
};
