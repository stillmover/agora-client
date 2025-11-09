import type { Post as GraphQLPost, Community as GraphQLCommunity, Comment as GraphQLComment } from "./index";
import { VoteType } from "./index";
import type { Post } from "@/entities/post";
import type { Community } from "@/entities/community";
import type { Comment } from "@/entities/comment";

/**
 * Maps GraphQL VoteType enum to numeric vote value
 */
export const mapVoteType = (voteType: VoteType | null | undefined): -1 | 0 | 1 => {
  if (!voteType) return 0;
  return voteType === VoteType.Upvote ? 1 : -1;
};

/**
 * Maps GraphQL Post to Entity Post
 */
export const mapPost = (post: GraphQLPost): Post => {
  return {
    id: post.id,
    title: post.title,
    content: post.content ?? undefined,
    score: post.score,
    comments: post.commentCount, // Map commentCount → comments
    isSaved: post.isSaved ?? undefined,
    userVote: mapVoteType(post.userVote),
    createdAt: post.createdAt,
    community: {
      id: post.community.id,
      name: post.community.name,
      iconUrl: post.community.iconUrl ?? undefined,
      members: 0, // Will be set separately if needed
      isJoined: false, // Will be set separately if needed
      description: post.community.description ?? undefined,
    },
    author: {
      id: post.author.id,
      name: post.author.name || post.author.username,
    },
    media: post.media.length > 0 ? {
      type: post.media[0].type as "image" | "video" | "link",
      url: post.media[0].url,
      thumb: post.media[0].thumb ?? post.media[0].thumbnailUrl ?? undefined,
    } : undefined,
    flairs: post.flairs.map(flair => ({
      id: flair.id,
      label: flair.label,
      color: flair.color ?? undefined,
    })),
  };
};

/**
 * Maps GraphQL Community to Entity Community
 */
export const mapCommunity = (community: GraphQLCommunity): Community => {
  return {
    id: community.id,
    name: community.name,
    iconUrl: community.iconUrl ?? undefined,
    members: community.memberCount, // Map memberCount → members
    isJoined: community.isJoined ?? false,
    description: community.description ?? undefined,
  };
};

/**
 * Maps GraphQL Comment to Entity Comment
 */
export const mapComment = (comment: GraphQLComment): Comment => {
  return {
    id: comment.id,
    postId: comment.post.id,
    author: {
      id: comment.author.id,
      name: comment.author.name || comment.author.username,
    },
    content: comment.content,
    votes: comment.score,
    createdAt: comment.createdAt,
    parentId: comment.parentId ?? undefined,
    replies: comment.replies.map(mapComment),
  };
};

