// import React, { useEffect, useState, useCallback } from "react";
// import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Image } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import UserAvatar from "../AvatarScreen";
// import { useFocusEffect } from '@react-navigation/native';

// dayjs.extend(relativeTime);

// type CommentType = {
//     id: number | string;
//     content: string;
//     user_comment?: {
//         id: number;
//         name: string;
//         avatar?: string;
//     };
//     medias?: string[];
//     user_tags?: any[];
//     created_at?: string;
// };
// type userCreated = {
//     id: string;
//     name: string;
//     avatar: string;
// };
// type NewItem = {
//     id: string;
//     title: string;
//     userName: string,
//     user_created: userCreated
//     avatar: userCreated;
//     created_at: string;
//     content: string;
//     likes?: number;
//     comments?: number;
//     medias?: string[];
//     liked?: boolean;
// };
// type User = {
//     id: string;
//     name: string;
//     departments: string;
//     avatar: string;
// };


// export default function CommentScreen() {
//     const { postId } = useLocalSearchParams<{ postId: string }>();
//     const router = useRouter();
//     const [comments, setComments] = useState<CommentType[]>([]);
//     const [commentText, setCommentText] = useState("");
//     const [editingComment, setEditingComment] = useState<CommentType | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [selectedComment, setSelectedComment] = useState<any>(null);
//     const [actionMenuVisible, setActionMenuVisible] = useState(false);
//     const [news, setNews] = useState<NewItem[]>([]);
//     const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
//      const [resourceUrl, setResourceUrl] = useState<string>('');
//        const [user, setUser] = useState<userCreated | null>(null);

//     const loadResourceUrl = async () => {
//         try {
//             const storedResource = await AsyncStorage.getItem('resource_url');
//             if (storedResource) {
//                 setResourceUrl(storedResource);
//                 return storedResource;
//             }

//             const publicRes = await axios.get(
//                 'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//                 { headers: { 'x-svc-id': 1153 } }
//             );

//             const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
//             if (url) {
//                 await AsyncStorage.setItem('resource_url', url);
//                 setResourceUrl(url);
//                 return url;
//             }
//             return '';
//         } catch (err) {
//             console.log('Lỗi lấy resource URL:', err);
//             return '';
//         }
//     };
//     //  AsyncStorage + useFocusEffect để reload avatar
//     useFocusEffect(
//         useCallback(() => {
//             const loadUserAvatar = async () => {
//                 const storedUser = await AsyncStorage.getItem("user_info");
//                 if (storedUser) {
//                     const userData = JSON.parse(storedUser);
//                     setUser(userData);
//                 }
//             };
//             loadUserAvatar();
//         }, [])
//     );
//     useFocusEffect(
//         useCallback(() => {
//             const updateAvatar = async () => {
//                 const storedUser = await AsyncStorage.getItem('user_info');
//                 if (!storedUser) return;
//                 const currentUser = JSON.parse(storedUser);

//                 setNews(prevNews =>
//                     prevNews.map(item =>
//                         item.user_created.id === currentUser.id
//                             ? { ...item, user_created: { ...item.user_created, avatar: currentUser.avatar } }
//                             : item
//                     )
//                 );
//             };
//             updateAvatar();
//         }, [])
//     );



//     const fetchComments = async () => {
//         if (!postId) return;
//         try {
//             setLoading(true);
//             const token = await AsyncStorage.getItem("access_token");
//             if (!token) throw new Error("Chưa đăng nhập");

//             const res = await axios.get(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/comments",
//                 {
//                     params: { post_id: postId },
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153,
//                     },
//                 }
//             );

//             if (res.data?.status === 200) {
//                 setComments(res.data?.data?.list || []);
//             }
//         } catch (err: any) {
//             console.error("Lỗi fetch comment:", err.response?.data || err.message);
//             Toast.show({
//                 type: "error",
//                 text1: "Lỗi",
//                 text2: "Không thể tải bình luận",
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     //comment mới
//     const postComment = async (content: string) => {
//         if (!postId || !content.trim()) return;
//         try {
//             const token = await AsyncStorage.getItem("access_token");
//             if (!token) throw new Error("Chưa đăng nhập");

//             const res = await axios.post(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/create-comment",
//                 { post_id: postId, content, user_tags: [], medias: [] },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153,
//                     },
//                 }
//             );

//             if (res.data?.status === 200) {
//                 Toast.show({ type: "success", text1: "Đã gửi bình luận" });
//                 setCommentText("");
//                 fetchComments(); // reload danh sách
//             }
//         } catch (err: any) {
//             console.error("Lỗi khi gửi bình luận:", err.response?.data || err.message);
//             Toast.show({
//                 type: "error",
//                 text1: "Lỗi",
//                 text2: "Không thể gửi bình luận",
//             });
//         }
//     };

