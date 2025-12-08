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
  /** Community creator */
  creator?: Maybe<User>;
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
  /** Whether the authenticated user is a moderator of this community */
  isModerator?: Maybe<Scalars['Boolean']['output']>;
  /** Number of members */
  memberCount: Scalars['Int']['output'];
  /** List of community members (first 50) */
  members: Array<User>;
  /** List of community moderators */
  moderators: Array<Moderator>;
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

/** Input for creating a new community */
export type CreateCommunityInput = {
  /** Community banner URL */
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  /** Community description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Display name (e.g., 'Programming') */
  displayName: Scalars['String']['input'];
  /** Community icon URL */
  iconUrl?: InputMaybe<Scalars['String']['input']>;
  /** URL-friendly name (e.g., 'programming') */
  name: Scalars['String']['input'];
};

/** Input for creating a new flair */
export type CreateFlairInput = {
  /** Background color (hex) */
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  /** Text color (hex) */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Community ID to create flair for */
  communityId: Scalars['ID']['input'];
  /** Flair label text */
  label: Scalars['String']['input'];
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

/** Input for creating a report */
export type CreateReportInput = {
  /** Comment ID to report (optional if reporting a post) */
  commentId?: InputMaybe<Scalars['ID']['input']>;
  /** Additional description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Post ID to report (optional if reporting a comment) */
  postId?: InputMaybe<Scalars['ID']['input']>;
  /** Reason for the report */
  reason: ReportReason;
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

/** Represents a moderator of a community */
export type Moderator = {
  __typename?: 'Moderator';
  /** Role: owner or moderator */
  role: Scalars['String']['output'];
  /** User information */
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Add a moderator to a community (owner only)
   *
   * **Authentication:** Required (must be community owner)
   *
   * **Parameters:**
   * - communityId: Community ID (required)
   * - userId: User ID to add as moderator (required)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   addModerator(communityId: "1", userId: "2") {
   *     id
   *     name
   *     moderators {
   *       user {
   *         username
   *       }
   *       role
   *     }
   *   }
   * }
   * ```
   */
  addModerator: Community;
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
   * Create a new community
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   createCommunity(input: {
   *     name: "programming"
   *     displayName: "Programming"
   *     description: "All about programming"
   *   }) {
   *     id
   *     name
   *     displayName
   *     description
   *   }
   * }
   * ```
   */
  createCommunity: Community;
  /**
   * Create a new flair for a community
   *
   * **Authentication:** Required (must be community moderator or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   createFlair(input: {
   *     communityId: "1"
   *     label: "Discussion"
   *     color: "#ffffff"
   *     backgroundColor: "#ff0000"
   *   }) {
   *     id
   *     label
   *     color
   *     backgroundColor
   *   }
   * }
   * ```
   */
  createFlair: Flair;
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
   *     title: "My awesome post"
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
   * Report a post or comment
   *
   * **Authentication:** Required
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   createReport(input: {
   *     postId: "1"
   *     reason: spam
   *     description: "This post contains spam content"
   *   }) {
   *     id
   *     reason
   *     status
   *   }
   * }
   * ```
   */
  createReport: Report;
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
   * Delete a community
   *
   * **Authentication:** Required (must be community owner or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   deleteCommunity(communityId: "1")
   * }
   * ```
   */
  deleteCommunity: Scalars['Boolean']['output'];
  /**
   * Delete a flair
   *
   * **Authentication:** Required (must be community moderator or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   deleteFlair(flairId: "1")
   * }
   * ```
   */
  deleteFlair: Scalars['Boolean']['output'];
  /**
   * Delete a post
   *
   * **Authentication:** Required (must be the author or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   deletePost(postId: "1")
   * }
   * ```
   */
  deletePost: Scalars['Boolean']['output'];
  /**
   * Delete a user account
   *
   * **Authentication:** Required (must be the user themselves)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   deleteUser(userId: "1")
   * }
   * ```
   */
  deleteUser: Scalars['Boolean']['output'];
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
   * Remove a moderator from a community (owner only)
   *
   * **Authentication:** Required (must be community owner)
   *
   * **Parameters:**
   * - communityId: Community ID (required)
   * - userId: User ID to remove as moderator (required)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   removeModerator(communityId: "1", userId: "2")
   * }
   * ```
   */
  removeModerator: Scalars['Boolean']['output'];
  /**
   * Resolve a report (moderator/admin only)
   *
   * **Authentication:** Required (must be moderator)
   *
   * **Parameters:**
   * - reportId: Report ID (required)
   * - status: New status ('resolved' or 'dismissed')
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   resolveReport(reportId: "1", status: "resolved") {
   *     id
   *     status
   *     resolvedAt
   *     resolvedBy {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  resolveReport: Report;
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
   * ```graphql
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
   * Update community information
   *
   * **Authentication:** Required (must be community owner or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   updateCommunity(communityId: "1", input: {
   *     displayName: "New Programming Community"
   *     description: "Updated description"
   *   }) {
   *     id
   *     displayName
   *     description
   *   }
   * }
   * ```
   */
  updateCommunity: Community;
  /**
   * Update a flair
   *
   * **Authentication:** Required (must be community moderator or admin)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   updateFlair(flairId: "1", input: {
   *     label: "Updated Label"
   *     color: "#000000"
   *   }) {
   *     id
   *     label
   *     color
   *     backgroundColor
   *   }
   * }
   * ```
   */
  updateFlair: Flair;
  /**
   * Update a post
   *
   * **Authentication:** Required (must be the author)
   *
   * **Parameters:**
   * - postId: Post ID (required)
   * - input: Post update data
   *   - title: New title (optional)
   *   - content: New content (optional)
   *   - flairIds: New flair IDs (optional)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   updatePost(postId: "1", input: {
   *     title: "Updated title"
   *     content: "Updated content"
   *     flairIds: ["2", "3"]
   *   }) {
   *     id
   *     title
   *     content
   *     flairs {
   *       label
   *     }
   *   }
   * }
   * ```
   */
  updatePost: Post;
  /**
   * Update user information
   *
   * **Authentication:** Required (must be the user themselves)
   *
   * **Example:**
   * ```graphql
   * mutation {
   *   updateUser(userId: "1", input: {
   *     username: "new_username"
   *     email: "newemail@example.com"
   *   }) {
   *     id
   *     username
   *     email
   *   }
   * }
   * ```
   */
  updateUser: User;
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


