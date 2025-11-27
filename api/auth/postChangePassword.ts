import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";
import base64 from 'react-native-base64';

export const apiPostChangePassword = async (userId: string, oldPassword: string, newPassword: string) => {

    return api.post(
        ROUTER.AUTH.CHANGE_PASSWORD(userId),
        {
            id: userId,
            old_password: base64.encode(oldPassword),
            new_password: base64.encode(newPassword),
        },
        {
            headers: {
                port: ServicePort.port,
            },
        }
    );
};