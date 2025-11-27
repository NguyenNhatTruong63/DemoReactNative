import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetDetailPost = async (id: number) => {
    return api.get(ROUTER.POST.DETAIL_POST(id), {
        headers: {
            port: ServicePort.port
        },
    })
}