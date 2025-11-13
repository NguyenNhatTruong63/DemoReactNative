import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

interface UpdatePostParams {
  postId: number | string;
  content: string;
  medias?: any[]; 
  tags?: string[]; 
}

export const updatePost = async ({ postId, content, medias = [], tags = [] }: UpdatePostParams) => {
  if (!postId || !content.trim()) return;

  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Chưa đăng nhập");

    const res = await axios.put(
      `https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/${postId}/update-post`,
      {
        content,
        medias,
        tags,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-svc-id": 1153,
        },
      }
    );

    if (res.data?.status === 200) {
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
        text2: "Bài viết đã được cập nhật",
        visibilityTime: 2000,
      });
      return res.data?.data;
    } else {
      throw new Error(res.data?.message || "Lỗi server");
    }
  } catch (err: any) {
    console.error("Lỗi cập nhật bài viết:", err.response?.data || err.message);
    Toast.show({
      type: "error",
      text1: "Lỗi",
      text2: err.response?.data?.message || err.message || "Không thể cập nhật bài viết",
      visibilityTime: 2000,
    });
    return null;
  }
};
