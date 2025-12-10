import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCommunityByName } from "@/entities/community";
import { Feed } from "@/widgets/feed";
import { useIsAuthenticated } from "@/entities/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Users, Loader2 } from "lucide-react";
import { prefetchQueries } from "@/shared/api/gql/query-hooks";

export const Route = createFileRoute("/_main/r/$communityId")({
  component: CommunityPage,
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { communityId: communityName } = params;

    await prefetchQueries.communityByName(queryClient, communityName);

    return { communityName };
  },
  pendingComponent: CommunityLoadingSkeleton,
  staleTime: 5 * 60 * 1000,
});

function CommunityLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading community...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunityPage() {
  const { communityId: communityName } = Route.useParams();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { community, isLoading } = useCommunityByName(communityName);

  if (isLoading) {
    return <CommunityLoadingSkeleton />;
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
                <CardDescription className="text-base">{community.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {community.members.toLocaleString()}{" "}
                {community.members === 1 ? "member" : "members"}
              </span>
            </div>
          </div>
          {isAuthenticated && community && (
            <div className="mt-4">
              <Button
                onClick={() =>
                  navigate({
                    search: { communityId: community.id },
                    to: "/submit",
                  })
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
