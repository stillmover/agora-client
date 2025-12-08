export type TopStory = {
  id: string;
  title: string;
  community: {
    id: string;
    name: string;
  };
  thumbnail: string;
  score: number;
};
