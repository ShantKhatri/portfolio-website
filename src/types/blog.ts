export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
  createdAt?: import('firebase/firestore').Timestamp;
  updatedAt?: import('firebase/firestore').Timestamp;
}