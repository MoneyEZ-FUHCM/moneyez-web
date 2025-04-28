export interface Post {
  id: string;
  title: string;
  content: string;
  shortContent: string;
  thumbnail: string;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  isDeleted: boolean;
}

export type PostList = Post[];
