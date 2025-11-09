import { Link } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";

import { usePopularCommunities, type Community } from "@/entities/community";
import { useCommunityActions } from "@/features/community";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { logger } from "@/shared/services/logger";

// Separate component for community item to properly use hooks
const CommunityItem = ({ community }: { community: Community }) => {
  const { toggleJoin, isJoined, joinLabel } = useCommunityActions(community.id);

  const handleJoin = async () => {
    try {
      await toggleJoin();
    } catch (error) {
      logger.error("Failed to join/leave community:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 group">
      <Avatar className="h-8 w-8">
        <AvatarImage src={community.iconUrl} alt={community.name} />
        <AvatarFallback className="text-xs">
          r/{community.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            to="/r/$communityId"
            params={{ communityId: community.id }}
            className="text-sm font-medium hover:underline truncate"
          >
            r/{community.name}
          </Link>
          {isJoined && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              Joined
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {community.members.toLocaleString()} members
        </p>
      </div>
      <Button
        size="sm"
        variant={isJoined ? "secondary" : "outline"}
        className="h-7 px-2 text-xs"
        onClick={handleJoin}
      >
        {joinLabel}
      </Button>
    </div>
  );
};

export const RightSidebar = () => {
  const { communities, isLoading, error } = usePopularCommunities();

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Failed to load communities
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Popular Communities Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Popular Communities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {communities.slice(0, 7).map((community) => (
                <CommunityItem key={community.id} community={community} />
              ))}
              <Link
                to="/communities"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View more
              </Link>
            </>
          )}
        </CardContent>
      </Card>

      {/* Create Community Card */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">
                Create your community
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Share your interests with the world
              </p>
            </div>
            <Button size="sm" className="w-full" asChild>
              <Link to="/communities/create">Create</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
