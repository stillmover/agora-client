import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Spinner,
} from "@/shared/ui";
import { MessageSquare } from "lucide-react";
import { useIsAuthenticated } from "@/entities/session";
import { authModalActions } from "@/shared/stores";

const MessagesPage = () => (
  <Suspense fallback={<Spinner />}>
    <MessagesPageContent />
  </Suspense>
);

const MessagesPageContent = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-8 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">Sign in to view messages</CardTitle>
          <CardDescription>Messages are available for signed-in users.</CardDescription>
          <div className="pt-2">
            <Button variant="brand" onClick={() => authModalActions.open("login")}>
              Go to login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
        <CardDescription>Your inbox will live here.</CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        Messaging isn’t available yet. Check back soon.
      </CardContent>
    </Card>
  );
};

export const Route = createFileRoute("/_main/messages")({
  component: MessagesPage,
});
