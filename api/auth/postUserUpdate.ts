import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import { bodyUpdate } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiPostUserUpdate = async (userId: string, body: bodyUpdate) => {
    return api.post(ROUTER.AUTH.USER_UPDATE(userId), body, {
        headers: {
            port: ServicePort.port,
        },
    })
}