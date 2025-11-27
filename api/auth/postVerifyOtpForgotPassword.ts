import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";
import { verifyOtpForgotPassword } from "./type";

export const apiPostVerifyOtpForgotPassword = (data: verifyOtpForgotPassword) =>
    api.post(ROUTER.AUTH.VERIFY_OTP_Forgot_Password, data, {
        headers:
        {
            port: ServicePort.port
        },
    });
