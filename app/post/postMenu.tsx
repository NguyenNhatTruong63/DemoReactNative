import { useState } from "react";
import { TouchableOpacity, View, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { ToastHelper } from "@/components/toast/ToastShow";
import { apiGetDetailPost } from "@/api/postNewsFeed/getDetailPost";
import { apiGetDetelePost } from "@/api/postNewsFeed/getDeletePost";
import { apiPostRemovePost } from "@/api/postNewsFeed/postRemovePost";

type PostMenuProps = {
  postId: number;
  onPostDeleted?: () => void; // callback để reload danh sách sau khi xóa
};
type userCreated = {
  id: string;
  name: string;
  avatar: string;
};

export default function PostMenu({ postId, onPostDeleted }: PostMenuProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const fetchPostById = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");
      const res = await apiGetDetailPost(id)
      console.log("Dữ liệu chi tiết bài viết:", JSON.stringify(res.data, null, 2));

      if (res.data?.status === 200) {
        const post = res.data.data;
        console.log("Tiêu đề:", post.title);
        console.log("Hình ảnh:", post.medias);
        return post;
      }
      else throw new Error(res.data?.message || "Lỗi server");
    } catch (err: any) {
      console.error("Lỗi fetch post:", err.response?.data || err.message);
      ToastHelper.custom({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message,
      });
      return null;
    }
  };


  const handleEdit = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const currentUserId = await AsyncStorage.getItem("user_id");

      if (!token || !currentUserId) throw new Error("Chưa đăng nhập");

      const postData = await fetchPostById(postId);
      if (!postData) return;

      // Kiểm tra quyền: chỉ chủ bài viết mới được sửa
      if (postData.user_created.id !== currentUserId) {
        ToastHelper.error('Bạn chỉ có thể sửa bài viết của chính mình')
        // Toast.show({
        //   type: "error",
        //   text1: "Thông báo",
        //   text2: "Bạn chỉ có thể sửa bài viết của chính mình",
        // });
        setMenuVisible(false);
        return;
      }
      router.push({
        pathname: "/post/editPost",
        params: {
          id: postId.toString(),
          postData: JSON.stringify(postData),
        },
      });
    } catch (err: any) {
      console.error("Lỗi handleEdit:", err.message);
      ToastHelper.custom({
        type: "error",
        text1: "Lỗi",
        text2: err.message,
      });
    } finally {
      setMenuVisible(false);
    }
  };



  const handleRemove = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const currentUserId = await AsyncStorage.getItem("user_id");
      if (!token || !currentUserId) throw new Error("Chưa đăng nhập");

      // Lấy chi tiết bài viết
      const res = await apiGetDetelePost(postId)

      if (res.data?.status !== 200) throw new Error(res.data?.message || "Lỗi server");
      const post = res.data.data;

      if (currentUserId !== post.user_created.id) {
        ToastHelper.error('Bạn chỉ có thể xóa bài viết của chính mình')
        setMenuVisible(false);
        return;
      }

      // Xác nhận xóa
      Alert.alert(
        "Xác nhận",
        "Bạn có chắc muốn xóa bài viết này?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Xóa",
            style: "destructive",
            onPress: async () => {
              try {
                const deleteRes = await apiPostRemovePost(postId)

                if (deleteRes.data?.status === 200) {
                  ToastHelper.success('Bài viết đã được xóa')
                  onPostDeleted?.();
                } else {
                  throw new Error(deleteRes.data?.message || "Lỗi server");
                }
              } catch (err: any) {
                console.error("Lỗi xóa bài viết:", err.response?.data || err.message);
                ToastHelper.custom({
                  type: "error",
                  text1: "Lỗi",
                  text2: err.response?.data?.message || err.message,
                });
              }
            },
          },
        ]
      );
    } catch (err: any) {
      console.error("Lỗi fetch post hoặc quyền xóa:", err.response?.data || err.message);
      ToastHelper.custom({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message,
      });
    } finally {
      setMenuVisible(false);
    }
  };



  return (
    <View>
      {/* Nút 3 chấm */}
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Ionicons name="ellipsis-vertical" size={24} color="#555" />
      </TouchableOpacity>

      {/* Menu popup */}
      {menuVisible && (
        <View
          style={{
            width: 60,
            position: "absolute",
            top: 30,
            right: 0,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 6,
            padding: 8,
            zIndex: 999,
          }}
        >

          <TouchableOpacity onPress={handleEdit} style={{ paddingVertical: 6 }}>
            <Text>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRemove} style={{ paddingVertical: 6 }}>
            <Text style={{ color: "red" }}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