//     // Cập nhật comment
//     const updateComment = async (commentId: number | string, content: string) => {
//         if (!postId || !commentId || !content.trim()) return;
//         try {
//             const token = await AsyncStorage.getItem("access_token");
//             const currentUserId = await AsyncStorage.getItem("user_id");
//             if (!token || !currentUserId) throw new Error("Chưa đăng nhập");
//             const comment = comments.find(c => c.id.toString() === commentId);
//             if (comment && comment.user_comment?.id.toString() !== currentUserId) {
//                 Toast.show({
//                     type: "error",
//                     text1: "Thông báo",
//                     text2: "Bạn không thể sửa bình luận này"
//                 });
//                 return;
//             }

//             const res = await axios.post(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/update-comment",
//                 { post_id: postId, comment_id: commentId, content, user_tags: [], medias: [] },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153,
//                     },
//                 }
//             );

//             if (res.data?.status === 200) {
//                 Toast.show({ type: "success", text1: "Đã cập nhật bình luận" });
//                 setEditingComment(null);
//                 setCommentText("");
//                 fetchComments();
//             }
//         } catch (err: any) {
//             console.error("Lỗi cập nhật:", err.response?.data || err.message);
//             Toast.show({
//                 type: "error",
//                 text1: "Lỗi",
//                 text2: "Không thể cập nhật bình luận",
//             });
//         }
//     };





//     const removeComment = async (commentId: string) => {
//         try {
//             const token = await AsyncStorage.getItem("access_token");
//             const currentUserId = await AsyncStorage.getItem("user_id");
//             if (!token || !currentUserId) throw new Error("Chưa đăng nhập");

//             //kiểm tra quyền xóa comment
//             const comment = comments.find(c => c.id.toString() === commentId);
//             if (comment && comment.user_comment?.id.toString() !== currentUserId) {
//                 Toast.show({
//                     type: "error",
//                     text1: "Thông báo",
//                     text2: "Bạn không thể xóa bình luận này"
//                 });
//                 return;
//             }

//             const res = await axios.post(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/remove-comment",
//                 { comment_id: commentId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153,
//                     },
//                 }
//             );

//             if (res.data?.status === 200) {
//                 Toast.show({
//                     type: "success",
//                     text1: "Thông báo",
//                     text2: "Đã xóa bình luận"
//                 });
//                 setComments(prev => prev.filter(c => c.id.toString() !== commentId));

//                 // Update số lượng comment trên bài viết
//                 if (selectedPostId) {
//                     setNews(prev =>
//                         prev.map(item =>
//                             item.id === selectedPostId
//                                 ? { ...item, comments: (item.comments ?? 1) - 1 }
//                                 : item
//                         )
//                     );
//                 }
//             } else {
//                 throw new Error(res.data?.message || "Lỗi server");
//             }
//         } catch (err: any) {
//             console.error("Lỗi khi xóa comment:", err.response?.data || err.message);
//             Toast.show({
//                 type: "error",
//                 text1: "Lỗi",
//                 text2: err.response?.data?.message || err.message || "Không thể xóa bình luận",
//             });
//         }
//     };


//     useEffect(() => {
//         fetchComments();
//     }, [postId]);

//     if (loading) {
//         return (
//             <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//                 <ActivityIndicator size="large" />
//             </View>
//         );
//     }
    

//     return (
//         <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
//             <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 10 }}>
//                 Bình luận ({comments.length})
//             </Text>

//             <FlatList
//                 data={comments}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => (
//                     <View
//                         style={{
//                             marginBottom: 10,
//                             flexDirection: "row",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                         }}
//                     >
//                         {/* Thông tin người bình luận */}
//                         <View style={{ flex: 1 }}>
//                             {/* <Image
//                                 source={
//                                     item.user_comment?.avatar
//                                         ? { uri: item.user_comment.avatar }
//                                         : require("@/assets/images/default-avatar.png") // ảnh mặc định khi không có avatar
//                                 }
//                                 style={{
//                                     width: 40,
//                                     height: 40,
//                                     borderRadius: 20,
//                                     marginRight: 10,
//                                     backgroundColor: "#eee",
//                                 }}
//                             /> */}



//                             <Text style={{ fontWeight: "600" }}>
//                                 {item.user_comment?.name ?? "Người dùng"}
//                             </Text>
//                             <Text style={{ fontWeight: "600" }}>
//                                 {/* {item.created_at ? new Date(item.created_at).toLocaleString() : ""} */}
//                                 {item.created_at ? dayjs(item.created_at).fromNow() : ""}
//                                 {/* {item.user_comment?.} */}
//                             </Text>
//                             <Text>{item.content}</Text>
//                         </View>

