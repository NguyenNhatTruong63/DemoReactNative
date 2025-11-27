import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";

export const apiPostTwoFA = async (data: any) => {
    return api.post(ROUTER.AUTH.TWO_FA, data, {
        headers:
        {
            port: ServicePort.port
        },
    })
}