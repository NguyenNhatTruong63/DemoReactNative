import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";

export const apiGetReactionsPost = async (postId: number) => {
    return api.get(ROUTER.POST.REACTIONS_POST, {
        params: { post_id: postId },
        headers: {
            port: ServicePort.port

        },
    })
}