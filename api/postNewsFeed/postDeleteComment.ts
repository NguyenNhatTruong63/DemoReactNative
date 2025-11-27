import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";


export const apiPostDeleteComment = async (commentId: string) => {

    return api.post(ROUTER.COMMENT.REMOVE_COMMENT,
        { comment_id: commentId },
        {
            headers: {
                port: ServicePort.port
            },
        });
};