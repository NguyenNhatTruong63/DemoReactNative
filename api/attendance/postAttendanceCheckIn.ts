import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {ServicePort } from "../service";
import { CheckIn } from "./type";

export const apiPostAttendanceCheckIn = async (data: CheckIn) => {
    return api.post(ROUTER.ATTENDANCE.ATTENDANCE_CHECK_IN, data, {
        headers: {
            port: ServicePort.port
        },
    })
}