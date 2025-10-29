import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/")({
  component: Index,
});

function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Reddit Client</h1>
        <p className="text-lg text-muted-foreground text-center">
          Welcome to your Reddit client built with TanStack Router and React
          Query
        </p>
      </div>
    </div>
  );
}
