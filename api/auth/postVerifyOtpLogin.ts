import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";
import { verifyOtpPassword } from "./type";

export const apiPostVerifyOtpLogin = (data: verifyOtpPassword) =>
    api.post(ROUTER.AUTH.VERIFY_OTP_LOGIN, data, {
        headers:
        {
            port: ServicePort.port
        }
    });
