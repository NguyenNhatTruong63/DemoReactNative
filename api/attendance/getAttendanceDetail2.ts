import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import { ServicePort } from "../service";


export const apiGetAttendanceDetail2 = async (month: string, userId: string) => {
    return api.get(ROUTER.ATTENDANCE.ATTENDANCE_RECORDS, {
        params: { month, user_id: userId },
        headers: {
            port: ServicePort.port
        },
    })
}
