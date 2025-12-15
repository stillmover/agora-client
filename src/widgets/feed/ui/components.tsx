import { Link } from "@tanstack/react-router";
import { AlertCircle, RefreshCw, FileX2, Sparkles, CheckCircle2 } from "lucide-react";
import { UI_TEXT } from "@/shared/constants";
import { ROUTES } from "@/shared/config";
import { Button, Card, CardContent, SkeletonPostCard } from "@/shared/ui";
import { LOADING_MORE_SKELETON_COUNT } from "../lib/constants";

const PostSkeleton = () => <SkeletonPostCard />;

const FeedError = ({ onRetry }: { onRetry?: VoidFunction }) => (
  <Card className="border-destructive/30 bg-destructive/5">
    <CardContent className="p-8 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load posts</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        We couldn&apos;t fetch the latest posts. Please check your connection and try again.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={onRetry ?? (() => globalThis.location?.reload())}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </Button>
      </div>
    </CardContent>
  </Card>
);

const FeedEmpty = ({ communityId }: { communityId?: string }) => (
  <Card>
    <CardContent className="p-12 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileX2 className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {communityId ? "No posts yet" : "Nothing here yet"}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
        {communityId
          ? "Be the first to share something in this community!"
          : "Looks like there aren't any posts to show. Follow some communities or check back later."}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="brand" asChild>
          <Link to={ROUTES.CREATE_POST}>
            <Sparkles className="h-4 w-4 mr-2" />
            Create a post
          </Link>
        </Button>
        {!communityId && (
          <Button variant="outline" asChild>
            <Link to={ROUTES.SEARCH} search={{ q: "", type: "communities" }}>
              Discover communities
            </Link>
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const FeedLoading = () => (
  <div className="space-y-4 animate-in">
    {Array.from({ length: UI_TEXT.LOADING.SKELETON_COUNT }, (_, index) => (
      <SkeletonPostCard key={`skeleton-${index}`} />
    ))}
  </div>
);

const LoadingMoreIndicator = () => (
  <div className="space-y-4 py-4">
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
      <span>Loading more posts...</span>
    </div>
    {Array.from({ length: LOADING_MORE_SKELETON_COUNT }, (_, index) => (
      <SkeletonPostCard key={`loading-more-${index}`} />
    ))}
  </div>
);

const EndOfFeed = () => (
  <div className="py-8 text-center">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-success" />
      <span>You&apos;re all caught up!</span>
    </div>
    <p className="text-xs text-muted-foreground mt-2">Come back later for new posts</p>
  </div>
);

export { PostSkeleton, FeedError, FeedEmpty, FeedLoading, LoadingMoreIndicator, EndOfFeed };
