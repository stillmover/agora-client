import { useState, useCallback } from "react";
import { PenLine } from "lucide-react";

import { useCreatePostForm, POST_LIMITS } from "@/features/create-post";
import { useCommunities, type Community } from "@/entities/community";
import {
  Modal,
  Button,
  Input,
  Textarea,
  FormField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;
  if (typeof error === "string") return error;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return undefined;
};

type CreatePostModalProps = {
  trigger?: React.ReactNode;
  defaultCommunityId?: string;
  onSuccess?: (postId: string) => void;
};

export const CreatePostModal = ({
  trigger,
  defaultCommunityId,
  onSuccess,
}: CreatePostModalProps) => {
  const [open, setOpen] = useState(false);
  const { communities } = useCommunities();

  const { form, isSubmitting, reset } = useCreatePostForm({
    defaultCommunityId,
    navigateOnSuccess: false,
    onSuccess: (postId) => {
      onSuccess?.(postId);
      handleClose();
    },
  });

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    setOpen(false);
    reset();
  }, [reset, isSubmitting]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isSubmitting) return;
      if (!isOpen) {
        handleClose();
      } else {
        setOpen(true);
      }
    },
    [handleClose, isSubmitting],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting) return;
      form.handleSubmit();
    },
    [form, isSubmitting],
  );

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>

      <Modal.Content size="xl">
        <Modal.Header>
          <Modal.Title className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            Create a post
          </Modal.Title>
          <Modal.Description>
            Share your thoughts, questions, or discoveries with the community
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className="space-y-6">
            <form.Field name="communityId">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;

                return (
                  <FormField
                    label="Community"
                    hint="Choose where to share your post"
                    error={errorMessage}
                    required
                    htmlFor={field.name}
                  >
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
                          "w-full",
                          errorMessage &&
                            "border-destructive focus:ring-destructive/50",
                        )}
                        aria-invalid={!!errorMessage}
                      >
                        <SelectValue placeholder="Select a community" />
                      </SelectTrigger>
                      <SelectContent>
                        {communities.map((community: Community) => (
                          <SelectItem key={community.id} value={community.id}>
                            r/{community.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>
                );
              }}
            </form.Field>

            <form.Field name="title">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;

                return (
                  <FormField
                    label="Title"
                    hint="A clear, descriptive title helps your post get noticed"
                    error={errorMessage}
                    required
                    charCount={field.state.value.length}
                    charMax={POST_LIMITS.TITLE_MAX}
                    htmlFor={field.name}
                  >
                    <Input
                      id={field.name}
                      placeholder="An interesting title..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      maxLength={POST_LIMITS.TITLE_MAX}
                      disabled={isSubmitting}
                      className={cn(
                        "text-base",
                        errorMessage &&
                          "border-destructive focus-visible:ring-destructive/50",
                      )}
                      aria-invalid={!!errorMessage}
                    />
                  </FormField>
                );
              }}
            </form.Field>

            <form.Field name="content">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;

                return (
                  <FormField
                    label="Body"
                    hint="Optional - add more details to your post"
                    error={errorMessage}
                    htmlFor={field.name}
                  >
                    <Textarea
                      id={field.name}
                      placeholder="Share your thoughts, add context, or ask questions..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      rows={8}
                      disabled={isSubmitting}
                      className={cn(
                        "resize-none min-h-[200px]",
                        errorMessage &&
                          "border-destructive focus-visible:ring-destructive/50",
                      )}
                      aria-invalid={!!errorMessage}
                    />
                  </FormField>
                );
              }}
            </form.Field>
          </Modal.Body>

          <Modal.Footer>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Posting...
                </span>
              ) : (
                "Post"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};
