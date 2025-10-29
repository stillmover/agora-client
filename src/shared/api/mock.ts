import type { Post } from "@/entities/post";
import type { Community } from "@/entities/community";
import type { Comment } from "@/entities/comment";
import { API_DELAYS, TIME_CONSTANTS } from "@/shared/constants";

export async function fetchPosts(communityId?: string): Promise<Post[]> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.POSTS));

  const allPosts: Post[] = [
    {
      id: "1",
      title: "Welcome to Reddit Client",
      author: "admin",
      communityId: "general",
      content:
        "This is a Reddit-inspired web application built with React, TanStack Router, and ShadCN/UI. Feel free to explore!",
      votes: 42,
      createdAt: new Date(Date.now() - 2 * TIME_CONSTANTS.HOUR).toISOString(),
      commentCount: 5,
    },
    {
      id: "2",
      title: "Building with TanStack Router",
      author: "jane",
      communityId: "react",
      content:
        "TanStack Router provides excellent type-safe routing for React applications. The file-based routing approach makes it easy to organize routes.",
      votes: 28,
      createdAt: new Date(Date.now() - 5 * TIME_CONSTANTS.HOUR).toISOString(),
      commentCount: 12,
    },
    {
      id: "3",
      title: "Feature-Sliced Design Architecture",
      author: "devmaster",
      communityId: "react",
      content:
        "FSD helps organize large-scale applications by domain features rather than technical roles. This makes the codebase more maintainable and scalable.",
      votes: 35,
      createdAt: new Date(Date.now() - 10 * TIME_CONSTANTS.HOUR).toISOString(),
      commentCount: 8,
    },
    {
      id: "4",
      title: "ShadCN/UI Components",
      author: "designer",
      communityId: "webdev",
      content:
        "ShadCN/UI provides beautiful, accessible components built on Radix UI and Tailwind CSS. You can copy and customize them to fit your needs.",
      votes: 19,
      createdAt: new Date(Date.now() - TIME_CONSTANTS.DAY).toISOString(),
      commentCount: 3,
    },
    {
      id: "5",
      title: "TypeScript Best Practices",
      author: "typescriptfan",
      communityId: "typescript",
      content:
        "TypeScript strict mode helps catch errors early and improves code quality. Always enable it for new projects!",
      votes: 47,
      createdAt: new Date(Date.now() - 3 * TIME_CONSTANTS.DAY).toISOString(),
      commentCount: 15,
    },
  ];

  if (communityId) {
    return allPosts.filter((post) => post.communityId === communityId);
  }

  return allPosts;
}

export async function fetchPost(postId: string): Promise<Post | null> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.POST));

  const posts = await fetchPosts();
  return posts.find((p) => p.id === postId) || null;
}

export async function fetchCommunities(): Promise<Community[]> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.COMMUNITIES));

  return [
    {
      id: "react",
      name: "react",
      description: "A community for React developers",
    },
    {
      id: "javascript",
      name: "javascript",
      description: "JavaScript discussions and news",
    },
    { id: "webdev", name: "webdev", description: "Web development resources" },
    {
      id: "typescript",
      name: "typescript",
      description: "TypeScript programming language",
    },
    { id: "general", name: "general", description: "General discussions" },
  ];
}

export async function fetchCommunity(
  communityId: string,
): Promise<Community | null> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.COMMUNITY));

  const communities = await fetchCommunities();
  return communities.find((c) => c.id === communityId) || null;
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.COMMENTS));

  const comments: Comment[] = [
    {
      id: "1",
      postId: "1",
      author: "user1",
      content: "Great post! Looking forward to seeing more features.",
      votes: 12,
      createdAt: new Date(Date.now() - TIME_CONSTANTS.HOUR).toISOString(),
      replies: [
        {
          id: "1-1",
          postId: "1",
          author: "admin",
          content: "Thanks! More features coming soon.",
          votes: 5,
          createdAt: new Date(
            Date.now() - 30 * TIME_CONSTANTS.MINUTE,
          ).toISOString(),
          parentId: "1",
          replies: [],
        },
      ],
    },
    {
      id: "2",
      postId: "1",
      author: "user2",
      content: "This looks amazing! Can you add dark mode?",
      votes: 8,
      createdAt: new Date(Date.now() - 2 * TIME_CONSTANTS.HOUR).toISOString(),
      replies: [],
    },
    {
      id: "3",
      postId: "2",
      author: "developer",
      content: "TanStack Router is fantastic! The type safety is incredible.",
      votes: 15,
      createdAt: new Date(Date.now() - 4 * TIME_CONSTANTS.HOUR).toISOString(),
      replies: [],
    },
  ];

  return comments.filter((c) => c.postId === postId);
}

export async function createPost(
  post: Omit<Post, "id" | "votes" | "createdAt" | "commentCount">,
): Promise<Post> {
  await new Promise((resolve) => setTimeout(resolve, API_DELAYS.CREATE_POST));

  return {
    ...post,
    id: crypto.randomUUID(),
    votes: 0,
    createdAt: new Date().toISOString(),
    commentCount: 0,
  };
}

export async function createComment(
  comment: Omit<Comment, "id" | "votes" | "createdAt" | "replies">,
): Promise<Comment> {
  await new Promise((resolve) =>
    setTimeout(resolve, API_DELAYS.CREATE_COMMENT),
  );

  return {
    ...comment,
    id: crypto.randomUUID(),
    votes: 0,
    createdAt: new Date().toISOString(),
    replies: [],
  };
}
