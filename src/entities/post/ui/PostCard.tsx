import { Link } from "@tanstack/react-router";
import type { Post } from "@/entities/post";
import { Card, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { VoteColumn } from "@/features/vote";
import { PostActions } from "@/features/post-actions";
import { PostMenu } from "@/features/post-menu";
import { FlairBadge } from "@/shared/ui/flair-badge";
import { Clock, ExternalLink, Image as ImageIcon, Video } from "lucide-react";
import { formatRelativeTime } from "@/shared/services";

type PostCardProps = {
  post: Post;
  showCommunity?: boolean;
};

export const PostCard = ({ post, showCommunity = true }: PostCardProps) => {
  const timeAgo = formatRelativeTime(post.createdAt);

  return (
    <Card className="hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-orange-500">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <VoteColumn postId={post.id} score={post.score} />
          </div>

          <div className="flex-1 min-w-0">
            <header
              className="flex items-start gap-2 mb-2 flex-wrap"
              role="banner"
            >
              {showCommunity && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={post.community.iconUrl}
                      alt={`${post.community.name} community avatar`}
                    />
                    <AvatarFallback className="text-xs">
                      r/{post.community.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    to="/r/$communityId"
                    params={{ communityId: post.community.id }}
                    className="hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
                    aria-label={`Go to r/${post.community.name} community`}
                  >
                    <Badge variant="secondary" className="text-xs">
                      r/{post.community.name}
                    </Badge>
                  </Link>
                </div>
              )}

              <span className="text-xs text-muted-foreground">
                Posted by{" "}
                <span className="hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1">
                  u/{post.author.name}
                </span>
              </span>

              <time
                className="text-xs text-muted-foreground flex items-center gap-1"
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString()}
              >
                <Clock className="h-3 w-3" aria-hidden="true" />
                {timeAgo}
              </time>

              <div className="ml-auto">
                <PostMenu post={post} />
              </div>
            </header>

            {post.flairs && post.flairs.length > 0 && (
              <div className="flex gap-1 mb-2 flex-wrap">
                {post.flairs.map((flair) => (
                  <FlairBadge key={flair.id} flair={flair} size="sm" />
                ))}
              </div>
            )}

            <Link
              to="/post/$postId"
              params={{ postId: post.id }}
              className="hover:underline block focus-visible:ring-2 focus-visible:ring-orange-500 rounded p-1 -m-1"
              aria-label={`Read full post: ${post.title}`}
            >
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {post.title}
              </h3>
            </Link>

            {post.media && (
              <figure
                className="mb-3"
                aria-label={`${post.media.type} content`}
              >
                <MediaPreview media={post.media} />
              </figure>
            )}

            {post.text && (
              <Link
                to="/post/$postId"
                params={{ postId: post.id }}
                className="block focus-visible:ring-2 focus-visible:ring-orange-500 rounded p-1 -m-1"
              >
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.text}
                </p>
              </Link>
            )}

            {/* Actions */}
            <footer
              className="mt-4"
              role="contentinfo"
              aria-label="Post actions"
            >
              <PostActions post={post} />
            </footer>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

const MediaPreview = ({ media }: { media: Post["media"] }) => {
  if (!media) {
    return null;
  }

  const getMediaIcon = () => {
    switch (media.type) {
      case "image":
        return <ImageIcon className="h-4 w-4" aria-hidden="true" />;
      case "video":
        return <Video className="h-4 w-4" aria-hidden="true" />;
      case "link":
        return <ExternalLink className="h-4 w-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted">
      {media.type === "image" && media.thumb ? (
        <img
          src={media.thumb}
          alt={`Post image: ${media.type}`}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div
          className="w-full h-32 flex items-center justify-center text-muted-foreground"
          role="img"
          aria-label={`${media.type} content placeholder`}
        >
          <div className="flex items-center gap-2">
            {getMediaIcon()}
            <span className="text-sm capitalize">{media.type}</span>
          </div>
        </div>
      )}
    </div>
  );
};
