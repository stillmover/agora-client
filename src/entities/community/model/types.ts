export interface Community {
  id: string;
  name: string;
  iconUrl?: string;
  members: number; // Will be calculated from members array length
  isJoined: boolean;
  description?: string;
}
