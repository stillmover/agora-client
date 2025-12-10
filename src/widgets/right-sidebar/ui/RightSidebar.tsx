import { Link } from "@tanstack/react-router";
import { Plus, TrendingUp, Sparkles, ChevronRight, Trophy } from "lucide-react";

import { usePopularCommunities } from "@/entities/community";
import type { Community } from "@/entities/community";
import { useCommunityActions } from "@/features/community";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  SkeletonCommunityList,
} from "@/shared/ui";
import { logger } from "@/shared/services/logger";
import { cn } from "@/shared/lib/utils";

const CommunityItem = ({ community, rank }: { community: Community; rank: number }) => {
  const { toggleJoin, isJoined, joinLabel } = useCommunityActions(community.id);

  const handleJoin = async () => {
    try {
      await toggleJoin();
    } catch (error) {
      logger.error("Failed to join/leave community:", error);
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
          params={{ communityId: community.id }}
          className="text-sm font-medium hover:text-brand transition-colors truncate block"
        >
          r/{community.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {community.members.toLocaleString()} members
        </p>
      </div>

      <Button
        size="xs"
        variant={isJoined ? "subtle" : "brand"}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isJoined && "opacity-100"
        )}
        onClick={handleJoin}
      >
        {joinLabel}
      </Button>
    </div>
  );
};

export const RightSidebar = () => {
  const { communities, isLoading, error } = usePopularCommunities();

  return (
    <div className="space-y-4">
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
                onClick={() => window.location.reload()}
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
                to="/search"
                search={{ q: "", type: "communities" }}
                className={cn(
                  "flex items-center justify-between py-2 px-1 mt-2",
                  "text-sm text-muted-foreground hover:text-foreground",
                  "transition-colors rounded-lg hover:bg-accent"
                )}
              >
                <span>See all communities</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand/10 via-orange-500/5 to-transparent p-6">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                "bg-brand text-white shadow-lg",
                "group-hover:scale-105 transition-transform"
              )}
            >
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Create a Community</h3>
              <p className="text-xs text-muted-foreground">Build your own space</p>
            </div>
          </div>
          <Button variant="brand" size="sm" className="w-full mt-4" asChild>
            <Link to="/submit">
              <Plus className="h-4 w-4 mr-2" />
              Get Started
            </Link>
          </Button>
        </div>
      </Card>

      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">Agora Premium</h3>
                <Badge className="bg-amber-500 text-white text-[10px]">NEW</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Ad-free browsing, exclusive features, and more.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground space-y-2 px-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a
            href="https://www.redditinc.com/policies/content-policy"
            className="hover:text-foreground transition-colors"
          >
            Content Policy
          </a>
          <a
            href="https://www.redditinc.com/policies/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.redditinc.com/policies/user-agreement"
            className="hover:text-foreground transition-colors"
          >
            User Agreement
          </a>
        </div>
        <p className="text-muted-foreground/60">© 2025 Agora Inc. All rights reserved.</p>
      </div>
    </div>
  );
};
