import { useEffect, useState } from "react";
import { PostCard, type Post } from "@/entities/post";
import { fetchPosts } from "@/shared/api";
import { useParams } from "@tanstack/react-router";
import { UI_TEXT } from "@/shared/constants";

export const Feed = () => {
  const params = useParams({ strict: false });
  const communityId = params?.communityId as string | undefined;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchPosts(communityId).then((data) => {
      setPosts(data);
      setIsLoading(false);
    });
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: UI_TEXT.LOADING.SKELETON_COUNT }, (_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
            <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="text-muted-foreground">{UI_TEXT.POST.NO_POSTS}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p.id} post={p} showCommunity={!communityId} />
      ))}
    </div>
  );
};
