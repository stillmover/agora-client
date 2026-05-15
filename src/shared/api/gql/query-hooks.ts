import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  keepPreviousData,
} from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import { graphqlRequest, getQueryString } from "./graphql-client";
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
  UserDocument,
  UserByUsernameDocument,
  UserPostsDocument,
  UserCommentsDocument,
  SavedPostsDocument,
  SearchPostsDocument,
  SearchCommunitiesDocument,
  SearchUsersDocument,
  FlairsByCommunityDocument,
  CreatePostDocument,
  UpdatePostDocument,
  DeletePostDocument,
  VotePostDocument,
  SavePostDocument,
  UnsavePostDocument,
  CreateCommentDocument,
  UpdateCommentDocument,
  DeleteCommentDocument,
  VoteCommentDocument,
  JoinCommunityDocument,
  LeaveCommunityDocument,
  CreateCommunityDocument,
  UpdateCommunityDocument,
  UpdateUserDocument,
} from "./operations";
import type {
  Post,
  Comment,
  Community,
  User,
  Flair,
  SortType,
  Region,
  VoteType,
  CreatePostInput,
  CreateCommentInput,
  CreateCommunityInput,
} from "./index";

type PostsQueryResult = { posts: Post[] };
type PostQueryResult = { post: Post | null };
type FeedQueryResult = { feed: Post[] };
type TopStoriesQueryResult = { topStories: Post[] };
type PostsByCommunityQueryResult = { postsByCommunity: Post[] };
type CommunitiesQueryResult = { communities: Community[] };
type CommunityQueryResult = { community: Community | null };
type CommunityByNameQueryResult = { communityByName: Community | null };
type PopularCommunitiesQueryResult = { popularCommunities: Community[] };
type CommentsQueryResult = { comments: Comment[] };
type CommentQueryResult = { comment: Comment | null };
type UserQueryResult = { user: User | null };
type UserByUsernameQueryResult = { userByUsername: User | null };
type UserPostsQueryResult = { userPosts: Post[] };
type UserCommentsQueryResult = { userComments: Comment[] };
type SavedPostsQueryResult = { savedPosts: Post[] };
type SearchPostsQueryResult = { searchPosts: Post[] };
type SearchCommunitiesQueryResult = { searchCommunities: Community[] };
type SearchUsersQueryResult = { searchUsers: User[] };
type FlairsByCommunityQueryResult = { flairsByCommunity: Flair[] };

type CreatePostMutationResult = { createPost: Post };
type UpdatePostMutationResult = { updatePost: Post };
type DeletePostMutationResult = { deletePost: boolean };
type VotePostMutationResult = { votePost: Post };
type SavePostMutationResult = { savePost: boolean };
type UnsavePostMutationResult = { unsavePost: boolean };
type CreateCommentMutationResult = { createComment: Comment };
type UpdateCommentMutationResult = { updateComment: Comment };
type DeleteCommentMutationResult = { deleteComment: boolean };
type VoteCommentMutationResult = { voteComment: Comment };
type JoinCommunityMutationResult = { joinCommunity: Community };
type LeaveCommunityMutationResult = { leaveCommunity: boolean };
type CreateCommunityMutationResult = { createCommunity: Community };
type UpdateCommunityMutationResult = { updateCommunity: Community };
type UpdateUserMutationResult = { updateUser: User };

const MINUTE = 60 * 1000;

const STALE_TIMES = {
  posts: 2 * MINUTE,
  feed: 1 * MINUTE,
  topStories: 5 * MINUTE,
  communities: 5 * MINUTE,
  popularCommunities: 10 * MINUTE,
  comments: 1 * MINUTE,
  users: 5 * MINUTE,
  search: 30 * 1000,
  flairs: 10 * MINUTE,
  savedPosts: 2 * MINUTE,
} as const;

type PostsVariables = {
  communityId?: string;
  sort?: SortType;
  region?: Region;
  limit?: number;
  offset?: number;
};

export const usePostsQuery = (
  variables?: PostsVariables,
  options?: Omit<UseQueryOptions<PostsQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.list(variables),
    queryFn: () =>
      graphqlRequest<PostsQueryResult>(getQueryString(PostsDocument), variables),
    select: (data) => data.posts,
    staleTime: STALE_TIMES.posts,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const usePostQuery = (
  postId: string,
  options?: Omit<UseQueryOptions<PostQueryResult, Error, Post | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: () =>
      graphqlRequest<PostQueryResult>(getQueryString(PostDocument), { id: postId }),
    select: (data) => data.post,
    staleTime: STALE_TIMES.posts,
    enabled: Boolean(postId),
    ...options,
  });
};

