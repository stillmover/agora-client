import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

/** Represents a comment on a post */
export type Comment = {
  __typename?: 'Comment';
  /** User who created the comment */
  author: User;
  /** Comment content */
  content: Scalars['String']['output'];
  /** Comment creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier for the comment */
  id: Scalars['ID']['output'];
  /** Parent comment ID (for nested comments) */
  parentId?: Maybe<Scalars['ID']['output']>;
  /** Post this comment belongs to */
  post: Post;
  /** Replies to this comment */
  replies: Array<Comment>;
  /** Comment score (upvotes - downvotes) */
  score: Scalars['Int']['output'];
  /** Last update timestamp */
  updatedAt: Scalars['DateTime']['output'];
  /** Current user's vote on this comment (if authenticated) */
  userVote?: Maybe<VoteType>;
};

/** Represents a community (subreddit) */
export type Community = {
  __typename?: 'Community';
  /** Community banner URL */
  bannerUrl?: Maybe<Scalars['String']['output']>;
  /** Community creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Community description */
  description?: Maybe<Scalars['String']['output']>;
  /** Display name (e.g., 'Programming') */
  displayName: Scalars['String']['output'];
  /** Community icon URL */
  iconUrl?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the community */
  id: Scalars['ID']['output'];
  /** Whether the authenticated user has joined this community */
  isJoined?: Maybe<Scalars['Boolean']['output']>;
  /** Number of members */
  memberCount: Scalars['Int']['output'];
  /** List of community members (first 50) */
  members: Array<User>;
  /** URL-friendly name (e.g., 'programming') */
  name: Scalars['String']['output'];
  /** Last update timestamp */
  updatedAt: Scalars['DateTime']['output'];
};


/** Represents a community (subreddit) */
export type CommunityMembersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Input for creating a comment */
export type CreateCommentInput = {
  /** Comment content (required) */
  content: Scalars['String']['input'];
  /** Parent comment ID (for replies, optional) */
  parentId?: InputMaybe<Scalars['ID']['input']>;
  /** Post ID to comment on */
  postId: Scalars['ID']['input'];
};

/** Input for creating a new post */
export type CreatePostInput = {
  /** Community ID to post in */
  communityId: Scalars['ID']['input'];
  /** Post content/body (optional) */
  content?: InputMaybe<Scalars['String']['input']>;
  /** Flair IDs to attach (optional) */
  flairIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** Media attachments (optional) */
  media?: InputMaybe<Array<PostMediaInput>>;
  /** Post title (required, max 300 characters) */
  title: Scalars['String']['input'];
  /** Post type (default: text) */
  type?: InputMaybe<PostType>;
};

