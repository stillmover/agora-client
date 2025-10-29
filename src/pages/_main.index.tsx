import { createFileRoute } from "@tanstack/react-router";
import { Feed } from "@/widgets/feed";

export const Route = createFileRoute("/_main/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="space-y-4">
      <Feed />
    </div>
  );
}
