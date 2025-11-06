import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { useSessionUser } from "@/entities/session";
import { createPost, fetchCommunities } from "@/shared/api";
import type { Community } from "@/entities/community";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { UI_TEXT } from "@/shared/constants";
import { logger } from "@/shared/services";

export const Route = createFileRoute("/_main/submit")({
  component: CreatePostPage,
});

function CreatePostPage() {
  const user = useSessionUser();
  const navigate = useNavigate();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCommunities().then(setCommunities);
  }, []);

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      communityId: "",
    },
    onSubmit: async ({ value }) => {
      if (!value.title || !value.content || !value.communityId) {
        return;
      }

      setIsSubmitting(true);
      try {
        await createPost({
          title: value.title,
          content: value.content,
          communityId: value.communityId,
          author: user?.username || "Anonymous",
        });
        navigate({
          to: "/r/$communityId",
          params: { communityId: value.communityId },
        });
      } catch (error) {
        logger.error("Failed to create post:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a post</CardTitle>
          <CardDescription>
            Share your thoughts with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="communityId">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Community
                  </label>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
                    <option value="">Select a community</option>
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        r/{community.name}
                      </option>
                    ))}
                  </select>
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Title
                  </label>
                  <Input
                    id={field.name}
                    placeholder="Post title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="content">
              {(field) => (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Content
                  </label>
                  <Textarea
                    id={field.name}
                    placeholder="Post content"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={8}
                    required
                  />
                  {field.state.meta.errors && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? UI_TEXT.POST.CREATING : UI_TEXT.POST.CREATE}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/" })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
