import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import {UpdateCommentPayload} from '@/api/postNewsFeed/type'

export const apiPostEditComment = async (payload: UpdateCommentPayload) => {

    return api.post(ROUTER.COMMENT.UPDATE_COMMENT, payload, {
        headers: {
            port: ServicePort.port
       
        },
    });
};