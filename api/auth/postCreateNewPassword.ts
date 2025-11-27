import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";


export const apiPostCreateNewPassword = (data: any) =>
    api.post(ROUTER.AUTH.CREATE_PASSWORD, data, {
        headers:
        {
            port: ServicePort.port
        },
    })