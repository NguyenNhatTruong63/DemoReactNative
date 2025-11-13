import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Alert, TextInput, Text, Modal } from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import NewsFeedImages from "../NewsFeedImages";
import { useFocusEffect } from '@react-navigation/native';
import PostMenu from "@/app/Post/PostMenu";
import PostReactionsList from "@/app/PostReactionsList";
import { useLocalSearchParams } from "expo-router";
// import { setNotificationListener } from "../PushNotificationConfig";
// import PushNotification from "react-native-push-notification";
// import * as Notifications from 'expo-notifications';
// import { configureNotifications, setNotificationListener } from '../PushNotificationConfig';




type userCreated = {
  id: string;
  name: string;
  avatar: string;
};
type NewItem = {
  id: string;
  title: string;
  userName: string,
  user_created: userCreated
  avatar: userCreated;
  created_at: string;
  content: string;
  likes?: number;
  comments?: number;
  medias?: string[];
  liked?: boolean;
};
export enum KAIZEN_POST_TYPE {
  ALL = -1,
  NORMAL = 1,
  KAIZEN = 2,
}
type CommentType = {
  id: number | string;
  content: string;
  user_comment?: {
    id: number;
    name: string;
    avatar?: string;
  };
  medias?: string[];
  user_tags?: any[];
};