export const useFeedQuery = (
  variables?: { sort?: SortType; limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<FeedQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.feed(variables),
    queryFn: () =>
      graphqlRequest<FeedQueryResult>(getQueryString(FeedDocument), variables),
    select: (data) => data.feed,
    staleTime: STALE_TIMES.feed,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useTopStoriesQuery = (
  limit?: number,
  options?: Omit<UseQueryOptions<TopStoriesQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.topStories(limit),
    queryFn: () =>
      graphqlRequest<TopStoriesQueryResult>(getQueryString(TopStoriesDocument), { limit }),
    select: (data) => data.topStories,
    staleTime: STALE_TIMES.topStories,
    ...options,
  });
};

export const usePostsByCommunityQuery = (
  communityId: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<PostsByCommunityQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.byCommunity(communityId, variables),
    queryFn: () =>
      graphqlRequest<PostsByCommunityQueryResult>(getQueryString(PostsByCommunityDocument), {
        communityId,
        ...variables,
      }),
    select: (data) => data.postsByCommunity,
    staleTime: STALE_TIMES.posts,
    enabled: Boolean(communityId),
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useSavedPostsQuery = (
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<SavedPostsQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.saved(variables),
    queryFn: () =>
      graphqlRequest<SavedPostsQueryResult>(getQueryString(SavedPostsDocument), variables),
    select: (data) => data.savedPosts,
    staleTime: STALE_TIMES.savedPosts,
    ...options,
  });
};

export const useUserPostsQuery = (
  userId: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<UserPostsQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.posts.byUser(userId, variables),
    queryFn: () =>
      graphqlRequest<UserPostsQueryResult>(getQueryString(UserPostsDocument), {
        userId,
        ...variables,
      }),
    select: (data) => data.userPosts,
    staleTime: STALE_TIMES.posts,
    enabled: Boolean(userId),
    ...options,
  });
};

type InfinitePostsVariables = {
  communityId?: string;
  sort?: SortType;
  region?: Region;
  limit?: number;
};

export const useInfinitePostsQuery = (
  variables?: InfinitePostsVariables,
) => {
  const limit = variables?.limit ?? 20;

  return useInfiniteQuery({
    queryKey: [...queryKeys.posts.lists(), "infinite", variables] as const,
    queryFn: async ({ pageParam }) => {
      return graphqlRequest<PostsQueryResult>(getQueryString(PostsDocument), {
        ...variables,
        limit,
        offset: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.posts.length, 0);
      if (lastPage.posts.length < limit) {
        return undefined;
      }
      return totalFetched;
    },
    staleTime: STALE_TIMES.posts,
  });
};

export const useInfiniteFeedQuery = (
  variables?: { sort?: SortType; limit?: number },
) => {
  const limit = variables?.limit ?? 20;

  return useInfiniteQuery({
    queryKey: [...queryKeys.posts.feed(), "infinite", variables] as const,
    queryFn: async ({ pageParam }) => {
      return graphqlRequest<FeedQueryResult>(getQueryString(FeedDocument), {
        ...variables,
        limit,
        offset: pageParam,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((acc, page) => acc + page.feed.length, 0);
      if (lastPage.feed.length < limit) {
        return undefined;
      }
      return totalFetched;
    },
    staleTime: STALE_TIMES.feed,
  });
};

export const useCommunitiesQuery = (
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<CommunitiesQueryResult, Error, Community[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.communities.list(variables),
    queryFn: () =>
      graphqlRequest<CommunitiesQueryResult>(getQueryString(CommunitiesDocument), variables),
    select: (data) => data.communities,
    staleTime: STALE_TIMES.communities,
    ...options,
  });
};

export const useCommunityQuery = (
  communityId: string,
  options?: Omit<UseQueryOptions<CommunityQueryResult, Error, Community | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.communities.detail(communityId),
    queryFn: () =>
      graphqlRequest<CommunityQueryResult>(getQueryString(CommunityDocument), { id: communityId }),
    select: (data) => data.community,
    staleTime: STALE_TIMES.communities,
    enabled: Boolean(communityId),
    ...options,
  });
};

