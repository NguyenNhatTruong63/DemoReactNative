import api from "./axiosBase";
import { ROUTER } from './router'
import { ServicePort } from "./service";

export const uploadFile = async (formData: FormData) => {
    return api.post(ROUTER.UPLOAD.UPLOAD_FILE, formData, {
        headers: {
            portUpload: ServicePort.portUpload,
            "Content-Type": "multipart/form-data",
        },
    })
}