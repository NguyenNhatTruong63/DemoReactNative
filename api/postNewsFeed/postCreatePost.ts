import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import { CreatePost } from "./type";

export const apiPostCreatePost = async (data: CreatePost) => {
    return api.post(ROUTER.POST.CREATE_POST, data, {
        headers: {
            port: ServicePort.port

        },
    })
}