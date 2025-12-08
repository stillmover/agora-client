import { gql } from "urql";

// Fragments
export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    title
    content
    score
    commentCount
    createdAt
    updatedAt
    type
    isSaved
    userVote
    author {
      id
      username
      name
    }
    community {
      id
      name
      displayName
      iconUrl
    }
    flairs {
      id
      label
      color
      backgroundColor
    }
    media {
      id
      type
      url
      thumbnailUrl
      thumb
      width
      height
    }
  }
`;

export const CommunityFragment = gql`
  fragment CommunityFragment on Community {
    id
    name
    displayName
    description
    iconUrl
    bannerUrl
    memberCount
    isJoined
    createdAt
    updatedAt
  }
`;

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    content
    score
    createdAt
    updatedAt
    parentId
    userVote
    author {
      id
      username
      name
    }
    post {
      id
      title
    }
    replies {
      id
      content
      score
      createdAt
      author {
        id
        username
        name
      }
    }
  }
`;

// Queries
export const PostsDocument = gql`
  query Posts(
    $communityId: ID
    $sort: SortType
    $region: Region
    $limit: Int
    $offset: Int
  ) {
    posts(
      communityId: $communityId
      sort: $sort
      region: $region
      limit: $limit
      offset: $offset
    ) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const PostDocument = gql`
  query Post($id: ID!) {
    post(id: $id) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const FeedDocument = gql`
  query Feed($sort: SortType, $limit: Int, $offset: Int) {
    feed(sort: $sort, limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const TopStoriesDocument = gql`
  query TopStories($limit: Int) {
    topStories(limit: $limit) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const PostsByCommunityDocument = gql`
  query PostsByCommunity($communityId: ID!, $limit: Int, $offset: Int) {
    postsByCommunity(communityId: $communityId, limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const CommunitiesDocument = gql`
  query Communities($limit: Int, $offset: Int) {
    communities(limit: $limit, offset: $offset) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const CommunityDocument = gql`
  query Community($id: ID) {
    community(id: $id) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const CommunityByNameDocument = gql`
  query CommunityByName($name: String!) {
    communityByName(name: $name) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const PopularCommunitiesDocument = gql`
  query PopularCommunities($limit: Int) {
    popularCommunities(limit: $limit) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const CommentsDocument = gql`
  query Comments($postId: ID!, $limit: Int, $offset: Int) {
    comments(postId: $postId, limit: $limit, offset: $offset) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const CommentDocument = gql`
  query Comment($id: ID!) {
    comment(id: $id) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

// Mutations
export const CreatePostDocument = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const VotePostDocument = gql`
  mutation VotePost($postId: ID!, $voteType: VoteType!) {
    votePost(postId: $postId, voteType: $voteType) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const SavePostDocument = gql`
  mutation SavePost($postId: ID!) {
    savePost(postId: $postId)
  }
`;

export const UnsavePostDocument = gql`
  mutation UnsavePost($postId: ID!) {
    unsavePost(postId: $postId)
  }
`;

export const CreateCommentDocument = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const VoteCommentDocument = gql`
  mutation VoteComment($commentId: ID!, $voteType: VoteType!) {
    voteComment(commentId: $commentId, voteType: $voteType) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const UpdateCommentDocument = gql`
  mutation UpdateComment($commentId: ID!, $content: String!) {
    updateComment(commentId: $commentId, content: $content) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DeleteCommentDocument = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

export const JoinCommunityDocument = gql`
  mutation JoinCommunity($communityId: ID!) {
    joinCommunity(communityId: $communityId) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const LeaveCommunityDocument = gql`
  mutation LeaveCommunity($communityId: ID!) {
    leaveCommunity(communityId: $communityId)
  }
`;

// User Fragment
export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
    name
    bio
    avatarUrl
    createdAt
  }
`;

// User queries
export const UserDocument = gql`
  query User($id: ID!) {
    user(id: $id) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const UserByUsernameDocument = gql`
  query UserByUsername($username: String!) {
    user(username: $username) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

export const UserPostsDocument = gql`
  query UserPosts($userId: ID!, $limit: Int, $offset: Int) {
    userPosts(userId: $userId, limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const UserCommentsDocument = gql`
  query UserComments($userId: ID!, $limit: Int, $offset: Int) {
    userComments(userId: $userId, limit: $limit, offset: $offset) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

// Saved posts
export const SavedPostsDocument = gql`
  query SavedPosts($limit: Int, $offset: Int) {
    savedPosts(limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

// Search queries
export const SearchPostsDocument = gql`
  query SearchPosts($query: String!, $limit: Int, $offset: Int) {
    searchPosts(query: $query, limit: $limit, offset: $offset) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const SearchCommunitiesDocument = gql`
  query SearchCommunities($query: String!, $limit: Int, $offset: Int) {
    searchCommunities(query: $query, limit: $limit, offset: $offset) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const SearchUsersDocument = gql`
  query SearchUsers($query: String!, $limit: Int, $offset: Int) {
    searchUsers(query: $query, limit: $limit, offset: $offset) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

// Flairs query
export const FlairsByCommunityDocument = gql`
  query FlairsByCommunity($communityId: ID!) {
    flairsByCommunity(communityId: $communityId) {
      id
      label
      color
      backgroundColor
    }
  }
`;

// Additional mutations
export const UpdatePostDocument = gql`
  mutation UpdatePost($postId: ID!, $title: String, $content: String, $flairIds: [ID!]) {
    updatePost(postId: $postId, title: $title, content: $content, flairIds: $flairIds) {
      ...PostFragment
    }
  }
  ${PostFragment}
`;

export const DeletePostDocument = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export const CreateCommunityDocument = gql`
  mutation CreateCommunity($input: CreateCommunityInput!) {
    createCommunity(input: $input) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const UpdateCommunityDocument = gql`
  mutation UpdateCommunity($communityId: ID!, $description: String, $iconUrl: String, $bannerUrl: String) {
    updateCommunity(communityId: $communityId, description: $description, iconUrl: $iconUrl, bannerUrl: $bannerUrl) {
      ...CommunityFragment
    }
  }
  ${CommunityFragment}
`;

export const UpdateUserDocument = gql`
  mutation UpdateUser($userId: ID!, $name: String, $bio: String, $avatarUrl: String) {
    updateUser(userId: $userId, name: $name, bio: $bio, avatarUrl: $avatarUrl) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;

