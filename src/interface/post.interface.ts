export type getAllPostAdditonalType = {
    post: PostType[];
    totalpost: number;
};

export type PostType = {
    id: string;
    title: string;
    content: string;
    image?: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      image?: string;
    };
    totalLikes: number;
    totalComments: number;
  };
  