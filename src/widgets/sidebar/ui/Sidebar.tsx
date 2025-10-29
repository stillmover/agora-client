import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Community } from "@/entities/community";
import { ROUTES } from "@/shared/config";
import { fetchCommunities } from "@/shared/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Home, TrendingUp, Users } from "lucide-react";

export const Sidebar = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCommunities().then((data) => {
      setCommunities(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <aside className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Home className="h-4 w-4" />
            Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            to="/r/$communityId"
            params={{ communityId: "react" }}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            Popular
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Communities
          </CardTitle>
          <CardDescription className="text-xs">
            Browse communities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {isLoading ? (
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-muted animate-pulse rounded"
                ></div>
              ))}
            </div>
          ) : (
            communities.map((community) => (
              <Link
                key={community.id}
                to="/r/$communityId"
                params={{ communityId: community.id }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Badge variant="secondary" className="text-xs">
                  r/{community.name}
                </Badge>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </aside>
  );
};
