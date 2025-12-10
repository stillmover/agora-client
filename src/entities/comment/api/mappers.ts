import type { Comment as GraphQLComment } from "@/shared/api/gql";
import type { Comment } from "../model/types";

export const mapComment = (comment: GraphQLComment): Comment => ({
  author: {
    id: comment.author.id,
    name: comment.author.name || comment.author.username,
  },
  content: comment.content,
  createdAt: comment.createdAt,
  id: comment.id,
  parentId: comment.parentId ?? undefined,
  postId: comment.post.id,
  replies: comment.replies.map(mapComment),
  votes: comment.score,
});
