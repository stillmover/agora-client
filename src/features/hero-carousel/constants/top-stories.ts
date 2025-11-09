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
      "https://via.placeholder.com/400x225/61DAFB/FFFFFF?text=React+19",
    score: 1250,
  },
  {
    id: "2",
    title: "TypeScript 5.4 brings better performance and new features",
    community: { id: "typescript", name: "typescript" },
    thumbnail: "https://via.placeholder.com/400x225/3178C6/FFFFFF?text=TS+5.4",
    score: 890,
  },
  {
    id: "3",
    title: "Building scalable applications with Feature-Sliced Design",
    community: { id: "webdev", name: "webdev" },
    thumbnail: "https://via.placeholder.com/400x225/00D4FF/FFFFFF?text=FSD",
    score: 675,
  },
  {
    id: "4",
    title: "The future of web development: What's coming next",
    community: { id: "programming", name: "programming" },
    thumbnail: "https://via.placeholder.com/400x225/FF6B35/FFFFFF?text=Future",
    score: 543,
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to use each",
    community: { id: "css", name: "css" },
    thumbnail: "https://via.placeholder.com/400x225/1572B6/FFFFFF?text=CSS",
    score: 432,
  },
  {
    id: "6",
    title: "Node.js 20 LTS: New features and migration guide",
    community: { id: "nodejs", name: "nodejs" },
    thumbnail: "https://via.placeholder.com/400x225/339933/FFFFFF?text=Node+20",
    score: 321,
  },
];
