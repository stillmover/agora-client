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

export const MOCK_TOP_STORIES: TopStory[] = [
  {
    id: "1",
    title: "React 19 is here: New features and improvements",
    community: { id: "react", name: "react" },
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop&crop=center",
    score: 1250,
  },
  {
    id: "2",
    title: "TypeScript 5.4 brings better performance and new features",
    community: { id: "typescript", name: "typescript" },
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop&crop=center",
    score: 890,
  },
  {
    id: "3",
    title: "Building scalable applications with Feature-Sliced Design",
    community: { id: "webdev", name: "webdev" },
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop&crop=center",
    score: 675,
  },
  {
    id: "4",
    title: "The future of web development: What's coming next",
    community: { id: "programming", name: "programming" },
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop&crop=center",
    score: 543,
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to use each",
    community: { id: "css", name: "css" },
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop&crop=center",
    score: 432,
  },
  {
    id: "6",
    title: "Node.js 20 LTS: New features and migration guide",
    community: { id: "nodejs", name: "nodejs" },
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop&crop=center",
    score: 321,
  },
];
