import { useTopStoriesQuery } from "@/shared/api/gql/query-hooks";
import type { TopStory } from "../lib/constants";

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center";

const sanitizeUrl = (url?: string | null): string | undefined => {
  if (!url) {
    return;
  }
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? url : undefined;
  } catch {
    return;
  }
};

const mapPostToTopStory = (post: {
  id: string;
  title: string;
  community?: { id: string; name: string; iconUrl?: string | null } | null;
  media?: Array<{ thumbnailUrl?: string | null; url: string }> | null;
  score: number;
  commentCount: number;
}): TopStory => {
  const mediaThumbnail =
    sanitizeUrl(post.media?.[0]?.thumbnailUrl) ??
    sanitizeUrl(post.media?.[0]?.url) ??
    DEFAULT_THUMBNAIL;

  return {
    community: {
      id: post.community?.id ?? "",
      name: post.community?.name ?? "unknown",
      iconUrl: sanitizeUrl(post.community?.iconUrl),
    },
    id: post.id,
    score: post.score,
    thumbnail: mediaThumbnail,
    title: post.title,
    commentCount: post.commentCount,
  };
};

export const useTopStories = (limit = 6) => {
  const { data = [], isLoading, error, refetch } = useTopStoriesQuery(limit);
  const stories: TopStory[] = data.map(mapPostToTopStory);

  return {
    error,
    isLoading,
    refetch,
    stories,
  };
};
