import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Post } from "@/entities/post";
import type { Comment } from "@/entities/comment";
import { fetchPost, fetchComments, createComment } from "@/shared/api";
import { VoteButton } from "@/features/vote";
import { CommentItem, CommentForm } from "@/features/comment";
import { useSessionUser } from "@/entities/session";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Clock, MessageSquare } from "lucide-react";
import {
  formatRelativeTime,
  formatCommentCount,
  getInitials,
} from "@/shared/lib";
import { logger } from "@/shared/services";
import { UI_TEXT, type VoteDirection } from "@/shared/constants";

export const Route = createFileRoute("/_main/post/$postId")({
  component: PostDetailPage,
});

function PostDetailPage() {
  const { postId } = Route.useParams();
  const user = useSessionUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchPost(postId), fetchComments(postId)]).then(
      ([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
        setIsLoading(false);
      },
    );
  }, [postId]);

  const handlePostVote = (direction: VoteDirection) => {
    logger.debug(`Voted ${direction} on post ${postId}`);
  };

  const handleCommentSubmit = async (content: string, parentId?: string) => {
    if (!user) {
      return;
    }

    const newComment = await createComment({
      postId,
      author: user.username,
      content,
      parentId,
    });

    if (parentId) {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === parentId) {
            return { ...comment, replies: [...comment.replies, newComment] };
          }
          return { ...comment, replies: addReply(comment.replies) };
        });
      };
      setComments(addReply(comments));
    } else {
      setComments([...comments, newComment]);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{UI_TEXT.POST.NOT_FOUND}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const timeAgo = formatRelativeTime(post.createdAt);

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      {/* Post */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <VoteButton
                votes={post.votes}
                onVote={handlePostVote}
                size="lg"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link
                  to="/r/$communityId"
                  params={{ communityId: post.communityId }}
                  className="hover:underline"
                >
                  <Badge variant="secondary" className="text-xs">
                    r/{post.communityId}
                  </Badge>
                </Link>
                <span className="text-xs text-muted-foreground">
                  Posted by {post.author}
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
                <span>{formatCommentCount(post.commentCount)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Form */}
      {user && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium">{user.username}</div>
            </div>
            <CommentForm onSubmit={(content) => handleCommentSubmit(content)} />
          </CardContent>
        </Card>
      )}

      {/* Comments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {formatCommentCount(comments.length)}
        </h2>
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">
                {UI_TEXT.COMMENT.NO_COMMENTS}
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(parentId, content) =>
                handleCommentSubmit(content, parentId)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
