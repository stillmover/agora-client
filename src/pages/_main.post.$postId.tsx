import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { usePost } from "@/entities/post";
import { useComments } from "@/entities/comment";
import { PostDetailWidget } from "@/widgets/post-detail";
import { CommentSectionWidget } from "@/widgets/comment-section";
import { PostLoadingSkeletonWidget } from "@/widgets/post-loading-skeleton";
import { PostNotFoundWidget } from "@/widgets/post-not-found";
import { prefetchQueries } from "@/shared/api/gql/query-hooks";
import { Spinner } from "@/shared/ui";

export const Route = createFileRoute("/_main/post/$postId")({
  component: PostDetailPage,
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { postId } = params;

    await Promise.all([
      prefetchQueries.post(queryClient, postId),
      prefetchQueries.comments(queryClient, postId),
    ]);

    return { postId };
  },
  staleTime: 2 * 60 * 1000,
});

function PostDetailPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <PostDetailPageContent />
    </Suspense>
  );
}

function PostDetailPageContent() {
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
