import { useQuery, useMutation } from "urql";
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
  UserDocument,
  UserByUsernameDocument,
  UserPostsDocument,
  UserCommentsDocument,
  SavedPostsDocument,
  SearchPostsDocument,
  SearchCommunitiesDocument,
  SearchUsersDocument,
  FlairsByCommunityDocument,
  UpdatePostDocument,
  DeletePostDocument,
  CreateCommunityDocument,
  UpdateCommunityDocument,
  UpdateUserDocument,
} from "./operations";

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


export function useCommentQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: CommentDocument,
    variables,
    ...options,
  });
}

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

// User queries
export function useUserQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: UserDocument,
    variables,
    ...options,
  });
}

export function useUserByUsernameQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: UserByUsernameDocument,
    variables,
    ...options,
  });
}

export function useUserPostsQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: UserPostsDocument,
    variables,
    ...options,
  });
}

export function useUserCommentsQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: UserCommentsDocument,
    variables,
    ...options,
  });
}

// Saved posts
export function useSavedPostsQuery(variables?: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: SavedPostsDocument,
    variables,
    ...options,
  });
}

// Search queries
export function useSearchPostsQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: SearchPostsDocument,
    variables,
    ...options,
  });
}

export function useSearchCommunitiesQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: SearchCommunitiesDocument,
    variables,
    ...options,
  });
}

export function useSearchUsersQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: SearchUsersDocument,
    variables,
    ...options,
  });
}

// Flairs
export function useFlairsByCommunityQuery(variables: Parameters<typeof useQuery>[0]["variables"], options?: Omit<Parameters<typeof useQuery>[0], "query" | "variables">) {
  return useQuery({
    query: FlairsByCommunityDocument,
    variables,
    ...options,
  });
}

// Additional mutations
export function useUpdatePostMutation() {
  return useMutation(UpdatePostDocument);
}

export function useDeletePostMutation() {
  return useMutation(DeletePostDocument);
}

export function useCreateCommunityMutation() {
  return useMutation(CreateCommunityDocument);
}

export function useUpdateCommunityMutation() {
  return useMutation(UpdateCommunityDocument);
}

export function useUpdateUserMutation() {
  return useMutation(UpdateUserDocument);
}

