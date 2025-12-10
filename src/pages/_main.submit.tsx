import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  BarChart3,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

import { useCreatePostForm, POST_LIMITS } from "@/features/create-post";
import { useCommunities } from "@/entities/community";
import type { Community } from "@/entities/community";
import {
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from "@/shared/ui";
import { UI_TEXT } from "@/shared/constants";
import { cn } from "@/shared/lib/utils";

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error) {
    return undefined;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return undefined;
};

export const Route = createFileRoute("/_main/submit")({
  component: CreatePostPage,
});

type PostType = "text" | "image" | "link" | "video" | "poll";

const postTypes: { type: PostType; icon: React.ElementType; label: string }[] = [
  { icon: FileText, label: "Text", type: "text" },
  { icon: ImageIcon, label: "Image", type: "image" },
  { icon: LinkIcon, label: "Link", type: "link" },
  { icon: Video, label: "Video", type: "video" },
  { icon: BarChart3, label: "Poll", type: "poll" },
];

function CreatePostPage() {
  const navigate = useNavigate();
  const { communities, isLoading: communitiesLoading } = useCommunities();
  const [postType, setPostType] = useState<PostType>("text");
  const { form, isSubmitting } = useCreatePostForm({
    navigateOnSuccess: true,
  });

  const selectedCommunity = communities.find(
    (c: Community) => c.id === form.state.values.communityId
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) {
        return;
      }
      form.handleSubmit();
    },
    [form, isSubmitting]
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate({ to: "/" })}
          className="shrink-0"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Create a Post</h1>
          <p className="text-sm text-muted-foreground">Share your thoughts with the community</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <form.Field name="communityId">
            {(field) => {
              const hasBeenTouched = field.state.meta.isTouched;
              const errorMessage = hasBeenTouched
                ? getErrorMessage(field.state.meta.errors?.[0])
                : undefined;

              return (
                <div className="space-y-2">
                  <label htmlFor={field.name} className="text-sm font-medium">
                    Choose a community <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => {
                      field.handleChange(val);
                      field.handleBlur();
                    }}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger
                      id={field.name}
                      className={cn(
                        "w-full h-12",
                        errorMessage && "border-destructive focus:ring-destructive/50"
                      )}
                      aria-invalid={!!errorMessage}
                    >
                      <SelectValue placeholder="Select a community">
                        {selectedCommunity && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedCommunity.iconUrl} />
                              <AvatarFallback className="text-[10px] bg-brand text-white">
                                {selectedCommunity.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">r/{selectedCommunity.name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {communitiesLoading ? (
                        <div className="p-4 text-center text-muted-foreground">
                          Loading communities...
                        </div>
                      ) : (
                        communities.map((community: Community) => (
                          <SelectItem key={community.id} value={community.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={community.iconUrl} />
                                <AvatarFallback className="text-[10px] bg-brand text-white">
                                  {community.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span>r/{community.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
                </div>
              );
            }}
          </form.Field>
        </CardContent>
      </Card>

      <Card>
        <div className="border-b border-border">
          <div className="flex">
            {postTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                disabled={isSubmitting}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4",
                  "text-sm font-medium border-b-2 -mb-px transition-colors",
                  postType === type
                    ? "border-brand text-brand"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  isSubmitting && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <form.Field name="title">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;
                const charCount = field.state.value.length;
                const isNearLimit = charCount > POST_LIMITS.TITLE_MAX * 0.8;

                return (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor={field.name} className="text-sm font-medium">
                        Title <span className="text-destructive">*</span>
                      </label>
                      <span
                        className={cn(
                          "text-xs",
                          isNearLimit ? "text-warning" : "text-muted-foreground",
                          charCount >= POST_LIMITS.TITLE_MAX && "text-destructive"
                        )}
                      >
                        {charCount}/{POST_LIMITS.TITLE_MAX}
                      </span>
                    </div>
                    <Input
                      id={field.name}
                      placeholder="An interesting title"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      maxLength={POST_LIMITS.TITLE_MAX}
                      size="lg"
                      disabled={isSubmitting}
                      className={cn("font-medium", errorMessage && "border-destructive")}
                      aria-invalid={!!errorMessage}
                    />
                    {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
                  </div>
                );
              }}
            </form.Field>

            {postType === "text" && (
              <form.Field name="content">
                {(field) => {
                  const hasBeenTouched = field.state.meta.isTouched;
                  const errorMessage = hasBeenTouched
                    ? getErrorMessage(field.state.meta.errors?.[0])
                    : undefined;

                  return (
                    <div className="space-y-2">
                      <label htmlFor={field.name} className="text-sm font-medium">
                        Body <span className="text-muted-foreground">(optional)</span>
                      </label>
                      <Textarea
                        id={field.name}
                        placeholder="Write your post content here... You can use markdown for formatting."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={10}
                        disabled={isSubmitting}
                        className={cn(
                          "resize-none min-h-[200px]",
                          errorMessage && "border-destructive"
                        )}
                        aria-invalid={!!errorMessage}
                      />
                      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
                    </div>
                  );
                }}
              </form.Field>
            )}

            {postType === "image" && (
              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand/50 transition-colors cursor-pointer",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Drag and drop images here</p>
                <p className="text-sm text-muted-foreground">or click to upload</p>
                <Button variant="outline" size="sm" className="mt-4" disabled={isSubmitting}>
                  Choose Files
                </Button>
              </div>
            )}

            {postType === "link" && (
              <FormField label="URL" htmlFor="url">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  size="lg"
                  disabled={isSubmitting}
                />
              </FormField>
            )}

            {postType === "video" && (
              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-brand/50 transition-colors cursor-pointer",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                <Video className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium mb-1">Upload a video</p>
                <p className="text-sm text-muted-foreground">MP4, WebM up to 1GB</p>
                <Button variant="outline" size="sm" className="mt-4" disabled={isSubmitting}>
                  Choose Video
                </Button>
              </div>
            )}

            {postType === "poll" && (
              <div className="space-y-4">
                <FormField label="Option 1" htmlFor="option1">
                  <Input id="option1" placeholder="Enter option" disabled={isSubmitting} />
                </FormField>
                <FormField label="Option 2" htmlFor="option2">
                  <Input id="option2" placeholder="Enter option" disabled={isSubmitting} />
                </FormField>
                <Button variant="outline" size="sm" className="gap-2" disabled={isSubmitting}>
                  <Sparkles className="h-4 w-4" />
                  Add option
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Add flair:</span>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-accent",
                  isSubmitting && "opacity-50 pointer-events-none"
                )}
              >
                + Add
              </Badge>
            </div>
          </form>
        </CardContent>

        <div className="border-t border-border p-4 flex items-center justify-between bg-muted/30">
          <div className="text-xs text-muted-foreground">
            <a href="/help/posting" className="hover:underline">
              Posting guidelines
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate({ to: "/" })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              loading={isSubmitting}
              onClick={() => form.handleSubmit()}
            >
              {UI_TEXT.POST.CREATE}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