export default function NewsFeedScreen() {
  const [news, setNews] = useState<NewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resourceUrl, setResourceUrl] = useState<string>('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<KAIZEN_POST_TYPE>(KAIZEN_POST_TYPE.ALL);
  const [isFetching, setIsFetching] = useState(false);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    normal: 0,
    kaizen: 0,
  });
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
  const [editingComment, setEditingComment] = useState<CommentType | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { postId } = useLocalSearchParams();


  // const [user, setUser] = useState<userCreated | null>(null);

  const loadResourceUrl = async () => {
    try {
      const stored = await AsyncStorage.getItem('resource_url')
      if (stored) {
        setResourceUrl(stored);
        return stored;
      }
      const res = await axios.get('https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
        {
          headers: { "x-svc-id": 1153 }
        }
      );
      const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
      if (url) {
        await AsyncStorage.setItem("resource_url", url)
        setResourceUrl(url);
        return url;
      }
      return '';
    } catch (err) {
      console.log("Lỗi lấy resourceUrl", err);
      return '';
    }
  }
  // useEffect(() => {
  //   const fetchNews = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("access_token");
  //       if (!token) {
  //         setLoading(false)
  //         return
  //       }
  //       await loadResourceUrl();
  //       const res = await axios.get(
  //         "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
  //         {
  //           params: {
  //             type: 1,
  //             page: 1,
  //             limit: 50,
  //           },
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //             "x-svc-id": 1153,
  //           },
  //         }
  //       );

  //       console.log("Dữ liệu API:", res.data);
  //       const newsList = res.data?.data?.list || [];
  //       setNews(newsList);

  //       // setNews(items || []);
  //     } catch (error: any) {
  //       console.error("Lỗi khi gọi API:", error.response?.data || error.message);
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Lỗi',
  //         text2: 'Không thể tải dữ liệu News Feed',
  //         visibilityTime: 2000
  //       })
  //       // Alert.alert("Lỗi", "Không thể tải dữ liệu News Feed");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNews();
  // }, []);


  const fetchNews = async (type: KAIZEN_POST_TYPE) => {
    if (isFetching) return;
    setIsFetching(true);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      await loadResourceUrl();

      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
        {
          params: {
            type,
            page: 1,
            limit: 50
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-svc-id": 1153,
          },
        }
      );

      const list = res.data?.data?.list || [];
      setNews(list);
    } catch (err: any) {
      console.error("Lỗi khi gọi API:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải dữ liệu News Feed",
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const fetchTabCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/count-tab/user-posts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-svc-id": 1153,
          },
        }
      );

      const data = res.data?.data;
      if (data) {
        setTabCounts({
          all: data.all || 0,
          normal: data.normal || 0,
          kaizen: data.kaizen || 0,
        });
      }
    } catch (err: any) {
      console.error("Lỗi fetch count:", err.response?.data || err.message);
    }
  };





  // useEffect(() => {
  //     fetchNews(currentType);
  // }, [currentType, fetchNews]);


  useFocusEffect(
    useCallback(() => {
      fetchNews(currentType);
    }, [currentType])
  );
  useEffect(() => {
    fetchTabCounts();
  }, []);





  //    useEffect(() => {
  //     // Khi có notification tới → cập nhật state
  //     setNotificationListener((notif) => {
  //       setNotifications((prev) => [notif, ...prev]);
  //     });
  //   }, []);
  //   useEffect(() => {
  //   configureNotifications();

  //   // Cập nhật state khi notification tới
  //   setNotificationListener((notif) => {
  //     setNotifications(prev => [notif, ...prev]);
  //   });
  // }, []);



  const toggleLike = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");
      const post = news.find(item => Number(item.id) === postId);
      if (!post) throw new Error("Bài viết không tồn tại");

      const alreadyLiked = post.liked ?? false;
      const reaction_type = alreadyLiked ? 1 : 2;

      console.log("Gửi like với:", { post_id: postId, reaction_type });

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/reactions/posts",
        { post_id: postId, reaction_type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-svc-id": 1153
          }
        }
      );

      console.log("Kết quả like/unlike:", res.data);
      if (res.data?.status === 200) {
        setNews(prev =>
          prev.map(item =>
            Number(item.id) === postId
              ? {
                ...item,
                liked: !alreadyLiked,
                likes: Number(item.likes ?? 0) + (alreadyLiked ? -1 : 1)
              }
              : item
          )
        );
        Toast.show({
          type: "success",
          text1: alreadyLiked ? "Bỏ thích" : "Thích",
          text2: alreadyLiked ? "Đã bỏ like bài viết" : "Đã like bài viết",
          visibilityTime: 2000
        });
      } else {
        throw new Error(res.data?.message || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi khi like/unlike:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message || "Không thể like bài viết",
        visibilityTime: 2000
      });
    }
  };

  const fetchComments = async (postId: number | string) => {
    const post_id = Number(postId);
    if (isNaN(post_id)) return [];

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");
      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/comments",
        {
          params: {
            post_id
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "x-svc-id": 1153
          }
        }
      );


      if (res.data?.status === 200) {
        return res.data?.data?.list || [];
      } else {
        throw new Error(res.data?.message || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi fetch comment:", err.response?.data || err.message);
      return [];
    }
  };

  const openComments = async (postId: number | string) => {
    try {
      setSelectedPostId(postId);
      const list = await fetchComments(postId);
      console.log("Danh sách comment:", list);
      setComments(list);
      setNews(prev =>
        prev.map(item =>
          item.id === postId ? { ...item, comments: list.length } : item
        )
      );
      setCommentModalVisible(true);
    } catch (err) {
      console.error("Lỗi openComments:", err);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải bình luận",
        visibilityTime: 2000,
      });
    }
  };

  const postComment = async (postId: number | string, content: string) => {
    if (!postId || !content.trim()) return;
    const post_id = Number(postId);
    if (isNaN(post_id)) return;
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");
      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/create-comment",
        {
          post_id,
          content,
          user_tags: [],
          medias: []
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
          text1: "Thành công",
          text2: "Bình luận đã được gửi",
          visibilityTime: 2000,
        });
        setCommentText("");
        const newComment = res.data?.data;
        if (newComment) {
          setComments((prev) => [newComment, ...prev]);
        } else {
          const updatedList = await fetchComments(postId);
          setComments(updatedList);
        }
        setNews((prev) =>
          prev.map((item) =>
            item.id === postId
              ? { ...item, comments: (item.comments ?? 0) + 1 }
              : item
          )
        );
      } else {
        throw new Error(res.data?.message || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi khi gửi bình luận:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message || "Không thể gửi bình luận",
        visibilityTime: 2000,
      });
    }
  };

  const removeComment = async (commentId: string, postId: string | number) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");

      if (!commentId) throw new Error("Thiếu commentId");

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/remove-comment",
        {
          comment_id: commentId
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
          text1: "Thành công",
          text2: "Bình luận đã được xóa",
          visibilityTime: 2000,
        });

        // Cập nhật danh sách comment trên UI
        setComments(prev => prev.filter(c => c.id !== commentId));
        setNews(prev =>
          prev.map(item =>
            Number(item.id) === Number(postId)
              ? { ...item, comments: (item.comments ?? 1) - 1 }
              : item
          )
        );
      } else {
        throw new Error(res.data?.message || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi khi xóa comment:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message || "Không thể xóa bình luận",
        visibilityTime: 2000,
      });
    }
  };

  const updateComment = async (postId: number | string, commentId: number | string, content: string) => {
    if (!postId || !commentId || !content.trim()) return;
    const post_id = Number(postId);
    const comment_id = Number(commentId);
    if (isNaN(post_id) || isNaN(comment_id)) return;

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/update-comment",
        {
          post_id,
          comment_id,
          content,
          user_tags: [],
          medias: []
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
          text1: "Thành công",
          text2: "Bình luận đã được cập nhật",
          visibilityTime: 2000,
        });

        // Cập nhật comment trong danh sách ngay lập tức
        setComments(prev => prev.map(c => c.id === comment_id ? { ...c, content } : c));
      } else {
        throw new Error(res.data?.message || "Lỗi server");
      }
    } catch (err: any) {
      console.error("Lỗi khi cập nhật bình luận:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.message || err.message || "Không thể cập nhật bình luận",
        visibilityTime: 2000,
      });
    }
  };


  const renderItem = ({ item }: { item: NewItem }) => {
    // const avatarUri = item.user_created.avatar
    //   ? `${resourceUrl}/${item.user_created.avatar}`
    //   : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    const avatarUri = item.user_created.avatar
      ? `${resourceUrl}/${item.user_created.avatar}.jpg`
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    // console.log("avatar:", item.user_created.avatar, "resourceUrl:", resourceUrl);


    return (
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          {/* {item.avatar ? (
            <Image source={{ uri: item.user_created.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )} */}
          {/* {item.user_created.avatar ? (
            <Image source={{ uri: `${resourceUrl}/${item.user_created.avatar}` }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )} */}
          <TouchableOpacity onPress={() => router.push('/(tabs)/person')}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
            <ThemedText style={styles.time}>{item.created_at}</ThemedText>
          </View>
          <PostMenu
            postId={Number(item.id)}
            onPostDeleted={() => {
              fetchNews(currentType);
            }}
          />
        </View>
        <ThemedText style={styles.userName}>{item.title}</ThemedText>
        <ThemedText style={styles.content}>{item.content}</ThemedText>
        <NewsFeedImages
          medias={item.medias?.map(uri => `${resourceUrl}/${uri}`) || []}
          onPressImage={(uri) => {
            setSelectedImage(uri);
            setModalVisible(true);
          }}
        />

        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => setModalVisible(false)} />
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />
            )}
          </View>
        </Modal>


        <View style={styles.acctionRow}>
          <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", marginTop: 6 }}>
            <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(Number(item.id))}>
              <Ionicons name='heart-outline' color='#FF5C5C' />
              <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
            </TouchableOpacity>


            <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item.id)}>
              <Ionicons name='chatbubbles-outline' color='#555' />
              <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item.id)}>
              <Ionicons name='share-social-sharp' color='#555' />
              <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{width: 200, height: 30}}
              onPress={() =>
                router.push({
                  pathname: "/PostReactionsList",
                  params: { postId: String(item.id) },
                })
              }
            >
              {/* <Text>Xem danh sách</Text> */}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 6, alignItems: "center" }}>
          <TextInput
            value={commentText}
            onChangeText={setCommentText}
            placeholder="Viết bình luận..."
            style={{ flex: 1, borderWidth: 0.5, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 8, height: 40 }}
          />
          <TouchableOpacity
            onPress={() => postComment(item.id, commentText)}
            style={{ marginLeft: 6 }}
          >
            <Ionicons name="send-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>


        <Modal
          visible={commentModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCommentModalVisible(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
            <View style={{ backgroundColor: '#fff', margin: 20, borderRadius: 12, padding: 16, maxHeight: '80%' }}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>
                Bình luận ({comments.length})
              </Text>
              <FlatList
                data={comments}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginBottom: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 10 }}>
                      <Text style={{ fontWeight: "600" }}>
                        {item.user_comment?.name ?? "Người dùng"}
                      </Text>
                      <Text>{item.content ?? ""}</Text>
                    </View>

                    <View style={{ flexDirection: "row", gap: 12 }}>
                      {/* Nút Xóa */}
                      <TouchableOpacity
                        onPress={() => {
                          if (selectedPostId != null) {
                            removeComment(item.id, selectedPostId);
                          } else {
                            Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Post chưa được chọn' });
                          }
                        }}
                      >
                        <Text style={{ color: 'red', fontWeight: '600' }}>Xóa</Text>
                      </TouchableOpacity>

                      {/* Nút Sửa */}
                      <TouchableOpacity
                        onPress={() => {
                          setEditingComment(item);
                          setCommentText(item.content ?? "");
                        }}
                      >
                        <Text style={{ color: '#007AFF', fontWeight: '600' }}>Sửa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text>Chưa có bình luận nào</Text>}
              />
              {/* Input để viết/sửa bình luận */}
              <View style={{ flexDirection: "row", marginTop: 10, alignItems: "center" }}>
                <TextInput
                  value={commentText}
                  onChangeText={setCommentText}
                  placeholder="Viết bình luận..."
                  style={{
                    flex: 1,
                    borderWidth: 0.5,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    height: 40
                  }}
                />
                <TouchableOpacity
                  onPress={async () => {
                    if (!commentText.trim()) return;

                    if (selectedPostId != null && editingComment?.id != null) {
                      await updateComment(selectedPostId, editingComment.id, commentText);
                      setEditingComment(null);
                    } else {
                      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Post hoặc comment chưa được chọn' });
                    }
                    setCommentText(" "); // xóa input
                    // Reload danh sách comment
                    if (selectedPostId != null) {
                      const updatedList = await fetchComments(selectedPostId);
                      setComments(updatedList);
                    }
                  }}
                  style={{ marginLeft: 6 }}
                >
                  <Ionicons name="send-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
              </View>
              {/* Nút đóng modal */}
              <TouchableOpacity
                style={{ marginTop: 10, alignSelf: 'flex-end' }}
                onPress={() => setCommentModalVisible(false)}
              >
                <Text style={{ color: 'blue' }}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    );
  };

  return (
    <>
      <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => router.push('/Post/createPost')}>
          <TextInput
            style={styles.input}
            placeholder="Bạn đang nghĩ gì"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', marginRight: 10 }}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={{ fontSize: 12 }}>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#333" />
          <Text style={{ fontSize: 12 }}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.boxALl}>
        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.ALL)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: currentType === KAIZEN_POST_TYPE.ALL ? "#007AFF" : "transparent",
          }}
        >
          <Text style={{
            color: currentType === KAIZEN_POST_TYPE.ALL ? "#fff" : "#333",
            fontWeight: "600"
          }}>ALL({tabCounts.all})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.NORMAL)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: currentType === KAIZEN_POST_TYPE.NORMAL ? "#007AFF" : "transparent",
          }}
        >
          <Text style={{
            color: currentType === KAIZEN_POST_TYPE.NORMAL ? "#fff" : "#333",
            fontWeight: "600"
          }}>Normal({tabCounts.normal})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.KAIZEN)}
          style={{
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            backgroundColor: currentType === KAIZEN_POST_TYPE.KAIZEN ? "#007AFF" : "transparent",
          }}
        >
          <Text style={{
            color: currentType === KAIZEN_POST_TYPE.KAIZEN ? "#fff" : "#333",
            fontWeight: "600"
          }}>Kaizen({tabCounts.kaizen})</Text>
        </TouchableOpacity>
      </View>


      <ThemedView>
        <FlatList
          data={news}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{}}
        />
      </ThemedView>
    </>

  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  card: {
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc'
  },
  avatarPlaceholder: {
    backgroundColor: '#bbb'
  },
  userName: {
    fontWeight: '700',
    fontSize: 14
  },
  time: {
    fontSize: 12,
    color: '#555'
  },
  content: {
    fontSize: 12,
    color: '#333'
  },
  acctionRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#eee",
    paddingTop: 6,
    justifyContent: "flex-start",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16
  },
  actionText: {
    fontSize: 13,
    marginLeft: 4,
    color: '#555'
  },
  inputContainer: {
    backgroundColor: '#fff',
    marginTop: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  boxALl: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 6,
    marginHorizontal: 12,
  },
  banner: { padding: 12, backgroundColor: "#eee", borderRadius: 8, marginBottom: 10 },
  bannerTitle: { fontWeight: "bold", marginBottom: 4 },
})




