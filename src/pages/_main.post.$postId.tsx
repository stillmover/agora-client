import { createFileRoute } from "@tanstack/react-router";
import { usePost } from "@/entities/post/model/usePosts";
import { useComments } from "@/shared/api";
import { PostDetailWidget } from "@/widgets/post-detail";
import { CommentSectionWidget } from "@/widgets/comment-section";
import { PostLoadingSkeletonWidget } from "@/widgets/post-loading-skeleton";
import { PostNotFoundWidget } from "@/widgets/post-not-found";

export const Route = createFileRoute("/_main/post/$postId")({
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();

  const { post, isLoading: postLoading } = usePost(postId);
  const { comments, isLoading: commentsLoading } = useComments(postId);

  const isLoading = postLoading || commentsLoading;

  if (isLoading) {
    return <PostLoadingSkeletonWidget />;
  }

  if (!post) {
    return <PostNotFoundWidget />;
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <PostDetailWidget post={post} />
      <CommentSectionWidget postId={postId} comments={comments} />
    </div>
  );
}
