import { useQuery, useMutation } from "urql";
import { useMemo } from "react";
import {
  PostsDocument,
  PostDocument,
  FeedDocument,
  TopStoriesDocument,
  PostsByCommunityDocument,
  CommunitiesDocument,
  CommunityDocument,
  CommunityByNameDocument,
  PopularCommunitiesDocument,
  CommentsDocument,
  CommentDocument,
  CreatePostDocument,
  VotePostDocument,
  SavePostDocument,
  UnsavePostDocument,
  CreateCommentDocument,
  VoteCommentDocument,
  UpdateCommentDocument,
  DeleteCommentDocument,
  JoinCommunityDocument,
  LeaveCommunityDocument,
} from "./operations";
import { mapCommunity, mapComment } from "./mappers";

// Query Hooks
export function usePostsQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: PostsDocument,
    variables,
    ...options,
  });
}

export function usePostQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: PostDocument,
    variables,
    ...options,
  });
}

export function useFeedQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: FeedDocument,
    variables,
    ...options,
  });
}

export function useTopStoriesQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: TopStoriesDocument,
    variables,
    ...options,
  });
}

export function usePostsByCommunityQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: PostsByCommunityDocument,
    variables,
    ...options,
  });
}

export function useCommunitiesQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommunitiesDocument,
    variables,
    ...options,
  });
}

/**
 * Hook wrapper for communities query that returns mapped communities
 */
export function useCommunities() {
  const [result, reexecute] = useCommunitiesQuery(undefined, {
    requestPolicy: "cache-first",
  });

  const communities = useMemo(() => {
    return (result.data?.communities ?? []).map(mapCommunity);
  }, [result.data]);

  return {
    communities,
    isLoading: result.fetching && !result.data,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
}

export function useCommunityQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommunityDocument,
    variables,
    ...options,
  });
}

export function useCommunityByNameQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommunityByNameDocument,
    variables,
    ...options,
  });
}

export function usePopularCommunitiesQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: PopularCommunitiesDocument,
    variables,
    ...options,
  });
}

export function useCommentsQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommentsDocument,
    variables,
    ...options,
  });
}

/**
 * Hook wrapper for comments query that returns mapped comments
 */
export function useComments(postId: string) {
  const [result, reexecute] = useCommentsQuery(
    { postId },
    {
      requestPolicy: "cache-first",
    }
  );

  const comments = useMemo(() => {
    return (result.data?.comments ?? []).map(mapComment);
  }, [result.data]);

  return {
    comments,
    isLoading: result.fetching && !result.data,
    error: result.error,
    refetch: () => reexecute({ requestPolicy: "network-only" }),
  };
}

export function useCommentQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommentDocument,
    variables,
    ...options,
  });
}

// Mutation Hooks
export function useCreatePostMutation() {
  return useMutation(CreatePostDocument);
}

export function useVotePostMutation() {
  return useMutation(VotePostDocument);
}

export function useSavePostMutation() {
  return useMutation(SavePostDocument);
}

export function useUnsavePostMutation() {
  return useMutation(UnsavePostDocument);
}

export function useCreateCommentMutation() {
  return useMutation(CreateCommentDocument);
}

export function useVoteCommentMutation() {
  return useMutation(VoteCommentDocument);
}

export function useUpdateCommentMutation() {
  return useMutation(UpdateCommentDocument);
}

export function useDeleteCommentMutation() {
  return useMutation(DeleteCommentDocument);
}

export function useJoinCommunityMutation() {
  return useMutation(JoinCommunityDocument);
}

export function useLeaveCommunityMutation() {
  return useMutation(LeaveCommunityDocument);
}

