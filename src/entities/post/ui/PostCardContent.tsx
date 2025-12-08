import { memo } from "react";
import { Link } from "@tanstack/react-router";
import type { Post } from "@/entities/post";
import { Card } from "@/shared/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { FlairBadge } from "@/shared/ui/flair-badge";
import { ExternalLink, Image as ImageIcon, Play, Link2 } from "lucide-react";
import { formatRelativeTime } from "@/shared/services";
import type { ReactNode } from "react";

type PostCardContentProps = {
  post: Post;
  showCommunity?: boolean;
  voteColumn: ReactNode;
  postMenu: ReactNode;
  postActions: ReactNode;
};

export const PostCardContent = memo(
  ({
    post,
    showCommunity = true,
    voteColumn,
    postMenu,
    postActions,
  }: PostCardContentProps) => {
    const timeAgo = formatRelativeTime(post.createdAt);

    return (
      <Card
        variant="interactive"
        className="group overflow-hidden focus-within:ring-2 focus-within:ring-brand/50"
      >
        <div className="flex">
          <div className="flex-shrink-0 bg-muted/30 dark:bg-muted/10 py-3 px-2">
            {voteColumn}
          </div>

          <div className="flex-1 min-w-0 p-4">
            <header className="flex items-center gap-2 mb-3 text-xs">
              {showCommunity && (
                <Link
                  to="/r/$communityId"
                  params={{ communityId: post.community.id }}
                  className="flex items-center gap-1.5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
                  aria-label={`Go to r/${post.community.name} community`}
                >
                  <Avatar className="h-5 w-5 ring-2 ring-background">
                    <AvatarImage
                      src={post.community.iconUrl}
                      alt={`${post.community.name} community avatar`}
                    />
                    <AvatarFallback className="text-[8px] font-semibold bg-gradient-to-br from-brand to-orange-400 text-white">
                      {post.community.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground hover:text-brand transition-colors">
                    r/{post.community.name}
                  </span>
                </Link>
              )}

              <span className="text-muted-foreground">•</span>

              <Link
                to="/u/$username"
                params={{ username: post.author.name }}
                className="text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                u/{post.author.name}
              </Link>

              <time
                className="text-muted-foreground ml-auto"
                dateTime={post.createdAt}
                title={new Date(post.createdAt).toLocaleString()}
              >
                {timeAgo}
              </time>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {postMenu}
              </div>
            </header>

            {post.flairs && post.flairs.length > 0 && (
              <div className="flex gap-1.5 mb-2 flex-wrap">
                {post.flairs.map((flair) => (
                  <FlairBadge key={flair.id} flair={flair} size="sm" />
                ))}
              </div>
            )}

            <Link
              to="/post/$postId"
              params={{ postId: post.id }}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg -mx-1 px-1"
              aria-label={`Read full post: ${post.title}`}
            >
              <h3 className="text-lg font-semibold leading-snug line-clamp-2 text-foreground group-hover:text-brand transition-colors">
                {post.title}
              </h3>
            </Link>

            {post.content && !post.media && (
              <Link
                to="/post/$postId"
                params={{ postId: post.id }}
                className="block mt-2 focus-visible:outline-none"
              >
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.content}
                </p>
              </Link>
            )}

            {post.media && (
              <Link
                to="/post/$postId"
                params={{ postId: post.id }}
                className="block mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl overflow-hidden"
              >
                <MediaPreview media={post.media} />
              </Link>
            )}

            <footer
              className="mt-4 -mx-1"
              role="contentinfo"
              aria-label="Post actions"
            >
              {postActions}
            </footer>
          </div>
        </div>
      </Card>
    );
  },
);

PostCardContent.displayName = "PostCardContent";

const MediaPreview = ({ media }: { media: Post["media"] }) => {
  if (!media) {
    return null;
  }

  const getMediaIcon = () => {
    switch (media.type) {
      case "image":
        return <ImageIcon className="h-8 w-8" aria-hidden="true" />;
      case "video":
        return <Play className="h-8 w-8" aria-hidden="true" />;
      case "link":
        return <Link2 className="h-8 w-8" aria-hidden="true" />;
      default:
        return <ExternalLink className="h-8 w-8" aria-hidden="true" />;
    }
  };

  if (media.type === "image" && media.thumb) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
        <img
          src={media.thumb}
          alt="Post image"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div
        className="relative rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/60 aspect-video flex items-center justify-center"
        role="img"
        aria-label="Video content"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center shadow-lg">
            <Play className="h-8 w-8 ml-1" />
          </div>
          <span className="text-sm font-medium">Video</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-muted/50 border border-border p-4 flex items-center gap-3"
      role="img"
      aria-label={`${media.type} content`}
    >
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        {getMediaIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground capitalize">
          {media.type} content
        </span>
        <span className="text-xs text-muted-foreground block truncate">
          Click to view
        </span>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};
