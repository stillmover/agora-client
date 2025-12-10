export interface User {
  id: string;
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string | null;
  karma: number;
  createdAt: string;
}
