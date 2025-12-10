import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Users, Calendar, ExternalLink } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

import { useCommunityByName } from "@/entities/community";
import { useCommunityActions } from "@/features/community/model/useCommunityActions";
import { useIsAuthenticated } from "@/entities/session";
import { Button } from "@/shared/ui/button";
import { CreatePostModal } from "@/widgets/create-post-modal";

const fadeAnimation = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  initial: { opacity: 0 },
  transition: { duration: 0.15 },
};

interface CommunityInfoModalProps {
  communityName: string;
  trigger: React.ReactNode;
}

export const CommunityInfoModal = ({ communityName, trigger }: CommunityInfoModalProps) => {
  const [open, setOpen] = useState(false);
  const { community, isLoading } = useCommunityByName(communityName);
  const isAuthenticated = useIsAuthenticated();

  const { join, isJoined, isPending: isJoinPending } = useCommunityActions(community?.id ?? "");

  const handleJoin = useCallback(async () => {
    if (!community || isJoined) {
      return;
    }
    await join();
  }, [community, isJoined, join]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
  }, []);

  const handleOverlayClick = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const joined = community?.id ? isJoined || community.isJoined : false;
  const memberCount = community?.members ?? 0;
  const createdAt = null; // Community model does not include createdAt in current API mapping

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/70 z-40"
                onClick={handleOverlayClick}
                {...fadeAnimation}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild>
              <motion.div
                {...fadeAnimation}
                className="fixed inset-0 flex items-center justify-center z-50 p-4"
              >
                <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#1a1a1b] shadow-xl overflow-hidden">
                  <DialogPrimitive.Title className="sr-only">
                    {community ? `Community info for r/${community.name}` : "Community information"}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="sr-only">
                    Details about the community and actions like join or create post
                  </DialogPrimitive.Description>
                  {/* Banner */}
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600">
                    {community?.bannerUrl && (
                      <img
                        src={community.bannerUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <DialogPrimitive.Close asChild>
                    <button
                      aria-label="Close"
                      className="absolute right-3 top-3 flex items-center justify-center h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </DialogPrimitive.Close>

                  <div className="p-6 pt-0">
                    {/* Community Icon */}
                    <div className="-mt-10 mb-4">
                      <div className="h-20 w-20 rounded-full border-4 border-white dark:border-[#1a1a1b] bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-2xl font-bold">
                        {community?.iconUrl ? (
                          <img
                            src={community.iconUrl}
                            alt={community.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          (community?.name?.[0]?.toUpperCase() ?? "?")
                        )}
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="space-y-3">
                        <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      </div>
                    ) : community ? (
                      <>
                        <DialogPrimitive.Title className="text-xl font-bold mb-1">
                          r/{community.name}
                        </DialogPrimitive.Title>

                        {community.description && (
                          <DialogPrimitive.Description className="text-sm text-muted-foreground mb-4">
                            {community.description}
                          </DialogPrimitive.Description>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{memberCount.toLocaleString()} members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {createdAt
                                ? `Created ${formatDistanceToNow(createdAt, { addSuffix: true })}`
                                : "Created date unavailable"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {isAuthenticated && (
                            <>
                              <Button
                                variant={joined ? "outline" : "default"}
                                className="flex-1"
                                onClick={handleJoin}
                                disabled={joined || isJoinPending}
                              >
                                {joined ? "Joined" : "Join"}
                              </Button>
                              <CreatePostModal
                                defaultCommunityId={community.id}
                                trigger={
                                  <Button variant="outline" className="flex-1">
                                    Create Post
                                  </Button>
                                }
                                onSuccess={() => setOpen(false)}
                              />
                            </>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Link
                            to="/r/$communityId"
                            params={{ communityId: community.name }}
                            className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            <ExternalLink className="h-4 w-4" />
                            View full community page
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-muted-foreground py-4">
                        Community not found
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
