import { useTopStoriesQuery } from "@/shared/api/gql/query-hooks";
import type { TopStory } from "../lib/constants";

const DEFAULT_THUMBNAIL =
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center";

const mapPostToTopStory = (post: {
  id: string;
  title: string;
  community?: { id: string; name: string } | null;
  media?: Array<{ thumbnailUrl?: string | null; url: string }> | null;
  score: number;
}): TopStory => ({
  id: post.id,
  title: post.title,
  community: {
    id: post.community?.id ?? "",
    name: post.community?.name ?? "unknown",
  },
  thumbnail:
    post.media?.[0]?.thumbnailUrl ?? post.media?.[0]?.url ?? DEFAULT_THUMBNAIL,
  score: post.score,
});

export const useTopStories = (limit = 6) => {
  const { data, isLoading, error, refetch } = useTopStoriesQuery(limit);

  const stories: TopStory[] = (data ?? []).map(mapPostToTopStory);

  return {
    stories,
    isLoading,
    error,
    refetch,
  };
};
