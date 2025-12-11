export interface Community {
  id: string;
  name: string;
  iconUrl?: string;
  bannerUrl?: string;
  members: number;
  isJoined: boolean;
  description?: string;
  createdAt?: string;
}
