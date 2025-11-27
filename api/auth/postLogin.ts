import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";
import { userLogin } from "./type";

export const apiPostLogin = (data: userLogin) =>
    api.post(ROUTER.AUTH.LOGIN, data, {
        headers: {
            port: ServicePort.port,
            'Content-Type': 'application/json',
        },
    });
