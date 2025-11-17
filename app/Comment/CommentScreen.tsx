
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

dayjs.extend(relativeTime);

type CommentType = {
  id: number | string;
  content: string;
  user_comment?: {
    id: number;
    name: string;
    avatar?: string;
  };
  created_at?: string;
};

export default function CommentScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();

  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComment, setSelectedComment] = useState<CommentType | null>(null);
  const [actionMenuVisible, setActionMenuVisible] = useState(false);

  const [resourceUrl, setResourceUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
   const navigation = useNavigation()

     useLayoutEffect(() => {
       navigation.setOptions({
         title: "Danh sách bình luận", 
       });
     }, [navigation]);

  // Lấy thông tin user hiện tại
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("user_info");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUserId(userData.id.toString());
        }
      };
      loadUser();
    }, [])
  );

  const loadResourceUrl = async () => {
    try {
      const stored = await AsyncStorage.getItem("resource_url");
      if (stored) {
        setResourceUrl(stored);
        return;
      }

      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
        { headers: { "x-svc-id": 1153 } }
      );

      const url = res.data?.data?.CONFIG_RESOURCE_URL ?? "";
      if (url) {
        setResourceUrl(url);
        await AsyncStorage.setItem("resource_url", url);
      }
    } catch (e) { console.log("Lỗi load resourceUrl", e); }
  };

  // Lấy bình luận
  const fetchComments = async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/comments",
        {
          params: { post_id: postId },
          headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
        }
      );

      if (res.data?.status === 200) {
        setComments(res.data.data?.list || []);
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải bình luận" });
    } finally {
      setLoading(false);
    }
  };

  // Tạo bình luận mới
  const postComment = async (content: string) => {
    if (!content.trim()) return;

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/create-comment",
        { post_id: postId, content, user_tags: [], medias: [] },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      if (res.data?.status === 200) {
        setCommentText("");
        fetchComments();
        Toast.show({ type: "success", text1: "Đã gửi bình luận" });
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể gửi bình luận" });
    }
  };

  // Cập nhật bình luận
  const updateComment = async (commentId: number | string, content: string) => {
    if (!content.trim()) return;

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const comment = comments.find(c => c.id.toString() === commentId.toString());
      if (!comment) return;

      if (comment.user_comment?.id.toString() !== currentUserId) {
        Toast.show({ type: "error", text1: "Thông báo", text2: "Bạn không thể sửa bình luận này" });
        return;
      }

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/update-comment",
        { post_id: postId, comment_id: commentId, content, user_tags: [], medias: [] },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      if (res.data?.status === 200) {
        setEditingComment(null);
        setCommentText("");
        fetchComments();
        Toast.show({ type: "success", text1: "Đã cập nhật bình luận" });
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể cập nhật bình luận" });
    }
  };

  // Xóa bình luận
  const removeComment = async (commentId: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const comment = comments.find(c => c.id.toString() === commentId);
      if (!comment) return;

      if (comment.user_comment?.id.toString() !== currentUserId) {
        Toast.show({ type: "error", text1: "Thông báo", text2: "Bạn không thể xóa bình luận này" });
        return;
      }

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/remove-comment",
        { comment_id: commentId },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      if (res.data?.status === 200) {
        setComments(prev => prev.filter(c => c.id.toString() !== commentId));
        Toast.show({ type: "success", text1: "Đã xóa bình luận" });
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể xóa bình luận" });
    }
  };

  useEffect(() => {
    loadResourceUrl();
    fetchComments();
  }, [postId]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>

      <Text style={{ fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
        Bình luận ({comments.length})
      </Text>

      <FlatList
        data={comments}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const avatarUri = item.user_comment?.avatar
            ? `${resourceUrl}/${item.user_comment.avatar}`
            : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

          const canEdit = currentUserId === item.user_comment?.id.toString();

          return (
            <View style={{ flexDirection: "row", marginBottom: 12, height: 80 }}>
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "600" }}>
                  {item.user_comment?.name || "Người dùng"}
                </Text>
                <Text style={{ marginTop: 4 }}>{item.content}</Text>
                <Text style={{ color: "#666", fontSize: 12 }}>
                  {item.created_at ? dayjs(item.created_at).fromNow() : ""}
                </Text>
              </View>

              {canEdit && (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComment(item);
                    setActionMenuVisible(true);
                  }}
                  style={{ paddingHorizontal: 6 }}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#444" />
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      {/* Menu chỉnh sửa/xóa */}
      <Modal
        transparent
        visible={actionMenuVisible}
        animationType="fade"
        onRequestClose={() => setActionMenuVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" }}
          onPressOut={() => setActionMenuVisible(false)}
        >
          <View style={{ width: 200, backgroundColor: "#fff", borderRadius: 10 }}>
            <TouchableOpacity
              style={{ padding: 12, alignItems: "center", borderBottomWidth: 0.5, borderColor: "#ddd" }}
              onPress={() => {
                if (selectedComment) {
                  setEditingComment(selectedComment);
                  setCommentText(selectedComment.content);
                }
                setActionMenuVisible(false);
              }}
            >
              <Text style={{ color: "#007AFF", fontWeight: "600" }}>Sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 12, alignItems: "center" }}
              onPress={() => {
                if (selectedComment) removeComment(selectedComment.id.toString());
                setActionMenuVisible(false);
              }}
            >
              <Text style={{ color: "red", fontWeight: "600" }}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Ô nhập bình luận */}
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          placeholder={editingComment ? "Chỉnh sửa bình luận..." : "Viết bình luận..."}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            paddingHorizontal: 10,
            height: 40,
          }}
        />

        <TouchableOpacity
          onPress={() => {
            if (editingComment) {
              updateComment(editingComment.id, commentText);
            } else {
              postComment(commentText);
            }
          }}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="send-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: "flex-end", marginTop: 10 }}>
        <Text style={{ color: "blue" }}>Quay lại</Text>
      </TouchableOpacity>

    </View>
  );
}

