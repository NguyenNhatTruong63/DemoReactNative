import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import { KAIZEN_POST_TYPE } from "@/api/postNewsFeed/type";
// import { KAIZEN_POST_TYPE } from "@/app/(tabs)/index";

export const apiGetNewFeed = async (type: KAIZEN_POST_TYPE) => {
    return api.get(ROUTER.POST.NEWS_FEED, {
        params: { type, page: 1, limit: 50 },
        headers: {
            port: ServicePort.port
       
        },
    })
}