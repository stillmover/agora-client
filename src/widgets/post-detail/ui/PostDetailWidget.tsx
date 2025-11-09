import { Link } from "@tanstack/react-router";
import { VoteColumn } from "@/features/vote";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Clock, MessageSquare } from "lucide-react";
import { formatRelativeTime, formatCommentCount } from "@/shared/services";
import type { Post } from "@/entities/post";

interface PostDetailWidgetProps {
  post: Post;
}

export const PostDetailWidget = ({ post }: PostDetailWidgetProps) => {
  const timeAgo = formatRelativeTime(post.createdAt);

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <VoteColumn postId={post.id} score={post.score} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Link
                to="/r/$communityId"
                params={{ communityId: post.community.id }}
                className="hover:underline"
              >
                <Badge variant="secondary" className="text-xs">
                  r/{post.community.name}
                </Badge>
              </Link>
              <span className="text-xs text-muted-foreground">
                Posted by {post.author.name}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pl-16">
          <p className="text-base whitespace-pre-wrap mb-4">{post.content}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{formatCommentCount(post.comments)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
