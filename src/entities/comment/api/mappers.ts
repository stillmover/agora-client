import type { Comment as GraphQLComment } from "@/shared/api/gql";
import type { Comment } from "../model/types";

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
