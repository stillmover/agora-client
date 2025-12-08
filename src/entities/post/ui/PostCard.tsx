import { memo } from "react";
import type { Post } from "@/entities/post";
import { VoteColumn } from "@/features/vote";
import { PostActions } from "@/features/post-actions";
import { PostMenu } from "@/features/post-menu";
import { PostCardContent } from "./PostCardContent";

type PostCardProps = {
  post: Post;
  showCommunity?: boolean;
};

export const PostCard = memo(
  ({ post, showCommunity = true }: PostCardProps) => {
    return (
      <PostCardContent
        post={post}
        showCommunity={showCommunity}
        voteColumn={<VoteColumn postId={post.id} score={post.score} />}
        postMenu={<PostMenu post={post} />}
        postActions={<PostActions post={post} />}
      />
    );
  },
);

PostCard.displayName = "PostCard";
