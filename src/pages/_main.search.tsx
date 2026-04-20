import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { useSearchPosts, useSearchCommunities, useSearchUsers } from "@/features/search";
import type { SearchType } from "@/features/search";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Search, FileText, Users, User, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { Spinner } from "@/shared/ui";

const PostCard = lazy(() =>
  import("@/widgets/post-card").then((module) => ({ default: module.PostCard }))
);

export const Route = createFileRoute("/_main/search")({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
    type: (search.type as SearchType) || "posts",
  }),
});

function SearchPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  const { q: initialQuery, type: initialType } = Route.useSearch();
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchType>(initialType);

  const {
    posts,
    isLoading: postsLoading,
    isSearching: postsSearching,
    isPending: postsPending,
  } = useSearchPosts(query);

  const {
    communities,
    isLoading: communitiesLoading,
    isSearching: communitiesSearching,
    isPending: communitiesPending,
  } = useSearchCommunities(query);

  const {
    users,
    isLoading: usersLoading,
    isSearching: usersSearching,
    isPending: usersPending,
  } = useSearchUsers(query);

  const isSearching = query.length >= 2;
  const isTyping = postsPending || communitiesPending || usersPending;
  const isFetching = postsSearching || communitiesSearching || usersSearching;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </CardTitle>
          <CardDescription>Find posts, communities, and users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search Reddit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {(isTyping || isFetching) && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {query && query.length < 2 && (
            <p className="text-sm text-muted-foreground mt-2">
              Enter at least 2 characters to search
            </p>
          )}
          {isTyping && query.length >= 2 && (
            <p className="text-sm text-muted-foreground mt-2">Searching...</p>
          )}
        </CardContent>
      </Card>

      {isSearching && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SearchType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Posts</span>
              <Badge variant="secondary" className={cn("ml-1", postsLoading && "opacity-50")}>
                {posts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Communities</span>
              <Badge variant="secondary" className={cn("ml-1", communitiesLoading && "opacity-50")}>
                {communities.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Users</span>
              <Badge variant="secondary" className={cn("ml-1", usersLoading && "opacity-50")}>
                {users.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4 mt-4">
            {postsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{`No posts found for "${query}"`}</p>
                </CardContent>
              </Card>
            ) : (
              <div className={cn("space-y-4", postsSearching && "opacity-75 transition-opacity")}>
                {posts.map((post) => (
                  <Suspense
                    key={post.id}
                    fallback={<div className="h-32 bg-muted animate-pulse rounded" />}
                  >
                    <PostCard post={post} showCommunity />
                  </Suspense>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="communities" className="space-y-4 mt-4">
            {communitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : communities.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{`No communities found for "${query}"`}</p>
                </CardContent>
              </Card>
            ) : (
              <div
                className={cn("space-y-4", communitiesSearching && "opacity-75 transition-opacity")}
              >
                {communities.map((community) => (
                  <Link
                    key={community.id}
                    to="/r/$communityId"
                    params={{ communityId: community.name }}
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                            {community.iconUrl ? (
                              <img
                                src={community.iconUrl}
                                alt={community.name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              community.name[0].toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">r/{community.name}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {community.members.toLocaleString()} members
                              </span>
                            </div>
                            {community.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {community.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4 mt-4">
            {usersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{`No users found for "${query}"`}</p>
                </CardContent>
              </Card>
            ) : (
              <div className={cn("space-y-4", usersSearching && "opacity-75 transition-opacity")}>
                {users.map((user) => (
                  <Link key={user.id} to="/u/$username" params={{ username: user.username }}>
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                            {user.avatarUrl ? (
                              <img
                                src={user.avatarUrl}
                                alt={user.username}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              user.username[0].toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">u/{user.username}</span>
                              <span className="text-sm text-muted-foreground">
                                {user.karma.toLocaleString()} karma
                              </span>
                            </div>
                            {user.bio && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {user.bio}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Joined{" "}
                              {formatDistanceToNow(new Date(user.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!isSearching && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Start searching</h2>
            <p className="text-muted-foreground">
              Enter a search term to find posts, communities, and users
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