export const useCommunityByNameQuery = (
  name: string,
  options?: Omit<UseQueryOptions<CommunityByNameQueryResult, Error, Community | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.communities.byName(name),
    queryFn: () =>
      graphqlRequest<CommunityByNameQueryResult>(getQueryString(CommunityByNameDocument), { name }),
    select: (data) => data.communityByName,
    staleTime: STALE_TIMES.communities,
    enabled: Boolean(name),
    ...options,
  });
};

export const usePopularCommunitiesQuery = (
  limit?: number,
  options?: Omit<UseQueryOptions<PopularCommunitiesQueryResult, Error, Community[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.communities.popular(limit),
    queryFn: () =>
      graphqlRequest<PopularCommunitiesQueryResult>(getQueryString(PopularCommunitiesDocument), { limit }),
    select: (data) => data.popularCommunities,
    staleTime: STALE_TIMES.popularCommunities,
    ...options,
  });
};

export const useFlairsByCommunityQuery = (
  communityId: string,
  options?: Omit<UseQueryOptions<FlairsByCommunityQueryResult, Error, Flair[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.communities.flairs(communityId),
    queryFn: () =>
      graphqlRequest<FlairsByCommunityQueryResult>(getQueryString(FlairsByCommunityDocument), { communityId }),
    select: (data) => data.flairsByCommunity,
    staleTime: STALE_TIMES.flairs,
    enabled: Boolean(communityId),
    ...options,
  });
};

export const useCommentsQuery = (
  postId: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<CommentsQueryResult, Error, Comment[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: () =>
      graphqlRequest<CommentsQueryResult>(getQueryString(CommentsDocument), {
        postId,
        ...variables,
      }),
    select: (data) => data.comments,
    staleTime: STALE_TIMES.comments,
    enabled: Boolean(postId),
    ...options,
  });
};

export const useCommentQuery = (
  commentId: string,
  options?: Omit<UseQueryOptions<CommentQueryResult, Error, Comment | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.comments.detail(commentId),
    queryFn: () =>
      graphqlRequest<CommentQueryResult>(getQueryString(CommentDocument), { id: commentId }),
    select: (data) => data.comment,
    staleTime: STALE_TIMES.comments,
    enabled: Boolean(commentId),
    ...options,
  });
};

export const useUserCommentsQuery = (
  userId: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<UserCommentsQueryResult, Error, Comment[]>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.comments.byUser(userId, variables),
    queryFn: () =>
      graphqlRequest<UserCommentsQueryResult>(getQueryString(UserCommentsDocument), {
        userId,
        ...variables,
      }),
    select: (data) => data.userComments,
    staleTime: STALE_TIMES.comments,
    enabled: Boolean(userId),
    ...options,
  });
};

export const useUserQuery = (
  userId: string,
  options?: Omit<UseQueryOptions<UserQueryResult, Error, User | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () =>
      graphqlRequest<UserQueryResult>(getQueryString(UserDocument), { id: userId }),
    select: (data) => data.user,
    staleTime: STALE_TIMES.users,
    enabled: Boolean(userId),
    ...options,
  });
};

export const useUserByUsernameQuery = (
  username: string,
  options?: Omit<UseQueryOptions<UserByUsernameQueryResult, Error, User | null>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: queryKeys.users.byUsername(username),
    queryFn: () =>
      graphqlRequest<UserByUsernameQueryResult>(getQueryString(UserByUsernameDocument), { username }),
    select: (data) => data.userByUsername,
    staleTime: STALE_TIMES.users,
    enabled: Boolean(username),
    ...options,
  });
};

