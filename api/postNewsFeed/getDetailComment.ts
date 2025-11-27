import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiGetDetailComment = async (postId: string) => {
    return api.get(ROUTER.COMMENT.DETAIL_COMMENT, {
        params: { post_id: postId },
        headers: {
            port: ServicePort.port
        },
    })
}