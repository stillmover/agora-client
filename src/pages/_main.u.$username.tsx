import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useUserByUsername } from "@/entities/user";
import { useUserPosts } from "@/entities/post";
import { useUserComments } from "@/entities/comment";
import { PostCard } from "@/widgets/post-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Calendar, Award, MessageSquare, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_main/u/$username")({
  component: UserProfilePage,
});

function UserProfilePage() {
  const { username } = Route.useParams();
  const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

  const { user, isLoading: userLoading } = useUserByUsername(username);
  const { posts, isLoading: postsLoading } = useUserPosts(user?.id ?? "", 20, 0);
  const { comments, isLoading: commentsLoading } = useUserComments(user?.id ?? "", 20, 0);

  if (userLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-4 bg-muted animate-pulse rounded w-1/2 mt-2" />
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
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
              <CardTitle className="text-2xl">u/{user.username}</CardTitle>
              {user.name && (
                <CardDescription className="text-base mt-1">{user.name}</CardDescription>
              )}
              {user.bio && <p className="text-sm text-muted-foreground mt-2">{user.bio}</p>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{user.karma.toLocaleString()} karma</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Joined{" "}
                {formatDistanceToNow(new Date(user.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "posts" | "comments")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments
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
                <p className="text-muted-foreground">No posts yet</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} showCommunity />)
          )}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4 mt-4">
          {commentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : comments.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No comments yet</p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="secondary">Post</Badge>
                    <span>
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <span>• {comment.votes} points</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
