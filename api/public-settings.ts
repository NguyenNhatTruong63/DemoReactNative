import api from "./axiosBase";
import { ROUTER } from './router'
import { ServicePort } from "./service";

export const getPublicSettings = () =>
    api.get(ROUTER.AUTH.SETTINGS, {
        headers: { 
           port: ServicePort.port
        }
    });