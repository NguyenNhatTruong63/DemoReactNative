import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";

export const apiPostRemovePost = async (postId: number) => {
    return api.post(ROUTER.POST.REMOVE_POST(postId), {
        headers: {
            port: ServicePort.port
  
        },
    })
}