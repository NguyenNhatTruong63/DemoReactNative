import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { uploadFile } from "../api/uploadFile";
import { ToastHelper } from "@/components/toast/ToastShow";

type AvatarPickerProps = {
  avatar?: string;
  size?: number;
  onUploadSuccess?: (newAvatarPath: string) => void;
};

export default function AvatarPicker({ avatar, size = 120, onUploadSuccess }: AvatarPickerProps) {
  const [avatarUri, setAvatarUri] = useState<string>("https://cdn-icons-png.flaticon.com/512/847/847969.png");

  useEffect(() => {
    loadAvatarFromProps();
  }, [avatar]);

  const loadAvatarFromProps = async () => {
    if (!avatar) return;

    const resource = (await AsyncStorage.getItem("resource_url")) || "";
    const fullUrl = avatar.startsWith("http")
      ? avatar
      : `${resource}/${avatar}`;

    console.log("Avatar from props:", fullUrl);

    setAvatarUri(fullUrl);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri); // hiển thị tạm ảnh local
      await handleUpload(uri);
    }
  };


  const handleUpload = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
      formData.append("types", 1 as any);
      const res = await uploadFile(formData)

      const fileObj = res.data?.data?.[0];

      if (!fileObj || !fileObj.path) {
        Toast.show({ type: "error", text1: "Upload thất bại" });
        return;
      }

      const path = fileObj.path;

      const resource = (await AsyncStorage.getItem("resource_url")) || "";
      const fullUrl = `${resource}/${path}`;

      console.log("Uploaded path:", path);
      console.log("Full Avatar URL:", fullUrl);

      setAvatarUri(fullUrl);

      if (onUploadSuccess) onUploadSuccess(path);
      ToastHelper.success('Cập nhật ảnh thành công');

      // Toast.show({ type: "success", text1: "Upload thành công" });
    } catch (err: any) {
      console.log("Lỗi upload avatar:", err.response?.data || err.message || err);
      // Toast.show({ type: "error", text1: "Upload thất bại" });
      ToastHelper.error('Cập nhật ảnh không thành công')
    }
  };


  return (
    <View>
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center", marginBottom: 20 }}>
        <Image
          source={{ uri: avatarUri }}
          style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#ccc" }}
        />
        <Ionicons name="camera" size={25} color="#007AFF" style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 }} />
      </TouchableOpacity>
    </View>

  );
}
