import api from "./axiosBase";
import { ROUTER } from './router'
import base64 from 'react-native-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Headers_Service } from "./service";

interface CreateCommentPayload {
    post_id: string;
    content: string;
    user_tags?: any[];
    medias?: any[];
}
export interface UpdateCommentPayload {
    post_id: string;
    comment_id: string;
    content: string;
    user_tags?: [];
    medias?: [];
}

export const detailComment = async (postId: string) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.COMMENT.DETAIL_COMMENT, {
        params: { post_id: postId },
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}

export const createComment = async (payload: CreateCommentPayload) => {
    const token = await AsyncStorage.getItem("access_token");

    return api.post(ROUTER.COMMENT.CREATE_COMMENT, payload, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    });
};
export const editComment = async (payload: UpdateCommentPayload) => {
    const token = await AsyncStorage.getItem("access_token");

    return api.post(ROUTER.COMMENT.UPDATE_COMMENT, payload, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    });
};
export const deleteComment = async (commentId: string) => {
    const token = await AsyncStorage.getItem("access_token");

    return api.post(ROUTER.COMMENT.REMOVE_COMMENT,
        { comment_id: commentId },
        {
            headers: {
                ...Headers_Service.headersS,
                Authorization: `Bearer ${token}`,
            },
        });
};