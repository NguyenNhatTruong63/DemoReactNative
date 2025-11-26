import api from "./axiosBase";
import { ROUTER } from './router'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Headers_Service } from "./service";

export const uploadFile = async (formData: FormData) => {
    const token = await AsyncStorage.getItem('access_token');
    return api.post(ROUTER.UPLOAD.UPLOAD_FILE, formData, {
        headers: {
            ...Headers_Service.upload,
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    })
}