import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";
import {CreateCommentPayload} from '@/api/postNewsFeed/type'


export const apiPostCreateComment = async (payload: CreateCommentPayload) => {

    return api.post(ROUTER.COMMENT.CREATE_COMMENT, payload, {
        headers: {
            port: ServicePort.port
        },
    });
};