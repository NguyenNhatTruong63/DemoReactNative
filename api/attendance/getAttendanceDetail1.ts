import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";

export const apiGetAttendanceDetail1 = async (dateToSend: string, userId: string) => {
    return api.get(ROUTER.ATTENDANCE.ATTENDANCE_DETAIL, {
        params: { date: dateToSend, user_id: userId },
        headers: {
            port: ServicePort.port
    
        },
    })
}