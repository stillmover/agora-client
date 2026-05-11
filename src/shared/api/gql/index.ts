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

export type AddSocialLinkInput = {
  label: Scalars['String']['input'];
  url: Scalars['String']['input'];
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

export type Community = {
  __typename?: 'Community';
  bannerUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  iconUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isJoined: Scalars['Boolean']['output'];
  isModerator?: Maybe<Scalars['Boolean']['output']>;
  memberCount: Scalars['Int']['output'];
  members: Array<User>;
  moderators: Array<Moderator>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


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

export type CreateCommunityInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  iconUrl?: InputMaybe<Scalars['String']['input']>;
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
  role: ModeratorRole;
  /** User information */
  user: User;
};

/** Moderator role within a community */
export enum ModeratorRole {
  Moderator = 'moderator',
  Owner = 'owner'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a moderator to a community (auth required, must be owner) */
  addModerator: Community;
  addSocialLink: SocialLink;
  /** Delete all notifications (auth required) */
  clearAllNotifications: Scalars['Boolean']['output'];
  /** Delete a notification (auth required) */
  clearNotification: Scalars['Boolean']['output'];
  /** Create a comment on a post (auth required) */
  createComment: Comment;
  /** Create a new community (auth required) */
  createCommunity: Community;
  /** Create a new flair for a community (auth required, must be moderator) */
  createFlair: Flair;
  /** Create a new post (auth required) */
  createPost: Post;
  /** Report a post or comment (auth required) */
  createReport: Report;
  /** Delete a comment (auth required, must be the author) */
  deleteComment: Scalars['Boolean']['output'];
  /** Delete a community (auth required, must be owner) */
  deleteCommunity: Scalars['Boolean']['output'];
  /** Delete a flair (auth required, must be moderator) */
  deleteFlair: Scalars['Boolean']['output'];
  /** Delete a post (auth required, must be the author or moderator) */
  deletePost: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  /** Join a community (auth required) */
  joinCommunity: Community;
  /** Leave a community (auth required) */
  leaveCommunity: Scalars['Boolean']['output'];
  /** Mark all notifications as read (auth required) */
  markAllNotificationsAsRead: Scalars['Boolean']['output'];
  /** Mark a notification as read (auth required) */
  markNotificationAsRead: Notification;
  /** Remove a moderator from a community (auth required, must be owner) */
  removeModerator: Scalars['Boolean']['output'];
  removeSocialLink: Scalars['Boolean']['output'];
  /** Resolve or dismiss a report (auth required, must be a moderator) */
  resolveReport: Report;
  /** Save a post for later (auth required) */
  savePost: Scalars['Boolean']['output'];
  /** Unsave a previously saved post (auth required) */
  unsavePost: Scalars['Boolean']['output'];
  /** Update a comment (auth required, must be the author) */
  updateComment: Comment;
  /** Update community information (auth required, must be owner or moderator) */
  updateCommunity: Community;
  /** Update a flair (auth required, must be moderator) */
  updateFlair: Flair;
  /** Update a post (auth required, must be the author) */
  updatePost: Post;
  updateSocialLink: SocialLink;
  updateUser: User;
  /** Vote on a comment — same vote again removes it (auth required) */
  voteComment: Comment;
  /** Vote on a post — same vote again removes it (auth required) */
  votePost: Post;
};


export type MutationAddModeratorArgs = {
  communityId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAddSocialLinkArgs = {
  input: AddSocialLinkInput;
};


export type MutationClearNotificationArgs = {
  id: Scalars['ID']['input'];
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


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveModeratorArgs = {
  communityId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveSocialLinkArgs = {
  linkId: Scalars['ID']['input'];
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


export type MutationUpdateSocialLinkArgs = {
  input: UpdateSocialLinkInput;
  linkId: Scalars['ID']['input'];
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

/** A notification for the authenticated user */
export type Notification = {
  __typename?: 'Notification';
  /** User who triggered the notification */
  actor?: Maybe<User>;
  /** Related comment (if applicable) */
  comment?: Maybe<Comment>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  /** Whether the notification has been read */
  isRead: Scalars['Boolean']['output'];
  /** Human-readable notification message */
  message: Scalars['String']['output'];
  /** Related post (if applicable) */
  post?: Maybe<Post>;
  /** What triggered this notification */
  type: NotificationType;
};

/** Type of notification event */
export enum NotificationType {
  Award = 'award',
  Comment = 'comment',
  Follow = 'follow',
  Mention = 'mention',
  Reply = 'reply',
  Upvote = 'upvote'
}

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
  Image = 'image',
  Link = 'link',
  Poll = 'poll',
  Text = 'text',
  Video = 'video'
}

export type Query = {
  __typename?: 'Query';
  /** Get a specific comment by ID */
  comment?: Maybe<Comment>;
  /** Get comments for a post in tree structure */
  comments: Array<Comment>;
  /** Get paginated list of all communities */
  communities: Array<Community>;
  /** Get a specific community by ID */
  community?: Maybe<Community>;
  /** Get a community by its URL-friendly name */
  communityByName?: Maybe<Community>;
  /** Get personalized feed of posts */
  feed: Array<Post>;
  /** Get flairs for a community */
  flairsByCommunity: Array<Flair>;
  me?: Maybe<User>;
  /** Get the authenticated user's notifications (auth required) */
  notifications: Array<Notification>;
  /** Get popular communities sorted by member count */
  popularCommunities: Array<Community>;
  /** Get a specific post by ID */
  post?: Maybe<Post>;
  /** Get paginated list of posts with optional filtering and sorting */
  posts: Array<Post>;
  /** Get posts from a specific community */
  postsByCommunity: Array<Post>;
  /** Get a specific report by ID — auth required, must be a moderator */
  report?: Maybe<Report>;
  /** Get reports — auth required, must be a moderator */
  reports: Array<Report>;
  /** Get saved posts for the current user (auth required) */
  savedPosts: Array<Post>;
  /** Search communities by name or display name */
  searchCommunities: Array<Community>;
  /** Search posts by title or content */
  searchPosts: Array<Post>;
  searchUsers: Array<User>;
  /** Get top stories from the last 24 hours */
  topStories: Array<Post>;
  /** Count of unread notifications for the authenticated user (auth required) */
  unreadNotificationsCount: Scalars['Int']['output'];
  user?: Maybe<User>;
  userByUsername?: Maybe<User>;
  /** Get comments by a specific user */
  userComments: Array<Comment>;
  /** Get posts by a specific user */
  userPosts: Array<Post>;
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


export type QueryNotificationsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
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


export type QueryUserByUsernameArgs = {
  username: Scalars['String']['input'];
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

export enum Region {
  Africa = 'africa',
  All = 'all',
  Asia = 'asia',
  Australia = 'australia',
  Europe = 'europe',
  NorthAmerica = 'north_america',
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
  /** Report status: 'pending', 'resolved', or 'dismissed' */
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

export type SocialLink = {
  __typename?: 'SocialLink';
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  position: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export enum SortType {
  Best = 'best',
  Hot = 'hot',
  New = 'new',
  Rising = 'rising',
  Top = 'top'
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Subscribe to new comments on a post in real-time */
  commentAdded: Comment;
  /** Subscribe to comment vote changes in real-time */
  commentVoted: Comment;
  /** Receive new notifications in real-time (auth required) */
  notificationReceived: Notification;
  /** Subscribe to new posts in real-time */
  postAdded: Post;
  /** Subscribe to post updates in real-time */
  postUpdated: Post;
  /** Subscribe to post vote changes in real-time */
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

export type UpdateCommunityInput = {
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateSocialLinkInput = {
  label?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  bannerUrl?: InputMaybe<Scalars['String']['input']>;
  bio?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bannerUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  comments: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  posts: Array<Post>;
  socialLinks: Array<SocialLink>;
  username: Scalars['String']['output'];
};


export type UserCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type UserPostsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum VoteType {
  Downvote = 'downvote',
  Upvote = 'upvote'
}

export type AutoGeneratedQueriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedQueriesQuery = { __typename?: 'Query', users: Array<User>, searchUsers: Array<User>, user?: User | null, userByUsername?: User | null, me?: User | null, communities: Array<Community>, community?: Community | null, communityByName?: Community | null, popularCommunities: Array<Community>, searchCommunities: Array<Community>, posts: Array<Post>, post?: Post | null, feed: Array<Post>, topStories: Array<Post>, postsByCommunity: Array<Post>, searchPosts: Array<Post>, savedPosts: Array<Post>, userPosts: Array<Post>, userComments: Array<Comment>, comments: Array<Comment>, comment?: Comment | null, flairsByCommunity: Array<Flair>, reports: Array<Report>, report?: Report | null, notifications: Array<Notification>, unreadNotificationsCount: number };

export type AutoGeneratedMutationsMutationVariables = Exact<{ [key: string]: never; }>;


export type AutoGeneratedMutationsMutation = { __typename?: 'Mutation', updateUser: User, deleteUser: boolean, addSocialLink: SocialLink, updateSocialLink: SocialLink, removeSocialLink: boolean, joinCommunity: Community, leaveCommunity: boolean, createCommunity: Community, updateCommunity: Community, deleteCommunity: boolean, addModerator: Community, removeModerator: boolean, createPost: Post, updatePost: Post, deletePost: boolean, savePost: boolean, unsavePost: boolean, createComment: Comment, updateComment: Comment, deleteComment: boolean, votePost: Post, voteComment: Comment, createFlair: Flair, updateFlair: Flair, deleteFlair: boolean, createReport: Report, resolveReport: Report, markNotificationAsRead: Notification, markAllNotificationsAsRead: boolean, clearNotification: boolean, clearAllNotifications: boolean };


export const AutoGeneratedQueriesDocument = gql`
    query AutoGeneratedQueries {
  users
  searchUsers
  user
  userByUsername
  me
  communities
  community
  communityByName
  popularCommunities
  searchCommunities
  posts
  post
  feed
  topStories
  postsByCommunity
  searchPosts
  savedPosts
  userPosts
  userComments
  comments
  comment
  flairsByCommunity
  reports
  report
  notifications
  unreadNotificationsCount
}
    `;

export function useAutoGeneratedQueriesQuery(options?: Omit<Urql.UseQueryArgs<AutoGeneratedQueriesQueryVariables>, 'query'>) {
  return Urql.useQuery<AutoGeneratedQueriesQuery, AutoGeneratedQueriesQueryVariables>({ query: AutoGeneratedQueriesDocument, ...options });
};
export const AutoGeneratedMutationsDocument = gql`
    mutation AutoGeneratedMutations {
  updateUser
  deleteUser
  addSocialLink
  updateSocialLink
  removeSocialLink
  joinCommunity
  leaveCommunity
  createCommunity
  updateCommunity
  deleteCommunity
  addModerator
  removeModerator
  createPost
  updatePost
  deletePost
  savePost
  unsavePost
  createComment
  updateComment
  deleteComment
  votePost
  voteComment
  createFlair
  updateFlair
  deleteFlair
  createReport
  resolveReport
  markNotificationAsRead
  markAllNotificationsAsRead
  clearNotification
  clearAllNotifications
}
    `;

export function useAutoGeneratedMutationsMutation() {
  return Urql.useMutation<AutoGeneratedMutationsMutation, AutoGeneratedMutationsMutationVariables>(AutoGeneratedMutationsDocument);
};