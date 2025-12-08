import type { SortType, Region } from "./gql";

export type PostFilters = {
  communityId?: string;
  sort?: SortType;
  region?: Region;
  limit?: number;
  offset?: number;
};

export type CommunityFilters = {
  limit?: number;
  offset?: number;
};

export type SearchFilters = {
  query: string;
  limit?: number;
  offset?: number;
};

export const queryKeys = {
  session: {
    all: ["session"] as const,
    me: () => [...queryKeys.session.all, "me"] as const,
    details: () => [...queryKeys.session.all, "details"] as const,
  },

  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters?: PostFilters) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
    feed: (filters?: PostFilters) =>
      [...queryKeys.posts.all, "feed", filters] as const,
    topStories: (limit?: number) =>
      [...queryKeys.posts.all, "topStories", { limit }] as const,
    byCommunity: (communityId: string, filters?: Omit<PostFilters, "communityId">) =>
      [...queryKeys.posts.all, "byCommunity", communityId, filters] as const,
    saved: (filters?: Omit<PostFilters, "communityId" | "sort" | "region">) =>
      [...queryKeys.posts.all, "saved", filters] as const,
    byUser: (userId: string, filters?: Omit<PostFilters, "communityId">) =>
      [...queryKeys.posts.all, "byUser", userId, filters] as const,
  },

  communities: {
    all: ["communities"] as const,
    lists: () => [...queryKeys.communities.all, "list"] as const,
    list: (filters?: CommunityFilters) =>
      [...queryKeys.communities.lists(), filters] as const,
    details: () => [...queryKeys.communities.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.communities.details(), id] as const,
    byName: (name: string) =>
      [...queryKeys.communities.all, "byName", name] as const,
    popular: (limit?: number) =>
      [...queryKeys.communities.all, "popular", { limit }] as const,
    flairs: (communityId: string) =>
      [...queryKeys.communities.all, "flairs", communityId] as const,
  },

  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) =>
      [...queryKeys.comments.all, "byPost", postId] as const,
    byUser: (userId: string, filters?: { limit?: number; offset?: number }) =>
      [...queryKeys.comments.all, "byUser", userId, filters] as const,
    details: () => [...queryKeys.comments.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.comments.details(), id] as const,
  },

  users: {
    all: ["users"] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    byUsername: (username: string) =>
      [...queryKeys.users.all, "byUsername", username] as const,
  },

  search: {
    all: ["search"] as const,
    posts: (filters: SearchFilters) =>
      [...queryKeys.search.all, "posts", filters] as const,
    communities: (filters: SearchFilters) =>
      [...queryKeys.search.all, "communities", filters] as const,
    users: (filters: SearchFilters) =>
      [...queryKeys.search.all, "users", filters] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
