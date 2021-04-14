import { ProfileModel } from '.';

export interface CommentsModel {
  comments: CommentModel[];
}

export interface CommentModel {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: ProfileModel;
}

export interface PostCommentModel {
  comment: {
    body: string;
  };
}
