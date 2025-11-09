import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCommunity } from "@/entities/community/model/useCommunities";
import { usePosts } from "@/entities/post/model/usePosts";
import { Feed } from "@/widgets/feed";
import { useIsAuthenticated } from "@/entities/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Users } from "lucide-react";

export const Route = createFileRoute("/_main/r/$communityId")({
  component: CommunityPage,
});

function CommunityPage() {
  const { communityId } = Route.useParams();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  const { community, isLoading: communityLoading } = useCommunity(communityId);
  const { posts, isLoading: postsLoading } = usePosts({ communityId });

  const isLoading = communityLoading || postsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-8 bg-muted animate-pulse rounded w-1/3"></div>
          </CardHeader>
        </Card>
        <Feed />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Community not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  r/{community.name}
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-2">{community.name}</CardTitle>
              {community.description && (
                <CardDescription className="text-base">
                  {community.description}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </span>
            </div>
          </div>
          {isAuthenticated && (
            <div className="mt-4">
              <Button
                onClick={() =>
                  navigate({ to: "/submit", search: { communityId } })
                }
                className="w-full"
              >
                Create Post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Feed />
    </div>
  );
}
