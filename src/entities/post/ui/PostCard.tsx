import { Link } from "@tanstack/react-router";
import type { Post } from "@/entities/post";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { VoteButton } from "@/features/vote";
import { MessageSquare, Clock } from "lucide-react";
import { formatRelativeTime, formatCommentCount, logger } from "@/shared/utils";
import type { VoteDirection } from "@/shared/constants";

type PostCardProps = {
  post: Post;
  showCommunity?: boolean;
};

export const PostCard = ({ post, showCommunity = true }: PostCardProps) => {
  const handleVote = (direction: VoteDirection) => {
    logger.debug(`Voted ${direction} on post ${post.id}`);
  };

  const timeAgo = formatRelativeTime(post.createdAt);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <VoteButton votes={post.votes} onVote={handleVote} size="md" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              {showCommunity && (
                <Link
                  to="/r/$communityId"
                  params={{ communityId: post.communityId }}
                  className="hover:underline"
                >
                  <Badge variant="secondary" className="text-xs">
                    r/{post.communityId}
                  </Badge>
                </Link>
              )}
              <span className="text-xs text-muted-foreground">
                Posted by {post.author}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeAgo}
              </span>
            </div>
            <Link
              to="/post/$postId"
              params={{ postId: post.id }}
              className="hover:underline"
            >
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link to="/post/$postId" params={{ postId: post.id }} className="block">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {post.content}
          </p>
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link
            to="/post/$postId"
            params={{ postId: post.id }}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{formatCommentCount(post.commentCount)}</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