/** Represents a flair/tag for posts */
export type Flair = {
  __typename?: 'Flair';
  /** Background color (hex) */
  backgroundColor?: Maybe<Scalars['String']['output']>;
  /** Text color (hex) */
  color?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the flair */
  id: Scalars['ID']['output'];
  /** Flair label text */
  label: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Create a comment on a post
   *
   * **Authentication:** Required
   *
   * **Parameters:**
   * - input: Comment creation data
   *   - postId: Post ID (required)
   *   - content: Comment content (required)
   *   - parentId: Parent comment ID for replies (optional)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   createComment(input: {
   *     postId: "1"
   *     content: "Great post!"
   *     parentId: null
   *   }) {
   *     id
   *     content
   *     score
   *     author {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  createComment: Comment;
  /**
   * Create a new post
   *
   * **Authentication:** Required
   *
   * **Parameters:**
   * - input: Post creation data
   *   - communityId: Community ID (required)
   *   - title: Post title (required, max 300 chars)
   *   - content: Post content (optional)
   *   - type: Post type (default: text)
   *   - media: Media attachments (optional)
   *   - flairIds: Flair IDs (optional)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   createPost(input: {
   *     communityId: "1"
   *     title: "My awesome post"r/react
   *     content: "This is the content"
   *     type: text
   *     flairIds: ["1", "2"]
   *   }) {
   *     id
   *     title
   *     score
   *     community {
   *       name
   *     }
   *   }
   * }
   * ```
   */
  createPost: Post;
  /**
   * Delete a comment
   *
   * **Authentication:** Required (must be the author)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   deleteComment(commentId: "1")
   * }
   * ```
   */
  deleteComment: Scalars['Boolean']['output'];
  /**
   * Join a community
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   joinCommunity(communityId: "1") {
   *     id
   *     name
   *     displayName
   *     isJoined
   *   }
   * }
   * ```
   */
  joinCommunity: Community;
  /**
   * Leave a community
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   leaveCommunity(communityId: "1")
   * }
   * ```
   */
  leaveCommunity: Scalars['Boolean']['output'];
  /**
   * Save a post for later
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   savePost(postId: "1")
   * }
   * ```
   */
  savePost: Scalars['Boolean']['output'];
  /**
   * Unsave a post
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphqlr/react
   * mutation {
   *   unsavePost(postId: "1")
   * }
   * ```
   */
  unsavePost: Scalars['Boolean']['output'];
  /**
   * Update a comment
   *
   * **Authentication:** Required (must be the author)
   *
   * **Parameters:**
   * - commentId: Comment ID (required)
   * - content: New comment content (required)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   updateComment(commentId: "1", content: "Updated content") {
   *     id
   *     content
   *     updatedAt
   *   }
   * }
   * ```
   */
  updateComment: Comment;
  /**
   * Vote on a comment (upvote or downvote)
   *
   * **Authentication:** Required
   *
   * **Parameters:**
   * - commentId: Comment ID (required)
   * - voteType: Vote type (upvote or downvote)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   voteComment(commentId: "1", voteType: upvote) {
   *     id
   *     score
   *     userVote
   *   }
   * }
   * ```
   */
  voteComment: Comment;
  /**
   * Vote on a post (upvote or downvote)
   *
   * **Authentication:** Required
   *
   * **Parameters:**
   * - postId: Post ID (required)
   * - voteType: Vote type (upvote or downvote)
   *
   * Clicking the same vote button again removes the vote.
   * Changing vote type updates the vote.
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   votePost(postId: "1", voteType: upvote) {
   *     id
   *     score
   *     userVote
   *   }
   * }
   * ```
   */
  votePost: Post;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationJoinCommunityArgs = {
  communityId: Scalars['ID']['input'];
};


export type MutationLeaveCommunityArgs = {
  communityId: Scalars['ID']['input'];
};


export type MutationSavePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUnsavePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationUpdateCommentArgs = {
  commentId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
};


export type MutationVoteCommentArgs = {
  commentId: Scalars['ID']['input'];
  voteType: VoteType;
};


export type MutationVotePostArgs = {
  postId: Scalars['ID']['input'];
  voteType: VoteType;
};

/** Represents a post in the system */
export type Post = {
  __typename?: 'Post';
  /** User who created the post */
  author: User;
  /** Number of comments */
  commentCount: Scalars['Int']['output'];
  /** Comments on this post (paginated) */
  comments: Array<Comment>;
  /** Community this post belongs to */
  community: Community;
  /** Post content/body text */
  content?: Maybe<Scalars['String']['output']>;
  /** Post creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Flairs/tags associated with the post */
  flairs: Array<Flair>;
  /** Unique identifier for the post */
  id: Scalars['ID']['output'];
  /** Whether the current user has saved this post */
  isSaved?: Maybe<Scalars['Boolean']['output']>;
  /** Media attachments */
  media: Array<PostMedia>;
  /** Post score (upvotes - downvotes) */
  score: Scalars['Int']['output'];
  /** Post title (max 300 characters) */
  title: Scalars['String']['output'];
  /** Post type */
  type: PostType;
  /** Last update timestamp */
  updatedAt: Scalars['DateTime']['output'];
  /** Current user's vote on this post (if authenticated) */
  userVote?: Maybe<VoteType>;
};


/** Represents a post in the system */
export type PostCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents media attached to a post (image, video, link) */
export type PostMedia = {
  __typename?: 'PostMedia';
  /** Media height in pixels */
  height?: Maybe<Scalars['Int']['output']>;
  /** Unique identifier for the media */
  id: Scalars['ID']['output'];
  /** Thumbnail URL (alias for thumbnailUrl) */
  thumb?: Maybe<Scalars['String']['output']>;
  /** Thumbnail URL (for videos) */
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  /** Media type: 'image', 'video', or 'link' */
  type: Scalars['String']['output'];
  /** Media URL */
  url: Scalars['String']['output'];
  /** Media width in pixels */
  width?: Maybe<Scalars['Int']['output']>;
};

/** Input for post media */
export type PostMediaInput = {
  /** Media height in pixels */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Thumbnail URL (for videos) */
  thumbnailUrl?: InputMaybe<Scalars['String']['input']>;
  /** Media type: 'image', 'video', or 'link' */
  type: Scalars['String']['input'];
  /** Media URL */
  url: Scalars['String']['input'];
  /** Media width in pixels */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Sort order for posts (alias for SortType for backward compatibility) */
export enum PostSort {
  /** Best posts (score + comments weighted) */
  Best = 'best',
  /** Hot posts (score weighted by time) */
  Hot = 'hot',
  /** Newest posts */
  New = 'new',
  /** Rising posts (recent high-scoring) */
  Rising = 'rising',
  /** Top posts (highest score) */
  Top = 'top'
}

/** Post content type */
export enum PostType {
  /** Image post */
  Image = 'image',
  /** Link post */
  Link = 'link',
  /** Poll post */
  Poll = 'poll',
  /** Text-only post */
  Text = 'text',
  /** Video post */
  Video = 'video'
}

export type Query = {
  __typename?: 'Query';
  /**
   * Get a specific comment by ID
   *
   * **Example:**
   * ```graphql
   * query {
   *   comment(id: "1") {
   *     id
   *     content
   *     score
   *     author {
   *       username
   *     }
   *     post {
   *       id
   *       title
   *     }
   *   }
   * }
   * ```
   */
  comment?: Maybe<Comment>;
  /**
   * Get comments for a post in tree structure
   *
   * **Parameters:**
   * - postId: Post ID (required)
   * - limit: Number of results per page (default: 50, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * Returns comments in a nested tree structure with replies.
   *
   * **Example:**
   * ```graphql
   * query {
   *   comments(postId: "1", limit: 50, offset: 0) {
   *     id
   *     content
   *     score
   *     author {
   *       username
   *     }
   *     replies {
   *       id
   *       content
   *       author {
   *         username
   *       }
   *     }
   *   }
   * }
   * ```
   */
  comments: Array<Comment>;
  /**
   * Get paginated list of all communities
   *
   * **Pagination:**
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   communities(limit: 20, offset: 0) {
   *     id
   *     name
   *     displayName
   *     memberCount
   *     isJoined
   *   }
   * }
   * ```
   */
  communities: Array<Community>;
  /**
   * Get a specific community by ID
   *
   * **Example:**
   * ```graphql
   * query {
   *   community(id: "1") {
   *     id
   *     name
   *     displayName
   *     description
   *     memberCount
   *   }
   * }
   * ```
   */
  community?: Maybe<Community>;
  /**
   * Get a community by its URL-friendly name
   *
   * **Example:**
   * ```graphql
   * query {
   *   communityByName(name: "programming") {
   *     id
   *     name
   *     displayName
   *     memberCount
   *   }
   * }
   * ```
   */
  communityByName?: Maybe<Community>;
  /**
   * Get personalized feed of posts with sorting options
   *
   * **Parameters:**
   * - sort: Sort order (default: best)
   *   - best: Score + comment count weighted
   *   - hot: Score weighted by time (last 24h)
   *   - new: Newest posts first
   *   - rising: Recent high-scoring posts
   *   - top: Highest score
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Authentication:** Optional - if authenticated, feed may be personalized
   *
   * **Example:**
   * ```graphql
   * query {
   *   feed(sort: hot, limit: 20, offset: 0) {
   *     id
   *     title
   *     score
   *     commentCount
   *     community {
   *       name
   *       displayName
   *       iconUrl
   *     }
   *     author {
   *       username
   *     }
   *     flairs {
   *       label
   *       color
   *     }
   *     userVote
   *     isSaved
   *   }
   * }
   * ```
   */
  feed: Array<Post>;
  /**
   * Get popular communities sorted by member count
   *
   * **Parameters:**
   * - limit: Number of results (default: 10, max: 50)
   *
   * **Example:**
   * ```graphql
   * query {
   *   popularCommunities(limit: 10) {
   *     id
   *     name
   *     displayName
   *     memberCount
   *     iconUrl
   *   }
   * }
   * ```
   */
  popularCommunities: Array<Community>;
  /**
   * Get a specific post by ID with all relations
   *
   * **Example:**
   * ```graphql
   * query {
   *   post(id: "1") {
   *     id
   *     title
   *     content
   *     score
   *     community {
   *       name
   *       displayName
   *     }
   *     author {
   *       username
   *     }
   *     media {
   *       type
   *       url
   *     }
   *     flairs {
   *       label
   *       color
   *     }
   *   }
   * }
   * ```
   */
  post?: Maybe<Post>;
  /**
   * Get paginated list of all posts
   *
   * **Pagination:**
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Filtering:**
   * - region: Filter posts by geographic region (default: all)
   * - communityId: Filter posts by specific community
   * - sort: Sort order for posts (default: best)
   *
   * **Example:**
   * ```graphql
   * query {
   *   posts(region: north_america, sort: hot, limit: 20, offset: 0) {
   *     id
   *     title
   *     score
   *     commentCount
   *     community {
   *       name
   *       displayName
   *     }
   *     author {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  posts: Array<Post>;
  /**
   * Get posts from a specific community
   *
   * **Parameters:**
   * - communityId: Community ID (required)
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   postsByCommunity(communityId: "1", limit: 20, offset: 0) {
   *     id
   *     title
   *     score
   *     commentCount
   *     author {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  postsByCommunity: Array<Post>;
  /**
   * Get top stories for hero carousel
   *
   * **Parameters:**
   * - limit: Number of results (default: 6, max: 20)
   *
   * Returns top-scoring posts from the last 24 hours.
   *
   * **Example:**
   * ```graphql
   * query {
   *   topStories(limit: 6) {
   *     id
   *     title
   *     score
   *     community {
   *       name
   *       displayName
   *       iconUrl
   *     }
   *     media {
   *       type
   *       url
   *       thumbnailUrl
   *     }
   *   }
   * }
   * ```
   */
  topStories: Array<Post>;
  /**
   * Get a specific user by ID
   *
   * **Example:**
   * ```graphql
   * query {
   *   user(id: "1") {
   *     id
   *     username
   *     email
   *     createdAt
   *   }
   * }
   * ```
   */
  user?: Maybe<User>;
  /**
   * Get paginated list of all users
   *
   * **Pagination:**
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   users(limit: 10, offset: 0) {
   *     id
   *     username
   *     email
   *   }
   * }
   * ```
   */
  users: Array<User>;
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryCommunitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCommunityArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCommunityByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryFeedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SortType>;
};


export type QueryPopularCommunitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryPostArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPostsArgs = {
  communityId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  region?: InputMaybe<Region>;
  sort?: InputMaybe<SortType>;
};


export type QueryPostsByCommunityArgs = {
  communityId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTopStoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Geographic region for content filtering */
export enum Region {
  /** Africa */
  Africa = 'africa',
  /** All regions */
  All = 'all',
  /** Asia */
  Asia = 'asia',
  /** Australia */
  Australia = 'australia',
  /** Europe */
  Europe = 'europe',
  /** North America */
  NorthAmerica = 'north_america',
  /** South America */
  SouthAmerica = 'south_america'
}

/** Sort order for post feeds */
export enum SortType {
  /** Best posts (score + comments weighted) */
  Best = 'best',
  /** Hot posts (score weighted by time) */
  Hot = 'hot',
  /** Newest posts */
  New = 'new',
  /** Rising posts (recent high-scoring) */
  Rising = 'rising',
  /** Top posts (highest score) */
  Top = 'top'
}

export type Subscription = {
  __typename?: 'Subscription';
  /**
   * Subscribe to new comments on a post in real-time
   *
   * **Parameters:**
   * - postId: Post ID (required)
   *
   * **Example:**
   * ```graphql
   * subscription {
   *   commentAdded(postId: "1") {
   *     id
   *     content
   *     score
   *     author {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  commentAdded: Comment;
  /**
   * Subscribe to comment vote changes in real-time
   *
   * **Parameters:**
   * - commentId: Comment ID (required)
   *
   * **Example:**
   * ```graphql
   * subscription {
   *   commentVoted(commentId: "1") {
   *     id
   *     score
   *     userVote
   *   }
   * }
   * ```
   */
  commentVoted: Comment;
  /**
   * Subscribe to new posts in real-time
   *
   * **Parameters:**
   * - communityId: Optional - filter by community ID
   *
   * **Example:**
   * ```graphql
   * subscription {
   *   postAdded(communityId: "1") {
   *     id
   *     title
   *     score
   *     community {
   *       name
   *     }
   *     author {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  postAdded: Post;
  /**
   * Subscribe to post updates in real-time
   *
   * **Parameters:**
   * - postId: Post ID (required)
   *
   * **Example:**
   * ```graphql
   * subscription {
   *   postUpdated(postId: "1") {
   *     id
   *     title
   *     score
   *     commentCount
   *   }
   * }
   * ```
   */
  postUpdated: Post;
  /**
   * Subscribe to post vote changes in real-time
   *
   * **Parameters:**
   * - postId: Post ID (required)
   *
   * **Example:**
   * ```graphql
   * subscription {
   *   postVoted(postId: "1") {
   *     id
   *     score
   *     userVote
   *   }
   * }
   * ```
   */
  postVoted: Post;
};


export type SubscriptionCommentAddedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionCommentVotedArgs = {
  commentId: Scalars['ID']['input'];
};


export type SubscriptionPostAddedArgs = {
  communityId?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionPostUpdatedArgs = {
  postId: Scalars['ID']['input'];
};


export type SubscriptionPostVotedArgs = {
  postId: Scalars['ID']['input'];
};

/** Represents a user in the system */
export type User = {
  __typename?: 'User';
  /** Account creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Email address (unique) */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['ID']['output'];
  /** Full name for Google auth users */
  name: Scalars['String']['output'];
  /** Username (unique, 3-50 characters) */
  username: Scalars['String']['output'];
};

/** Vote type for posts and comments */
export enum VoteType {
  /** Downvote */
  Downvote = 'downvote',
  /** Upvote */
  Upvote = 'upvote'
}

export type AutoGeneratedQueriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedQueriesQuery = { __typename?: 'Query', users: Array<User>, user?: User | null, communities: Array<Community>, community?: Community | null, communityByName?: Community | null, popularCommunities: Array<Community>, posts: Array<Post>, post?: Post | null, feed: Array<Post>, topStories: Array<Post>, postsByCommunity: Array<Post>, comments: Array<Comment>, comment?: Comment | null };

export type AutoGeneratedMutationsMutationVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedMutationsMutation = { __typename?: 'Mutation', joinCommunity: Community, leaveCommunity: boolean, createPost: Post, votePost: Post, savePost: boolean, unsavePost: boolean, createComment: Comment, voteComment: Comment, updateComment: Comment, deleteComment: boolean };


export const AutoGeneratedQueriesDocument = gql`
    query AutoGeneratedQueries {
  users
  user
  communities
  community
  communityByName
  popularCommunities
  posts
  post
  feed
  topStories
  postsByCommunity
  comments
  comment
}
    `;

export function useAutoGeneratedQueriesQuery(options?: Omit<Urql.UseQueryArgs<AutoGeneratedQueriesQueryVariables>, 'query'>) {
  return Urql.useQuery<AutoGeneratedQueriesQuery, AutoGeneratedQueriesQueryVariables>({ query: AutoGeneratedQueriesDocument, ...options });
};
export const AutoGeneratedMutationsDocument = gql`
    mutation AutoGeneratedMutations {
  joinCommunity
  leaveCommunity
  createPost
  votePost
  savePost
  unsavePost
  createComment
  voteComment
  updateComment
  deleteComment
}
    `;

export function useAutoGeneratedMutationsMutation() {
  return Urql.useMutation<AutoGeneratedMutationsMutation, AutoGeneratedMutationsMutationVariables>(AutoGeneratedMutationsDocument);
};
