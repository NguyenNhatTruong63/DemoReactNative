// components/UserAvatar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Toast from "react-native-toast-message";


type User = {
  id: string;
  name: string;
  departments: string;
  avatar: string;
};

type UserAvatarProps = {
  user: User;
  size?: number;
  onPress?: () => void;
};

export default function UserAvatar({ user, size = 40, onPress }: UserAvatarProps) {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [resourceUrl, setResourceUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const loadResourceUrl = async () => {
    try {
      const storedResource = await AsyncStorage.getItem('resource_url');
      if (storedResource) {
        setResourceUrl(storedResource);
        return storedResource;
      }
      const res = await axios.get(
        'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
        { headers: { 'x-svc-id': 1153 } }
      );
      const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
      if (url) {
        await AsyncStorage.setItem('resource_url', url);
        setResourceUrl(url);
        return url;
      }
      return '';
    } catch (err) {
      console.log('Lỗi lấy resource URL:', err);
      return '';
    }
  };

  const loadAvatar = useCallback(async () => {
    setLoading(true);
    try {
      await loadResourceUrl();
      const storedUser = await AsyncStorage.getItem('user_info');
      if (storedUser) {
        const userData: User = JSON.parse(storedUser);
        if (userData.avatar) setAvatarUri(`${resourceUrl}/${userData.avatar}`);
      }
    } catch (err) {
      console.log('Lỗi load avatar:', err);
    } finally {
      setLoading(false);
    }
  }, [resourceUrl]);

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      await uploadAvatar(uri);
    }
  };

  const uploadAvatar = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
      formData.append("types", "1");

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
        formData,
        { headers: { "Content-Type": "multipart/form-data", "x-svc-id": 1167 } }
      );

      const path = res.data?.data?.[0];
      if (!path) throw new Error("Upload thất bại");

      const token = await AsyncStorage.getItem("access_token");
      await axios.post(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${user.id}/update`,
        { ...user, avatar: path },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      await AsyncStorage.setItem("user_info", JSON.stringify({ ...user, avatar: path }));
      const resource = await AsyncStorage.getItem("resource_url");
      setAvatarUri(`${resource}/${path}`);
      Toast.show({ type: "success", text1: "Cập nhật avatar thành công" });
    } catch (err: any) {
      console.log("Lỗi upload avatar:", err.response?.data || err.message);
      Toast.show({ type: "error", text1: "Upload thất bại" });
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <TouchableOpacity
      onPress={onPress ?? pickImage}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Image
        source={{ uri: avatarUri ?? "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    </TouchableOpacity>
  );
}
