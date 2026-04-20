import { useState, useCallback } from "react";
import { Globe, Eye, Lock, Users, Sparkles } from "lucide-react";

import { useCreateCommunityForm, COMMUNITY_LIMITS } from "@/features/create-community";
import {
  Modal,
  Button,
  Input,
  Textarea,
  ImageUpload,
  RadioCardGroup,
  FormField,
} from "@/shared/ui";
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

type CommunityType = "public" | "restricted" | "private";

interface CreateCommunityModalProps {
  trigger?: React.ReactNode;
  onSuccess?: (communityName: string) => void;
}

const VISIBILITY_OPTIONS: {
  value: CommunityType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    description: "Anyone can view, post, and comment",
    icon: Globe,
    label: "Public",
    value: "public",
  },
  {
    description: "Anyone can view, but only approved users can post",
    icon: Eye,
    label: "Restricted",
    value: "restricted",
  },
  {
    description: "Only approved users can view and participate",
    icon: Lock,
    label: "Private",
    value: "private",
  },
];

export const CreateCommunityModal = ({ trigger, onSuccess }: CreateCommunityModalProps) => {
  const [open, setOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [bannerUrl, setBannerUrl] = useState<string>();

  const { form, isSubmitting, reset } = useCreateCommunityForm({
    navigateOnSuccess: false,
    onSuccess: (communityName) => {
      onSuccess?.(communityName);
      handleClose();
    },
  });

  const handleClose = useCallback(() => {
    if (isSubmitting) {
      return;
    }
    setOpen(false);
    setAvatarUrl(undefined);
    setBannerUrl(undefined);
    reset();
  }, [reset, isSubmitting]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isSubmitting) {
        return;
      }
      if (!isOpen) {
        handleClose();
      } else {
        setOpen(true);
      }
    },
    [handleClose, isSubmitting]
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
    <Modal open={open} onOpenChange={handleOpenChange}>
      <Modal.Trigger asChild>{trigger}</Modal.Trigger>

      <Modal.Content size="lg">
        <Modal.Header>
          <Modal.Title>Create a community</Modal.Title>
          <Modal.Description>
            Build a space for your interests and connect with like-minded people
          </Modal.Description>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Customize appearance
              </h3>

              <div className="space-y-2">
                <ImageUpload
                  value={bannerUrl}
                  onChange={setBannerUrl}
                  variant="banner"
                  size="lg"
                  placeholder="Add a banner image"
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="-mt-12 ml-4 relative z-10">
                <div className="inline-block rounded-full bg-background p-1 shadow-lg">
                  <ImageUpload
                    value={avatarUrl}
                    onChange={setAvatarUrl}
                    variant="circle"
                    size="lg"
                    placeholder="Avatar"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </section>

            <form.Field name="name">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;
                const isValid =
                  hasBeenTouched &&
                  field.state.value.length >= COMMUNITY_LIMITS.NAME_MIN &&
                  !errorMessage;

                return (
                  <FormField
                    label="Community name"
                    hint="Choose a unique name. This cannot be changed later."
                    error={errorMessage}
                    success={isValid ? `r/${field.state.value} is available` : undefined}
                    required
                    charCount={field.state.value.length}
                    charMax={COMMUNITY_LIMITS.NAME_MAX}
                    htmlFor={field.name}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                        r/
                      </span>
                      <Input
                        id={field.name}
                        placeholder="community_name"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(e.target.value.replaceAll(/\s/g, "_").toLowerCase())
                        }
                        onBlur={field.handleBlur}
                        maxLength={COMMUNITY_LIMITS.NAME_MAX}
                        disabled={isSubmitting}
                        className={cn(
                          "pl-8",
                          errorMessage && "border-destructive focus-visible:ring-destructive/50",
                          isValid && "border-emerald-500 focus-visible:ring-emerald-500/50"
                        )}
                        aria-invalid={Boolean(errorMessage)}
                      />
                    </div>
                  </FormField>
                );
              }}
            </form.Field>

            <form.Field name="displayName">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;

                return (
                  <FormField
                    label="Display name"
                    hint="This is how your community will appear to users."
                    error={errorMessage}
                    required
                    htmlFor={field.name}
                  >
                    <Input
                      id={field.name}
                      placeholder="My Awesome Community"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      maxLength={COMMUNITY_LIMITS.DISPLAY_NAME_MAX}
                      disabled={isSubmitting}
                      className={cn(
                        errorMessage && "border-destructive focus-visible:ring-destructive/50"
                      )}
                      aria-invalid={Boolean(errorMessage)}
                    />
                  </FormField>
                );
              }}
            </form.Field>

            <form.Field name="description">
              {(field) => {
                const hasBeenTouched = field.state.meta.isTouched;
                const errorMessage = hasBeenTouched
                  ? getErrorMessage(field.state.meta.errors?.[0])
                  : undefined;

                return (
                  <FormField
                    label="Description"
                    hint="Help people understand what your community is about."
                    error={errorMessage}
                    charCount={field.state.value?.length ?? 0}
                    charMax={COMMUNITY_LIMITS.DESCRIPTION_MAX}
                    htmlFor={field.name}
                  >
                    <Textarea
                      id={field.name}
                      placeholder="Tell potential members what makes your community special..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      maxLength={COMMUNITY_LIMITS.DESCRIPTION_MAX}
                      rows={4}
                      disabled={isSubmitting}
                      className={cn(
                        "resize-none",
                        errorMessage && "border-destructive focus-visible:ring-destructive/50"
                      )}
                      aria-invalid={Boolean(errorMessage)}
                    />
                  </FormField>
                );
              }}
            </form.Field>

            <section className="space-y-3">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Community type
              </h3>
              <form.Field name="communityType">
                {(field) => (
                  <RadioCardGroup
                    value={field.state.value}
                    onChange={field.handleChange}
                    options={VISIBILITY_OPTIONS}
                    size="md"
                    disabled={isSubmitting}
                  />
                )}
              </form.Field>
            </section>
          </Modal.Body>

          <Modal.Footer>
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Creating...
                </span>
              ) : (
                "Create Community"
              )}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};