//                         {/* Nút 3 chấm */}
//                         <TouchableOpacity
//                             onPress={() => {
//                                 setSelectedComment(item);
//                                 setActionMenuVisible(true);
//                             }}
//                             style={{ paddingHorizontal: 8 }}
//                         >
//                             <Ionicons name="ellipsis-vertical" size={20} color="#555" />
//                         </TouchableOpacity>
//                     </View>
//                 )}
//                 ListEmptyComponent={<Text>Chưa có bình luận nào</Text>}
//             />

//             {/*Modal menu hành động */}
//             <Modal
//                 visible={actionMenuVisible}
//                 transparent
//                 animationType="fade"
//                 onRequestClose={() => setActionMenuVisible(false)}
//             >
//                 <TouchableOpacity
//                     style={{
//                         flex: 1,
//                         backgroundColor: "rgba(0,0,0,0.3)",
//                         justifyContent: "center",
//                         alignItems: "center",
//                     }}
//                     activeOpacity={1}
//                     onPressOut={() => setActionMenuVisible(false)}
//                 >
//                     <View
//                         style={{
//                             backgroundColor: "#fff",
//                             width: 200,
//                             borderRadius: 12,
//                             paddingVertical: 8,
//                             elevation: 4,
//                         }}
//                     >
//                         <TouchableOpacity
//                             style={{
//                                 paddingVertical: 12,
//                                 alignItems: "center",
//                                 borderBottomWidth: 0.5,
//                                 borderColor: "#ddd",
//                             }}
//                             onPress={() => {
//                                 if (selectedComment) {
//                                     setEditingComment(selectedComment);
//                                     setCommentText(selectedComment.content);
//                                 }
//                                 setActionMenuVisible(false);
//                             }}
//                         >
//                             <Text style={{ color: "#007AFF", fontWeight: "600" }}>Sửa</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={{ paddingVertical: 12, alignItems: "center" }}
//                             onPress={() => {
//                                 if (selectedComment) {
//                                     removeComment(selectedComment.id.toString());
//                                 }
//                                 setActionMenuVisible(false);
//                             }}
//                         >
//                             <Text style={{ color: "red", fontWeight: "600" }}>Xóa</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </TouchableOpacity>
//             </Modal>



//             {/* Ô nhập comment */}
//             <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
//                 <TextInput
//                     value={commentText}
//                     onChangeText={setCommentText}
//                     placeholder={editingComment ? "Chỉnh sửa bình luận..." : "Viết bình luận..."}
//                     style={{
//                         flex: 1,
//                         borderWidth: 0.5,
//                         borderColor: "#ccc",
//                         borderRadius: 8,
//                         paddingHorizontal: 8,
//                         height: 40,
//                     }}
//                 />
//                 <TouchableOpacity
//                     onPress={() => {
//                         if (editingComment) {
//                             updateComment(editingComment.id, commentText);
//                         } else {
//                             postComment(commentText);
//                         }
//                     }}
//                     style={{ marginLeft: 6 }}
//                 >
//                     <Ionicons name="send-outline" size={24} color="#007AFF" />
//                 </TouchableOpacity>
//             </View>

//             {/* Nút quay lại */}
//             <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 10, alignSelf: "flex-end" }}>
//                 <Text style={{ color: "blue" }}>Quay lại</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }


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
    } catch (e) { }
  };

  
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
  const updateComment = async (commentId: number | string, content: string) => {
    if (!content.trim()) return;

    try {
      const token = await AsyncStorage.getItem("access_token");
      const currentUserId = await AsyncStorage.getItem("user_id");
      if (!token || !currentUserId) return;

      const comment = comments.find(c => c.id.toString() === commentId.toString());
      if (!comment) return;

      if (comment.user_comment?.id.toString() !== currentUserId.toString()) {
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
  const removeComment = async (commentId: string) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const currentUserId = await AsyncStorage.getItem("user_id");
      if (!token || !currentUserId) return;

      const comment = comments.find(c => c.id.toString() === commentId);
      if (!comment) return;

      if (comment.user_comment?.id.toString() !== currentUserId.toString()) {
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

          return (
            <View style={{ flexDirection: "row", marginBottom: 12, height: 80}}>
              
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

              <TouchableOpacity
                onPress={() => {
                  setSelectedComment(item);
                  setActionMenuVisible(true);
                }}
                style={{ paddingHorizontal: 6 }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="#444" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Menu chỉnh sửa */}
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

      {/* Ô nhập comment */}
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
