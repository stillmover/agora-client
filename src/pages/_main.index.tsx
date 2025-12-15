import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { prefetchQueries } from "@/shared/api/gql/query-hooks";
import { Spinner } from "@/shared/ui";

const Feed = lazy(() => import("@/widgets/feed").then((module) => ({ default: module.Feed })));

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
      <Suspense fallback={<Spinner />}>
        <Feed />
      </Suspense>
    </div>
  );
}
