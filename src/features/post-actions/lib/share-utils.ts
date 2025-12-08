import { logger } from "@/shared/services/logger";

export const sharePost = async (postId: string): Promise<void> => {
  const url = `${window.location.origin}/post/${postId}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check out this post",
        url,
      });
      return;
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        fallbackShare(url);
      }
      return;
    }
  }

  fallbackShare(url);
};

const fallbackShare = (url: string): void => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      logger.debug("Link copied to clipboard");
    })
    .catch(() => {
      logger.warn("Failed to copy to clipboard");
    });
};
