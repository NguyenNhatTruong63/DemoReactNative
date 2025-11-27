export interface CreateCommentPayload {
    post_id: string;
    content: string;
    user_tags?: [];
    medias?: [];
}
export interface UpdateCommentPayload {
    post_id: string;
    comment_id: string;
    content: string;
    user_tags?: [];
    medias?: [];
}
export interface CreatePost {
    title: string,
    content: string,
    medias: [],
    type: 1,
    user_tags: [],
} 
export enum KAIZEN_POST_TYPE {
  ALL = -1,
  NORMAL = 1,
  KAIZEN = 2,
}