export const useSearchPostsQuery = (
  query: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<SearchPostsQueryResult, Error, Post[]>, "queryKey" | "queryFn">,
) => {
  const isValidQuery = query.length >= 2;

  return useQuery({
    queryKey: queryKeys.search.posts({ query, ...variables }),
    queryFn: () =>
      graphqlRequest<SearchPostsQueryResult>(getQueryString(SearchPostsDocument), {
        query,
        ...variables,
      }),
    select: (data) => data.searchPosts,
    staleTime: STALE_TIMES.search,
    enabled: isValidQuery,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useSearchCommunitiesQuery = (
  query: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<SearchCommunitiesQueryResult, Error, Community[]>, "queryKey" | "queryFn">,
) => {
  const isValidQuery = query.length >= 2;

  return useQuery({
    queryKey: queryKeys.search.communities({ query, ...variables }),
    queryFn: () =>
      graphqlRequest<SearchCommunitiesQueryResult>(getQueryString(SearchCommunitiesDocument), {
        query,
        ...variables,
      }),
    select: (data) => data.searchCommunities,
    staleTime: STALE_TIMES.search,
    enabled: isValidQuery,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useSearchUsersQuery = (
  query: string,
  variables?: { limit?: number; offset?: number },
  options?: Omit<UseQueryOptions<SearchUsersQueryResult, Error, User[]>, "queryKey" | "queryFn">,
) => {
  const isValidQuery = query.length >= 2;

  return useQuery({
    queryKey: queryKeys.search.users({ query, ...variables }),
    queryFn: () =>
      graphqlRequest<SearchUsersQueryResult>(getQueryString(SearchUsersDocument), {
        query,
        ...variables,
      }),
    select: (data) => data.searchUsers,
    staleTime: STALE_TIMES.search,
    enabled: isValidQuery,
    placeholderData: keepPreviousData,
    ...options,
  });
};

export const useCreatePostMutation = (
  options?: UseMutationOptions<CreatePostMutationResult, Error, { input: CreatePostInput }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { input: CreatePostInput }) =>
      graphqlRequest<CreatePostMutationResult>(getQueryString(CreatePostDocument), variables),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      if (data.createPost) {
        queryClient.setQueryData(
          queryKeys.posts.detail(data.createPost.id),
          { post: data.createPost },
        );
      }
    },
    ...options,
  });
};

export const useUpdatePostMutation = (
  options?: UseMutationOptions<
    UpdatePostMutationResult,
    Error,
    { postId: string; title?: string; content?: string; flairIds?: string[] }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<UpdatePostMutationResult>(getQueryString(UpdatePostDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.posts.detail(variables.postId),
        { post: data.updatePost },
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    ...options,
  });
};

export const useDeletePostMutation = (
  options?: UseMutationOptions<DeletePostMutationResult, Error, { postId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<DeletePostMutationResult>(getQueryString(DeletePostDocument), variables),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(variables.postId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.feed() });
    },
    ...options,
  });
};

export const useVotePostMutation = (
  options?: UseMutationOptions<VotePostMutationResult, Error, { postId: string; voteType: VoteType }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<VotePostMutationResult>(getQueryString(VotePostDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.posts.detail(variables.postId),
        { post: data.votePost },
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.lists() });
    },
    ...options,
  });
};

export const useSavePostMutation = (
  options?: UseMutationOptions<SavePostMutationResult, Error, { postId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<SavePostMutationResult>(getQueryString(SavePostDocument), variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.saved() });
    },
    ...options,
  });
};

export const useUnsavePostMutation = (
  options?: UseMutationOptions<UnsavePostMutationResult, Error, { postId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<UnsavePostMutationResult>(getQueryString(UnsavePostDocument), variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.saved() });
    },
    ...options,
  });
};

export const useCreateCommentMutation = (
  options?: UseMutationOptions<CreateCommentMutationResult, Error, { input: CreateCommentInput }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<CreateCommentMutationResult>(getQueryString(CreateCommentDocument), variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(variables.input.postId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.input.postId),
      });
    },
    ...options,
  });
};

export const useUpdateCommentMutation = (
  options?: UseMutationOptions<
    UpdateCommentMutationResult,
    Error,
    { commentId: string; content: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<UpdateCommentMutationResult>(getQueryString(UpdateCommentDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        { comment: data.updateComment },
      );
    },
    ...options,
  });
};

export const useDeleteCommentMutation = (
  postId: string,
  options?: UseMutationOptions<DeleteCommentMutationResult, Error, { commentId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<DeleteCommentMutationResult>(getQueryString(DeleteCommentDocument), variables),
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: queryKeys.comments.detail(variables.commentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments.byPost(postId) });
    },
    ...options,
  });
};

export const useVoteCommentMutation = (
  options?: UseMutationOptions<
    VoteCommentMutationResult,
    Error,
    { commentId: string; voteType: VoteType }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<VoteCommentMutationResult>(getQueryString(VoteCommentDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        { comment: data.voteComment },
      );
    },
    ...options,
  });
};

export const useJoinCommunityMutation = (
  options?: UseMutationOptions<JoinCommunityMutationResult, Error, { communityId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<JoinCommunityMutationResult>(getQueryString(JoinCommunityDocument), variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.detail(variables.communityId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.lists() });
    },
    ...options,
  });
};

