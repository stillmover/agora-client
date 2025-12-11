import { memo } from "react";
import { PostCardContent, type Post } from "@/entities/post";
import { VoteColumn } from "@/features/vote";
import { PostActions } from "@/features/post-actions";
import { PostMenu } from "@/features/post-menu";

interface PostCardProps {
  post: Post;
  showCommunity?: boolean;
}

const PostCard = memo(({ post, showCommunity = true }: PostCardProps) => (
  <PostCardContent
    post={post}
    showCommunity={showCommunity}
    voteColumn={<VoteColumn postId={post.id} score={post.score} userVote={post.userVote ?? 0} />}
    postMenu={<PostMenu post={post} />}
    postActions={<PostActions post={post} />}
  />
));

PostCard.displayName = "PostCard";

export { PostCard };
