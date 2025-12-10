import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { CreatePostModal } from "@/widgets/create-post-modal";
import { useIsAuthenticated } from "@/entities/session";
import { Card, CardContent, Button } from "@/shared/ui";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/_main/submit")({
  component: CreatePostModalRoute,
});

function CreatePostModalRoute() {
  const navigate = useNavigate();
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  // If someone opens /submit directly, keep a back target.
  useEffect(() => {
    // Preload home to keep back navigation fast.
    router.preloadRoute({ to: "/" }).catch(() => {});
  }, [router]);

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate({ to: ".." });
    } else {
      navigate({ to: "/" });
    }
  };

  const handleLogin = () => {
    navigate({
      to: "/login",
      search: {
        redirect: "/submit",
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign in to create a post</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to share your thoughts with the community.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="brand" onClick={handleLogin} className="w-full">
                Sign In
              </Button>
              <Button variant="ghost" onClick={handleClose} className="w-full">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CreatePostModal
      defaultOpen
      onClose={handleClose}
      onSuccess={() => {
        navigate({ to: "/" });
      }}
    />
  );
}
