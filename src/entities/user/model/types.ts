interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  createdAt?: Date | string;
}

interface UserFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export type { User, UserFilters };
