import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";

export const apiPostReactionsPost2 = async (postId: number, reaction_type: number) => {
    return api.post(ROUTER.POST.REACTIONS_POST,
        { post_id: postId, reaction_type: reaction_type},
        {
            headers: {
                port: ServicePort.port

            },
        }
    );
}