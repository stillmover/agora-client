import { createFileRoute } from "@tanstack/react-router";
import { Feed } from "@/widgets/feed";
import { prefetchQueries } from "@/shared/api/gql/query-hooks";

export const Route = createFileRoute("/_main/")({
  component: HomePage,
  loader: async ({ context }) => {
    const { queryClient } = context;

    await Promise.all([
      prefetchQueries.feed(queryClient, { limit: 20 }),
      prefetchQueries.topStories(queryClient, 6),
      prefetchQueries.popularCommunities(queryClient, 5),
    ]);

    return {};
  },
  staleTime: 1 * 60 * 1000,
});

function HomePage() {
  return (
    <div className="space-y-4">
      <Feed />
    </div>
  );
}
