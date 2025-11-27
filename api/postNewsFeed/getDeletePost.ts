import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetDetelePost = async (postId: number) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.POST.DETAIL_POST(postId), {
        headers: {
            port: ServicePort.port
        },
    })
}