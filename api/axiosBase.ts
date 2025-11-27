import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://beta.api.gateway.overate-vntech.com/",
});
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } if (config.headers.port) {
    config.headers['x-svc-id'] = config.headers.port
  } if(config.headers.portUpload){
    config.headers['x-svc-id'] = config.headers.portUpload
  }

  return config;
});
export default api;
