import api from "@/api/axiosBase";
import {ROUTER} from '@/api/router'
import {  ServicePort } from "../service";
import { CheckOut } from "./type";

export const apiPostAttendanceCheckOut = async (data: CheckOut) => {
    return api.post(ROUTER.ATTENDANCE.ATTENDANCE_CHECK_OUT, data, {
        headers: {
            port: ServicePort.port
        },
    })
}
