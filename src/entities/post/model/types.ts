export type Flair = {
  id: string;
  label: string;
  color?: string;
};

export type Post = {
  id: string;
  community: Community;
  author: {
    id: string;
    name: string;
  };
  title: string;
  content?: string;
  media?: {
    type: "image" | "video" | "link";
    url: string;
    thumb?: string;
  };
  flairs?: Flair[];
  score: number;
  comments: number; // Will be calculated from comments array length
  createdAt: string;
  userVote?: -1 | 0 | 1;
  isSaved?: boolean;
};

import type { Community } from "@/entities/community";

export type { Community };
