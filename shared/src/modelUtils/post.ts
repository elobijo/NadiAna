import {Post, PostData} from '../types/Post';

export const getPost = (post: PostData): Post => {
  return {
    ...post,
    createdAt: post.createdAt.toDate().toISOString(),
    updatedAt: post.updatedAt.toDate().toISOString(),
  };
};
