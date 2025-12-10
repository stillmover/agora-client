export interface TopStory {
  id: string;
  title: string;
  community: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  thumbnail: string;
  score: number;
  commentCount: number;
}
