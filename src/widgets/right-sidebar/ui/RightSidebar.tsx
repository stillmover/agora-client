import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";

import { usePopularCommunities } from "@/entities/community";
import type { Community } from "@/entities/community";
import { useCommunityActions } from "@/features/community";
import { useIsAuthenticated } from "@/entities/session";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  SkeletonCommunityList,
} from "@/shared/ui";
import { logger } from "@/shared/services/logger";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

const CommunityItem = ({ community, rank }: { community: Community; rank: number }) => {
  const isAuthenticated = useIsAuthenticated();
  const { join, isJoined, isPending, joinLabel } = useCommunityActions(
    community.id,
    community.isJoined ?? false
  );

  const handleJoin = async () => {
    if (isJoined) {
      return;
    }
    try {
      await join();
    } catch (error) {
      logger.error("Failed to join community:", error);
    }
  };

  return (
    <div className="flex items-center gap-3 group py-1.5">
      <span
        className={cn(
          "w-5 text-center text-sm font-bold",
          rank <= 3 ? "text-brand" : "text-muted-foreground"
        )}
      >
        {rank}
      </span>

      <Avatar className="h-9 w-9 ring-2 ring-background">
        <AvatarImage src={community.iconUrl} alt={community.name} />
        <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-brand to-orange-400 text-white">
          {community.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <Link
          to="/r/$communityId"
          params={{ communityId: community.name }}
          className="text-sm font-medium hover:text-brand transition-colors truncate block"
        >
          r/{community.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {community.members.toLocaleString()} members
        </p>
      </div>

      {isAuthenticated && (
        <Button
          size="xs"
          variant={isJoined ? "subtle" : "brand"}
          className={cn(
            "opacity-0 group-hover:opacity-100 transition-opacity",
            isJoined && "opacity-100"
          )}
          onClick={handleJoin}
          disabled={isJoined || isPending}
        >
          {joinLabel}
        </Button>
      )}
    </div>
  );
};

export const RightSidebar = () => {
  const { communities, isLoading, error } = usePopularCommunities();

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] space-y-4">
      <div className="flex-1 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" />
              Popular Communities
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {error ? (
              <div className="py-4 text-center">
                <p className="text-sm text-muted-foreground">Failed to load communities</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => globalThis.location.reload()}
                >
                  Try again
                </Button>
              </div>
            ) : isLoading ? (
              <SkeletonCommunityList count={5} />
            ) : (
              <div className="space-y-1">
                {communities.slice(0, 5).map((community, index) => (
                  <CommunityItem key={community.id} community={community} rank={index + 1} />
                ))}
                <Link
                  to={ROUTES.SEARCH}
                  search={{ q: "", type: "communities" }}
                  className={cn(
                    "flex items-center justify-between py-2 px-1 mt-2 mx-auto",
                    "text-sm text-muted-foreground hover:text-foreground",
                    "transition-colors rounded-lg hover:bg-accent"
                  )}
                >
                  <p className="text-center px-auto mx-auto">See more</p>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="text-xs text-muted-foreground space-y-2 px-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:text-foreground transition-colors">
            Content Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            User Agreement
          </a>
        </div>
        <p className="text-muted-foreground/60">© 2026 Agora Inc. All rights reserved.</p>
      </div>
    </div>
  );
};
