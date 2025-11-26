import api from "./axiosBase";
import { ROUTER } from './router'
import base64 from 'react-native-base64';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Headers_Service } from "./service";


export interface bodyUpdate {
    name:string,
    username: string,
    birthday: string,
    joining_date: string,
    gender: Number,
    avatar: string,
    phone:string,
    address: string,
    id_card_number: string  ,
    email: string,
    // department_name: departmentName,
    department_id: Number,
    manager_id: Number,
    privilege_group_id: Number,
    salary_level_id: Number,
    // salary_level_id: Number(),
}

export const login = (data: any) =>
    api.post(ROUTER.AUTH.LOGIN, data, {
        headers: {
            ...Headers_Service.headersS,
            'Content-Type': 'application/json',
        },

    });

export const verifyOtpLogin = (data: any) =>
    api.post(ROUTER.AUTH.VERIFY_OTP_LOGIN, data, {
        headers:
        {
            ...Headers_Service.headersS
        }
    });

export const verifyOtpForgotPassword = (data: any) =>
    api.post(ROUTER.AUTH.VERIFY_OTP_Forgot_Password, data, {
        headers:
        {
            ...Headers_Service.headersS
        },
    });

export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
    const token = await AsyncStorage.getItem('access_token');

    return api.post(
        ROUTER.AUTH.CHANGE_PASSWORD(userId),
        {
            id: userId,
            old_password: base64.encode(oldPassword),
            new_password: base64.encode(newPassword),
        },
        {
            headers: {
                ...Headers_Service.headersS,
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
export const getPublicSettings = () =>
    api.get(ROUTER.AUTH.SETTINGS, {
        headers: {
            ...Headers_Service.headersS,
        }
    });

export const userDetail = async (userId: string) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.get(ROUTER.AUTH.USER_DETAIL(userId), {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const userUpdate = async (userId: string, body: bodyUpdate) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.AUTH.USER_UPDATE(userId), body, {
        headers: {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`,
        },
    })
}
export const createPassword = (data: any) =>
    api.post(ROUTER.AUTH.CREATE_PASSWORD, data, {
        headers:
        {
            ...Headers_Service.headersS,
        },
    })
export const twoFA = async (data: any) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.AUTH.TWO_FA, data, {
        headers:
        {
            ...Headers_Service.headersS,
            Authorization: `Bearer ${token}`
        },
    })
}