export type MutationAddModeratorArgs = {
  communityId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateCommunityArgs = {
  input: CreateCommunityInput;
};


export type MutationCreateFlairArgs = {
  input: CreateFlairInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreateReportArgs = {
  input: CreateReportInput;
};


export type MutationDeleteCommentArgs = {
  commentId: Scalars['ID']['input'];
};


export type MutationDeleteCommunityArgs = {
  communityId: Scalars['ID']['input'];
};


export type MutationDeleteFlairArgs = {
  flairId: Scalars['ID']['input'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID']['input'];
};


export type MutationJoinCommunityArgs = {
  communityId: Scalars['ID']['input'];
};


export type MutationLeaveCommunityArgs = {
  communityId: Scalars['ID']['input'];
};


export type MutationRemoveModeratorArgs = {
  communityId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationResolveReportArgs = {
  reportId: Scalars['ID']['input'];
  status: Scalars['String']['input'];
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


export type MutationUpdateCommunityArgs = {
  communityId: Scalars['ID']['input'];
  input: UpdateCommunityInput;
};


export type MutationUpdateFlairArgs = {
  flairId: Scalars['ID']['input'];
  input: UpdateFlairInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
  postId: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
  userId: Scalars['ID']['input'];
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
   * Get flairs for a community
   *
   * **Parameters:**
   * - communityId: Community ID (required)
   *
   * **Example:**
   * ```graphql
   * query {
   *   flairsByCommunity(communityId: "1") {
   *     id
   *     label
   *     color
   *     backgroundColor
   *   }
   * }
   * ```
   */
  flairsByCommunity: Array<Flair>;
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
   * Get a specific report by ID (moderator/admin only)
   *
   * **Authentication:** Required (must be moderator)
   *
   * **Example:**
   * ```graphql
   * query {
   *   report(id: "1") {
   *     id
   *     reason
   *     description
   *     status
   *     reporter {
   *       username
   *     }
   *   }
   * }
   * ```
   */
  report?: Maybe<Report>;
  /**
   * Get reports (moderator/admin only)
   *
   * **Authentication:** Required (must be moderator)
   *
   * **Parameters:**
   * - status: Filter by status (optional: 'pending', 'resolved', 'dismissed')
   * - limit: Number of results per page (default: 20)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   reports(status: "pending", limit: 20) {
   *     id
   *     reason
   *     status
   *     reporter {
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
  reports: Array<Report>;
  /**
   * Get saved posts for the current user
   *
   * **Authentication:** Required
   *
   * **Parameters:**
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   savedPosts(limit: 20, offset: 0) {
   *     id
   *     title
   *     score
   *     community {
   *       name
   *       displayName
   *     }
   *     author {
   *       username
   *     }
   *     savedAt
   *   }
   * }
   * ```
   */
  savedPosts: Array<Post>;
  /**
   * Search communities by name or display name
   *
   * **Parameters:**
   * - query: Search query (required)
   * - limit: Number of results per page (default: 20)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   searchCommunities(query: "programming", limit: 10) {
   *     id
   *     name
   *     displayName
   *     memberCount
   *   }
   * }
   * ```
   */
  searchCommunities: Array<Community>;
  /**
   * Search posts by title or content
   *
   * **Parameters:**
   * - query: Search query (required)
   * - communityId: Filter by community (optional)
   * - limit: Number of results per page (default: 20)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   searchPosts(query: "javascript", limit: 10) {
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
  searchPosts: Array<Post>;
  /**
   * Search users by username
   *
   * **Parameters:**
   * - query: Search query (minimum 2 characters)
   * - limit: Number of results per page (default: 20, max: 100)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   searchUsers(query: "john", limit: 10, offset: 0) {
   *     id
   *     username
   *     email
   *     createdAt
   *   }
   * }
   * ```
   */
  searchUsers: Array<User>;
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
   * Get comments by a specific user
   *
   * **Parameters:**
   * - userId: User ID (required)
   * - limit: Number of results per page (default: 20)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   userComments(userId: "1", limit: 20, offset: 0) {
   *     id
   *     content
   *     score
   *     post {
   *       id
   *       title
   *     }
   *   }
   * }
   * ```
   */
  userComments: Array<Comment>;
  /**
   * Get posts by a specific user
   *
   * **Parameters:**
   * - userId: User ID (required)
   * - limit: Number of results per page (default: 20)
   * - offset: Number of results to skip (default: 0)
   *
   * **Example:**
   * ```graphql
   * query {
   *   userPosts(userId: "1", limit: 20, offset: 0) {
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
  userPosts: Array<Post>;
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


export type QueryFlairsByCommunityArgs = {
  communityId: Scalars['ID']['input'];
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


export type QueryReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReportsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySavedPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchCommunitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchPostsArgs = {
  communityId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QueryTopStoriesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryUserPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
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

/** Represents a report on a post or comment */
export type Report = {
  __typename?: 'Report';
  /** Comment being reported (null if reporting a post) */
  comment?: Maybe<Comment>;
  /** Report creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Additional description */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier for the report */
  id: Scalars['ID']['output'];
  /** Post being reported (null if reporting a comment) */
  post?: Maybe<Post>;
  /** Reason for the report */
  reason: ReportReason;
  /** User who submitted the report */
  reporter: User;
  /** Report resolution timestamp */
  resolvedAt?: Maybe<Scalars['DateTime']['output']>;
  /** User who resolved the report */
  resolvedBy?: Maybe<User>;
  /** Report status */
  status: Scalars['String']['output'];
};

/** Report reason enumeration */
export enum ReportReason {
  CopyrightViolation = 'copyright_violation',
  Harassment = 'harassment',
  HateSpeech = 'hate_speech',
  InappropriateContent = 'inappropriate_content',
  Other = 'other',
  Spam = 'spam',
  Violence = 'violence'
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

/** Input for updating a community */
export type UpdateCommunityInput = {
  /** New banner URL */
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  /** New description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** New display name */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** New icon URL */
  iconUrl?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a flair */
export type UpdateFlairInput = {
  /** New background color (hex) */
  backgroundColor?: InputMaybe<Scalars['String']['input']>;
  /** New text color (hex) */
  color?: InputMaybe<Scalars['String']['input']>;
  /** New flair label text */
  label?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a post */
export type UpdatePostInput = {
  /** New post content/body */
  content?: InputMaybe<Scalars['String']['input']>;
  /** New flair IDs to attach */
  flairIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** New post title (max 300 characters) */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Input for updating a user */
export type UpdateUserInput = {
  /** New email address */
  email?: InputMaybe<Scalars['String']['input']>;
  /** New username (3-50 characters, alphanumeric + underscore) */
  username?: InputMaybe<Scalars['String']['input']>;
};

/** Represents a user in the system */
export type User = {
  __typename?: 'User';
  /** User avatar URL */
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** User bio */
  bio?: Maybe<Scalars['String']['output']>;
  /** Comments by this user */
  comments: Array<Comment>;
  /** Account creation timestamp */
  createdAt: Scalars['DateTime']['output'];
  /** Email address (unique) */
  email: Scalars['String']['output'];
  /** Unique identifier for the user */
  id: Scalars['ID']['output'];
  /** Full name for Google auth users (optional) */
  name?: Maybe<Scalars['String']['output']>;
  /** Posts by this user */
  posts: Array<Post>;
  /** Username (unique, 3-50 characters) */
  username: Scalars['String']['output'];
};


/** Represents a user in the system */
export type UserCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Represents a user in the system */
export type UserPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Vote type for posts and comments */
export enum VoteType {
  /** Downvote */
  Downvote = 'downvote',
  /** Upvote */
  Upvote = 'upvote'
}

export type AutoGeneratedQueriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedQueriesQuery = { __typename?: 'Query', users: Array<User>, searchUsers: Array<User>, user?: User | null, communities: Array<Community>, community?: Community | null, communityByName?: Community | null, popularCommunities: Array<Community>, posts: Array<Post>, post?: Post | null, feed: Array<Post>, topStories: Array<Post>, postsByCommunity: Array<Post>, comments: Array<Comment>, comment?: Comment | null, savedPosts: Array<Post>, flairsByCommunity: Array<Flair>, userPosts: Array<Post>, userComments: Array<Comment>, searchCommunities: Array<Community>, searchPosts: Array<Post>, reports: Array<Report>, report?: Report | null };

export type AutoGeneratedMutationsMutationVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedMutationsMutation = { __typename?: 'Mutation', updateUser: User, deleteUser: boolean, joinCommunity: Community, leaveCommunity: boolean, createCommunity: Community, updateCommunity: Community, deleteCommunity: boolean, createFlair: Flair, updateFlair: Flair, deleteFlair: boolean, createReport: Report, createPost: Post, votePost: Post, savePost: boolean, unsavePost: boolean, updatePost: Post, deletePost: boolean, createComment: Comment, voteComment: Comment, updateComment: Comment, deleteComment: boolean, resolveReport: Report, addModerator: Community, removeModerator: boolean };


export const AutoGeneratedQueriesDocument = gql`
    query AutoGeneratedQueries {
  users
  searchUsers
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
  savedPosts
  flairsByCommunity
  userPosts
  userComments
  searchCommunities
  searchPosts
  reports
  report
}
    `;

export function useAutoGeneratedQueriesQuery(options?: Omit<Urql.UseQueryArgs<AutoGeneratedQueriesQueryVariables>, 'query'>) {
  return Urql.useQuery<AutoGeneratedQueriesQuery, AutoGeneratedQueriesQueryVariables>({ query: AutoGeneratedQueriesDocument, ...options });
};
export const AutoGeneratedMutationsDocument = gql`
    mutation AutoGeneratedMutations {
  updateUser
  deleteUser
  joinCommunity
  leaveCommunity
  createCommunity
  updateCommunity
  deleteCommunity
  createFlair
  updateFlair
  deleteFlair
  createReport
  createPost
  votePost
  savePost
  unsavePost
  updatePost
  deletePost
  createComment
  voteComment
  updateComment
  deleteComment
  resolveReport
  addModerator
  removeModerator
}
    `;

export function useAutoGeneratedMutationsMutation() {
  return Urql.useMutation<AutoGeneratedMutationsMutation, AutoGeneratedMutationsMutationVariables>(AutoGeneratedMutationsDocument);
};