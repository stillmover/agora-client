interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  votes: number;
  createdAt: string;
  parentId?: string;
  replies: Comment[];
}

export type { Comment };
