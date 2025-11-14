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
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/vi';



dayjs.extend(relativeTime);
dayjs.locale('vi');

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
type User = {
  id: string;
  name: string;
  departments: string;
  avatar: string;
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

  const [avatarUri, setAvatarUri] = useState<string | null>(null);


  const [user, setUser] = useState<userCreated | null>(null);

  // const loadResourceUrl = async () => {
  //   try {
  //     const stored = await AsyncStorage.getItem('resource_url')
  //     if (stored) {
  //       setResourceUrl(stored);
  //       return stored;
  //     }
  //     const res = await axios.get('https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
  //       {
  //         headers: { "x-svc-id": 1153 }
  //       }
  //     );
  //     const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
  //     if (url) {
  //       await AsyncStorage.setItem("resource_url", url)
  //       setResourceUrl(url);
  //       return url;
  //     }
  //     return '';
  //   } catch (err) {
  //     console.log("Lỗi lấy resourceUrl", err);
  //     return '';
  //   }
  // }


  const loadResourceUrl = async () => {
    try {
      const storedResource = await AsyncStorage.getItem('resource_url');
      if (storedResource) {
        setResourceUrl(storedResource);
        return storedResource;
      }

      const publicRes = await axios.get(
        'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
        { headers: { 'x-svc-id': 1153 } }
      );

      const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
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
  //  AsyncStorage + useFocusEffect để reload avatar
  useFocusEffect(
    useCallback(() => {
      const loadUserAvatar = async () => {
        const storedUser = await AsyncStorage.getItem("user_info");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      };
      loadUserAvatar();
    }, [])
  );
 useFocusEffect(
  useCallback(() => {
    const updateAvatar = async () => {
      const storedUser = await AsyncStorage.getItem('user_info');
      if (!storedUser) return;
      const currentUser = JSON.parse(storedUser);

      setNews(prevNews =>
        prevNews.map(item =>
          item.user_created.id === currentUser.id
            ? { ...item, user_created: { ...item.user_created, avatar: currentUser.avatar } }
            : item
        )
      );
    };
    updateAvatar();
  }, [])
);





  // Load user info nếu chưa có
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const loadUser = async () => {
  //       setLoading(true);
  //       try {
  //         await loadResourceUrl();
  //         if (!user) {
  //           const storedUser = await AsyncStorage.getItem('user_info');
  //           if (storedUser) setUser(JSON.parse(storedUser));
  //         }
  //       } catch (err) {
  //         console.log('Lỗi load user:', err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     loadUser();
  //   }, [user])
  // );

  // const avatarUrl = avatarUri
  //   ? avatarUri
  //   : user?.avatar
  //     ? `${resourceUrl}/${user.avatar}`
  //     : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';


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



  // const toggleLike = async (postId: number) => {
  //   try {
  //     const token = await AsyncStorage.getItem("access_token");
  //     if (!token) throw new Error("Chưa đăng nhập");
  //     const post = news.find(item => Number(item.id) === postId);
  //     if (!post) throw new Error("Bài viết không tồn tại");

  //     const alreadyLiked = post.liked ?? false;
  //     const reaction_type = alreadyLiked ? 1 : 2;

  //     console.log("Gửi like với:", { post_id: postId, reaction_type });

  //     const res = await axios.post(
  //       "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/reactions/posts",
  //       {
  //         post_id: postId,
  //         reaction_type
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "x-svc-id": 1153
  //         }
  //       }
  //     );

  //     console.log("Kết quả like/unlike:", res.data);
  //     if (res.data?.status === 200) {
  //       setNews(prev =>
  //         prev.map(item =>
  //           Number(item.id) === postId
  //             ? {
  //               ...item,
  //               liked: !alreadyLiked,
  //               likes: Number(item.likes ?? 0) + (alreadyLiked ? -1 : 1)
  //             }
  //             : item
  //         )
  //       );
  //       Toast.show({
  //         type: "success",
  //         text1: alreadyLiked ? "Bỏ thích" : "Thích",
  //         text2: alreadyLiked ? "Đã bỏ like bài viết" : "Đã like bài viết",
  //         visibilityTime: 2000
  //       });
  //     } else {
  //       throw new Error(res.data?.message || "Lỗi server");
  //     }
  //   } catch (err: any) {
  //     console.error("Lỗi khi like/unlike:", err.response?.data || err.message);
  //     Toast.show({
  //       type: "error",
  //       text1: "Lỗi",
  //       text2: err.response?.data?.message || err.message || "Không thể like bài viết",
  //       visibilityTime: 2000
  //     });
  //   }
  // };


  const toggleLike = async (postId: number) => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) throw new Error("Chưa đăng nhập");

    const post = news.find(item => Number(item.id) === postId);
    if (!post) throw new Error("Bài viết không tồn tại");

    const alreadyLiked = post.liked ?? false;
    const reaction_type = alreadyLiked ? 1 : 2; // 1 = unlike, 2 = like

    // Gửi lên server
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

    if (res.data?.status === 200) {
      // Lấy số lượt like mới từ server nếu có
      const updatedLikes = res.data?.data?.likes ?? (alreadyLiked ? Number(post.likes ?? 0) - 1 : Number(post.likes ?? 0) + 1);

      // Cập nhật state news
      const updatedNews = news.map(item =>
        Number(item.id) === postId
          ? { ...item, liked: !alreadyLiked, likes: updatedLikes }
          : item
      );
      setNews(updatedNews);

      // Lưu vào AsyncStorage để reload vẫn giữ
      await AsyncStorage.setItem("cached_news", JSON.stringify(updatedNews));

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
const loadNews = async () => {
  const cached = await AsyncStorage.getItem("cached_news");
  if (cached) {
    setNews(JSON.parse(cached));
  } else {
    // fetch từ server nếu không có cache
    const res = await axios.get("https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/posts", {
      headers: { "x-svc-id": 1153 }
    });
    setNews(res.data?.data || []);
  }
};




  const renderItem = ({ item }: { item: NewItem }) => {
    const avatarUrl = item.user_created.avatar
      ? `${resourceUrl}/${item.user_created.avatar}`  // avatar của tác giả bài viết
      : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    // const avatarUrl = avatarUri
    //   ? avatarUri
    //   : user?.avatar
    //     ? `${resourceUrl}/${user.avatar}`
    //     : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';


    // const avatarUri = item.user_created.avatar
    //   ? `${resourceUrl}/${item.user_created.avatar}`
    //   : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    // const avatarUri = item.user_created.avatar
    //   ? `${resourceUrl}/${item.user_created.avatar}.jpg`
    //   : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
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
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              resizeMode="cover"
            />
            {/* <Image source={{ uri: avatarUri }} style={styles.avatar} /> */}
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
            <ThemedText style={styles.time}>{item.created_at}</ThemedText>
            {/* <ThemedText style={styles.time}>
              {item.created_at ? dayjs(item.created_at).fromNow() : ""}
            </ThemedText> */}


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
              <Ionicons name='heart-outline' size={20} color='#FF5C5C' />
              <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`../Comment/CommentScreen?postId=${item.id}`)}>
              <Ionicons name="chatbubble-outline" size={20} color="#555" />
              {/* <Text style={{ marginLeft: 4 }}>{comments.length ?? 0}</Text> */}
              <Text style={{ marginLeft: 4 }}>{item.comments ?? 0}</Text>
            </TouchableOpacity>


            {/* <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item.id)}>
              <Ionicons name='chatbubbles-outline' color='#555' />
              <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item.id)}>
              <Ionicons name='share-social-sharp' color='#555' />
              <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{ width: 200, height: 30 }}
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



// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useState, useCallback } from "react";
// import { FlatList, Image, StyleSheet, TouchableOpacity, View, TextInput, Text, Modal } from "react-native";
// import axios from "axios";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";
// import NewsFeedImages from "../NewsFeedImages";
// import { useFocusEffect } from '@react-navigation/native';
// import PostMenu from "@/app/Post/PostMenu";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import 'dayjs/locale/vi';

// dayjs.extend(relativeTime);
// dayjs.locale('vi');

// type userCreated = { id: string; name: string; avatar: string; };
// type NewItem = {
//   id: string;
//   title: string;
//   userName: string;
//   user_created: userCreated;
//   created_at: string;
//   content: string;
//   likes?: number;
//   comments?: number;
//   medias?: string[];
//   liked?: boolean;
// };

// export enum KAIZEN_POST_TYPE { ALL = -1, NORMAL = 1, KAIZEN = 2 }

// export default function NewsFeedScreen() {
//   const [news, setNews] = useState<NewItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [resourceUrl, setResourceUrl] = useState<string>('');
//   const [currentType, setCurrentType] = useState<KAIZEN_POST_TYPE>(KAIZEN_POST_TYPE.ALL);
//   const [tabCounts, setTabCounts] = useState({ all: 0, normal: 0, kaizen: 0 });
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const router = useRouter();

//   /** Load resource URL */
//   const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem('resource_url');
//       if (storedResource) { setResourceUrl(storedResource); return storedResource; }

//       const publicRes = await axios.get('https://beta.api.gateway.overate-vntech.com/api/v1/settings/public', { headers: { 'x-svc-id': 1153 } });
//       const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) await AsyncStorage.setItem('resource_url', url);
//       setResourceUrl(url);
//       return url;
//     } catch (err) { console.log('Lỗi lấy resource URL:', err); return ''; }
//   };

//   /** Fetch news from API */
//   const fetchNews = async (type: KAIZEN_POST_TYPE) => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       if (!token) return;

//       await loadResourceUrl();

//       const res = await axios.get("https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed", {
//         params: { type, page: 1, limit: 50 },
//         headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
//       });

//       const list: NewItem[] = res.data?.data?.list || [];

//       // Cập nhật avatar người dùng hiện tại nếu trùng id
//       const storedUser = await AsyncStorage.getItem('user_info');
//       const currentUser = storedUser ? JSON.parse(storedUser) : null;
//       const updatedList = list.map(item =>
//         currentUser && item.user_created.id === currentUser.id
//           ? { ...item, user_created: { ...item.user_created, avatar: currentUser.avatar } }
//           : item
//       );

//       setNews(updatedList);
//       await AsyncStorage.setItem("cached_news", JSON.stringify(updatedList));
//     } catch (err: any) {
//       console.error("Lỗi khi gọi API:", err.response?.data || err.message);
//       Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải dữ liệu News Feed", visibilityTime: 2000 });
//     } finally { setLoading(false); }
//   };

//   /** Fetch tab counts */
//   const fetchTabCounts = async () => {
//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       if (!token) return;
//       const res = await axios.get("https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/count-tab/user-posts", {
//         headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
//       });
//       const data = res.data?.data;
//       if (data) setTabCounts({ all: data.all || 0, normal: data.normal || 0, kaizen: data.kaizen || 0 });
//     } catch (err: any) { console.error("Lỗi fetch count:", err.response?.data || err.message); }
//   };

//   /** Load cached news + update avatar khi focus */
//   useFocusEffect(
//     useCallback(() => {
//       const loadCachedNews = async () => {
//         const cached = await AsyncStorage.getItem("cached_news");
//         const storedUser = await AsyncStorage.getItem('user_info');
//         const currentUser = storedUser ? JSON.parse(storedUser) : null;

//         if (cached) {
//           const cachedNews: NewItem[] = JSON.parse(cached);
//           const updatedNews = cachedNews.map(item =>
//             currentUser && item.user_created.id === currentUser.id
//               ? { ...item, user_created: { ...item.user_created, avatar: currentUser.avatar } }
//               : item
//           );
//           setNews(updatedNews);
//         }

//         fetchTabCounts();
//       };
//       loadCachedNews();
//     }, [])
//   );

//   /** Toggle like */
//   const toggleLike = async (postId: string) => {
//     try {
//       const token = await AsyncStorage.getItem("access_token");
//       if (!token) throw new Error("Chưa đăng nhập");

//       // Update state ngay lập tức
//       setNews(prevNews =>
//         prevNews.map(item => {
//           if (item.id === postId) {
//             const alreadyLiked = item.liked ?? false;
//             return { ...item, liked: !alreadyLiked, likes: (item.likes ?? 0) + (alreadyLiked ? -1 : 1) };
//           }
//           return item;
//         })
//       );

//       // Lưu state mới vào cache
//       const updatedNews = news.map(item =>
//         item.id === postId
//           ? { ...item, liked: !(item.liked ?? false), likes: (item.likes ?? 0) + ((item.liked ?? false) ? -1 : 1) }
//           : item
//       );
//       await AsyncStorage.setItem("cached_news", JSON.stringify(updatedNews));

//       // Gửi server async
//       const post = news.find(item => item.id === postId);
//       const alreadyLiked = post?.liked ?? false;
//       const reaction_type = alreadyLiked ? 1 : 2;
//       axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/reactions/posts",
//         { post_id: postId, reaction_type },
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       ).then(res => {
//         if (res.data?.status === 200 && res.data?.data?.likes != null) {
//           setNews(prevNews =>
//             prevNews.map(item => item.id === postId ? { ...item, likes: res.data.data.likes } : item)
//           );
//           AsyncStorage.setItem("cached_news", JSON.stringify(news));
//         }
//       });
//     } catch (err: any) {
//       console.error("Lỗi khi like/unlike:", err.response?.data || err.message);
//       Toast.show({ type: "error", text1: "Lỗi", text2: err.message || "Không thể like bài viết", visibilityTime: 2000 });
//     }
//   };

//   /** Render Item */
//   const renderItem = ({ item }: { item: NewItem }) => {
//     const avatarUrl = item.user_created.avatar ? `${resourceUrl}/${item.user_created.avatar}` : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

//     return (
//       <ThemedView style={styles.card}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.push('/(tabs)/person')}>
//             <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
//           </TouchableOpacity>
//           <View style={{ flex: 1, marginLeft: 10 }}>
//             <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
//             <ThemedText style={styles.time}>{item.created_at ? dayjs(item.created_at).fromNow() : ""}</ThemedText>
//           </View>
//           <PostMenu postId={Number(item.id)} onPostDeleted={() => fetchNews(currentType)} />
//         </View>

//         <ThemedText style={styles.userName}>{item.title}</ThemedText>
//         <ThemedText style={styles.content}>{item.content}</ThemedText>

//         <NewsFeedImages
//           medias={item.medias?.map(uri => `${resourceUrl}/${uri}`) || []}
//           onPressImage={(uri) => { setSelectedImage(uri); setModalVisible(true); }}
//         />

//         <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
//           <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
//             <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => setModalVisible(false)} />
//             {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />}
//           </View>
//         </Modal>

//         <View style={styles.acctionRow}>
//           <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(item.id)}>
//             <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={20} color='#FF5C5C' />
//             <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`../Comment/CommentScreen?postId=${item.id}`)}>
//             <Ionicons name="chatbubble-outline" size={20} color="#555" />
//             <Text style={{ marginLeft: 4 }}>{item.comments ?? 0}</Text>
//           </TouchableOpacity>
//         </View>
//       </ThemedView>
//     );
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Input & Action */}
//       <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
//         <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => router.push('/Post/createPost')}>
//           <TextInput style={styles.input} placeholder="Bạn đang nghĩ gì" placeholderTextColor="#aaa" editable={false} />
//         </TouchableOpacity>
//         <TouchableOpacity style={{ alignItems: 'center', marginRight: 10 }}>
//           <Ionicons name="notifications-outline" size={24} color="#333" />
//           <Text style={{ fontSize: 12 }}>Thông báo</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/search')}>
//           <Ionicons name="search-outline" size={24} color="#333" />
//           <Text style={{ fontSize: 12 }}>Tìm kiếm</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Tabs */}
//       <View style={styles.boxALl}>
//         {[
//           { type: KAIZEN_POST_TYPE.ALL, label: `ALL(${tabCounts.all})` },
//           { type: KAIZEN_POST_TYPE.NORMAL, label: `Normal(${tabCounts.normal})` },
//           { type: KAIZEN_POST_TYPE.KAIZEN, label: `Kaizen(${tabCounts.kaizen})` }
//         ].map(tab => (
//           <TouchableOpacity
//             key={tab.type}
//             onPress={() => { setCurrentType(tab.type); fetchNews(tab.type); }}
//             style={{
//               paddingVertical: 6,
//               paddingHorizontal: 12,
//               borderRadius: 6,
//               backgroundColor: currentType === tab.type ? "#007AFF" : "transparent",
//             }}
//           >
//             <Text style={{ color: currentType === tab.type ? "#fff" : "#333", fontWeight: "600" }}>{tab.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <FlatList
//         data={news}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: { top: 10, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc' },
//   userName: { fontWeight: '700', fontSize: 14 },
//   time: { fontSize: 12, color: '#555' },
//   content: { fontSize: 12, color: '#333', marginVertical: 6 },
//   acctionRow: { flexDirection: "row", borderTopWidth: 0.5, borderTopColor: "#eee", paddingTop: 6, justifyContent: "flex-start" },
//   actionButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
//   actionText: { fontSize: 13, marginLeft: 4, color: '#555' },
//   inputContainer: { backgroundColor: '#fff', marginTop: 50, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
//   input: { fontSize: 16, color: '#333' },
//   boxALl: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10, backgroundColor: "#f5f5f5", borderRadius: 8, paddingVertical: 6, marginHorizontal: 12 },
// });

