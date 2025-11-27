import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";



export const apiGetUserDetail = async (userId: string) => {
    return api.get(ROUTER.AUTH.USER_DETAIL(userId), {
        headers: {
            port: ServicePort.port
        },
    })
}