import api from "./axiosBase";
import { ROUTER } from './router'
import base64 from 'react-native-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Headers_Service } from "./service";

 export interface Check {
    latitude: String,
    longitude: String,
    ip: string,
    device_id: string,
    avatar: string,
    address: string,

}

export const attendanceDetail1 = async (dateToSend: string, userId: string) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.ATTENDANCE.ATTENDANCE_DETAIL, {
        params: { date: dateToSend, user_id: userId },
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const attendanceDetail2 = async (month: string, userId: string) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.ATTENDANCE.ATTENDANCE_RECORDS, {
        params: { month, user_id: userId },
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}

export const attendance_Check_In = async (data: Check) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.ATTENDANCE.ATTENDANCE_CHECK_IN, data, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const attendance_Check_Out = async (data: Check) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.ATTENDANCE.ATTENDANCE_CHECK_OUT, data, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
