import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, Suspense } from "react";
import { ROUTES } from "@/shared/config";
import { useSavedPosts } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useIsAuthenticated } from "@/entities/session";
import { PostCard } from "@/widgets/post-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button, Spinner } from "@/shared/ui";
import { Bookmark, LogIn, AlertCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_main/saved")({
  component: SavedPostsPage,
});

const redirectToLogin = () => {
  window.location.href = `${ROUTES.LOGIN}?redirect=${ROUTES.SAVED}`;
};

function SavedPostsPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SavedPostsPageContent />
    </Suspense>
  );
}

function SavedPostsPageContent() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { posts, isLoading, error, refetch } = useSavedPosts(20, 0, isAuthenticated);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await refetch();
    setIsRetrying(false);
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <LogIn className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view saved posts</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to access your saved posts.
          </p>
          <Button onClick={redirectToLogin}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Saved Posts
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="h-5 w-5" />
              Saved Posts
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to load saved posts</h2>
            <p className="text-muted-foreground mb-4">
              {error.message || "Something went wrong. Please try again."}
            </p>
            <Button onClick={handleRetry} disabled={isRetrying} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`} />
              {isRetrying ? "Retrying..." : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Saved Posts
          </CardTitle>
          <CardDescription>Posts you've saved for later</CardDescription>
        </CardHeader>
      </Card>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved posts yet</h2>
            <p className="text-muted-foreground mb-4">
              Save posts to read them later. They'll appear here.
            </p>
            <Button onClick={() => navigate({ to: ROUTES.HOME })}>Browse Posts</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} showCommunity />
          ))}
        </div>
      )}
    </div>
  );
}