export const useLeaveCommunityMutation = (
  options?: UseMutationOptions<LeaveCommunityMutationResult, Error, { communityId: string }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<LeaveCommunityMutationResult>(getQueryString(LeaveCommunityDocument), variables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.communities.detail(variables.communityId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.lists() });
    },
    ...options,
  });
};

export const useCreateCommunityMutation = (
  options?: UseMutationOptions<CreateCommunityMutationResult, Error, { input: CreateCommunityInput }>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<CreateCommunityMutationResult>(getQueryString(CreateCommunityDocument), variables),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.communities.popular() });
      if (data.createCommunity) {
        queryClient.setQueryData(
          queryKeys.communities.detail(data.createCommunity.id),
          { community: data.createCommunity },
        );
      }
    },
    ...options,
  });
};

export const useUpdateCommunityMutation = (
  options?: UseMutationOptions<
    UpdateCommunityMutationResult,
    Error,
    { communityId: string; description?: string; iconUrl?: string; bannerUrl?: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<UpdateCommunityMutationResult>(getQueryString(UpdateCommunityDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.communities.detail(variables.communityId),
        { community: data.updateCommunity },
      );
    },
    ...options,
  });
};

export const useUpdateUserMutation = (
  options?: UseMutationOptions<
    UpdateUserMutationResult,
    Error,
    { userId: string; name?: string; bio?: string; avatarUrl?: string }
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables) =>
      graphqlRequest<UpdateUserMutationResult>(getQueryString(UpdateUserDocument), variables),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        queryKeys.users.detail(variables.userId),
        { user: data.updateUser },
      );
    },
    ...options,
  });
};

export const prefetchQueries = {
  post: (queryClient: ReturnType<typeof useQueryClient>, postId: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.posts.detail(postId),
      queryFn: () =>
        graphqlRequest<PostQueryResult>(getQueryString(PostDocument), { id: postId }),
      staleTime: STALE_TIMES.posts,
    }),

  comments: (queryClient: ReturnType<typeof useQueryClient>, postId: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.comments.byPost(postId),
      queryFn: () =>
        graphqlRequest<CommentsQueryResult>(getQueryString(CommentsDocument), { postId }),
      staleTime: STALE_TIMES.comments,
    }),

  community: (queryClient: ReturnType<typeof useQueryClient>, communityId: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.communities.detail(communityId),
      queryFn: () =>
        graphqlRequest<CommunityQueryResult>(getQueryString(CommunityDocument), { id: communityId }),
      staleTime: STALE_TIMES.communities,
    }),

  communityByName: (queryClient: ReturnType<typeof useQueryClient>, name: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.communities.byName(name),
      queryFn: () =>
        graphqlRequest<CommunityByNameQueryResult>(getQueryString(CommunityByNameDocument), { name }),
      staleTime: STALE_TIMES.communities,
    }),

  feed: (queryClient: ReturnType<typeof useQueryClient>, variables?: { sort?: SortType; limit?: number }) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.posts.feed(variables),
      queryFn: () =>
        graphqlRequest<FeedQueryResult>(getQueryString(FeedDocument), variables),
      staleTime: STALE_TIMES.feed,
    }),

  topStories: (queryClient: ReturnType<typeof useQueryClient>, limit?: number) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.posts.topStories(limit),
      queryFn: () =>
        graphqlRequest<TopStoriesQueryResult>(getQueryString(TopStoriesDocument), { limit }),
      staleTime: STALE_TIMES.topStories,
    }),

  popularCommunities: (queryClient: ReturnType<typeof useQueryClient>, limit?: number) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.communities.popular(limit),
      queryFn: () =>
        graphqlRequest<PopularCommunitiesQueryResult>(getQueryString(PopularCommunitiesDocument), { limit }),
      staleTime: STALE_TIMES.popularCommunities,
    }),

  user: (queryClient: ReturnType<typeof useQueryClient>, userId: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: () =>
        graphqlRequest<UserQueryResult>(getQueryString(UserDocument), { id: userId }),
      staleTime: STALE_TIMES.users,
    }),

  userByUsername: (queryClient: ReturnType<typeof useQueryClient>, username: string) =>
    queryClient.prefetchQuery({
      queryKey: queryKeys.users.byUsername(username),
      queryFn: () =>
        graphqlRequest<UserByUsernameQueryResult>(getQueryString(UserByUsernameDocument), { username }),
      staleTime: STALE_TIMES.users,
    }),
};
