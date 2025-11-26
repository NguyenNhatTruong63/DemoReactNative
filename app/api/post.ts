import api from "./axiosBase";
import { ROUTER } from './router'

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Headers_Service } from "./service";
import { KAIZEN_POST_TYPE } from "@/app/(tabs)/index";

export const newFees = async (type: KAIZEN_POST_TYPE) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.POST.NEWS_FEED, {
        params: { type, page: 1, limit: 50 },
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}

export const detailPost = async (id: number) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.POST.DETAIL_POST(id), {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const detelePost = async (postId: number) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.POST.DETAIL_POST(postId), {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const removePost = async (postId: number, data: any) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.POST.REMOVE_POST(postId), data, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const createPost = async (data: any) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.POST.CREATE_POST, data, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const editPost = async (id: number, data: any) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.POST.EDIT_POST(id), data, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const reactionsPost = async (postId: number) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.POST.REACTIONS_POST, {
        params: { post_id: postId },
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const reactionsPost2 = async (postId: number, reaction_type: number) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.POST.REACTIONS_POST,
        { post_id: postId, reaction_type: reaction_type},
        {
            headers: {
                "x-svc-id": 1153,
                Authorization: `Bearer ${token}`,
            },
        }
    );
}