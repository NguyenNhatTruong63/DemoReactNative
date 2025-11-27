import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";

export const apiPostEditPost = async (id: number, data: any) => {
    return api.post(ROUTER.POST.EDIT_POST(id), data, {
        headers: {
            port: ServicePort.port
        },
    })
}