interface User {
  id: string;
  name: string;
}

interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  votes: number;
  createdAt: string;
  parentId?: string;
  replies: Comment[];
}

export type { Comment, User };
