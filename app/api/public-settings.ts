import api from "./axiosBase";
import { ROUTER } from './router'
import { Headers_Service } from "./service";

export const getPublicSettings = () =>
    api.get(ROUTER.AUTH.SETTINGS, {
        headers: { 
           ...Headers_Service.headersS
        }
    });