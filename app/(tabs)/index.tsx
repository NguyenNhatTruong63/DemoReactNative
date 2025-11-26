
import PostMenu from "@/app/post/Post-Menu";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import NewsFeedImages from "../news-feed-images/News-Feed-Images";
import { getPublicSettings } from "../api/auth";
import { detailComment } from "../api/comment";
import { newFees, reactionsPost2 } from "../api/post";

dayjs.extend(relativeTime);
dayjs.locale('vi');
dayjs.extend(customParseFormat);


type userCreated = {
  id: string;
  name: string;
  avatar: string;
};

type NewItem = {
  id: string;
  title: string;
  userName: string;
  user_created: userCreated;
  created_at: string;
  updated_at: string;
  content: string;
  likes?: number;
  comments?: number;
  medias: MediaItem[];
  liked?: boolean;
};
type MediaItem = {
  url: string;
  type: number;
};

export enum KAIZEN_POST_TYPE {
  ALL = -1,
  NORMAL = 1,
  KAIZEN = 2,
}

export default function NewsFeedScreen() {
  const [news, setNews] = useState<NewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [resourceUrl, setResourceUrl] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<KAIZEN_POST_TYPE>(KAIZEN_POST_TYPE.ALL);
  const [isFetching, setIsFetching] = useState(false);
  const [tabCounts, setTabCounts] = useState({ all: 0, normal: 0, kaizen: 0 });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);



  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem("user_info");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUserId(userData.id);
        }
      };
      loadUser();
    }, [])
  );



  const loadResourceUrl = async () => {
    try {
      const storedResource = await AsyncStorage.getItem('resource_url');
      if (storedResource) return setResourceUrl(storedResource);
      const publicRes = await getPublicSettings()
      const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
      if (url) await AsyncStorage.setItem('resource_url', url);
      setResourceUrl(url);
    } catch (err) {
      console.log('Lỗi lấy resource URL:', err);
    }
  };

  // Fetch news feed
  const fetchNews = async (type: KAIZEN_POST_TYPE) => {
    if (isFetching) return;
    setIsFetching(true);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      await loadResourceUrl();
      const res = await newFees(KAIZEN_POST_TYPE.ALL);


      const list = res.data?.data?.list || [];


      const cached = await AsyncStorage.getItem("cached_news");
      const cachedNews: NewItem[] = cached ? JSON.parse(cached) : [];

      const mergedNews = list.map((item: NewItem) => {
        const cachedItem = cachedNews.find(c => c.id === item.id);
        return {
          ...item,
          likes: cachedItem?.likes ?? item.likes ?? 0,
          liked: cachedItem?.liked ?? item.liked ?? false,
          // comments: item.comments ?? 0,         
          comments: cachedItem?.comments ?? item.comments ?? 0,
        };
      });
      const updatedNews = await Promise.all(
        mergedNews.map(async (item: any) => {
          const res = await detailComment(item.id);
      
          const count = res.data?.data?.list?.length ?? 0;
          return { ...item, comments: count };
        })
      );

      setNews(updatedNews);

      // setNews(mergedNews);
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

  // Fetch tab counts
  const fetchTabCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/count-tab/user-posts",
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      const data = res.data?.data;
      if (data) setTabCounts({ all: data.all || 0, normal: data.normal || 0, kaizen: data.kaizen || 0 });
    } catch (err: any) {
      console.error("Lỗi fetch count:", err.response?.data || err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNews(currentType);
      // fetchCommentCounts();
    }, [currentType])
  );
  useEffect(() => { fetchTabCounts(); }, []);

  const toggleLike = async (postId: number) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");

      const post = news.find(item => Number(item.id) === postId);
      if (!post) throw new Error("Bài viết không tồn tại");

      const alreadyLiked = post.liked ?? false;

      const reaction_type = alreadyLiked ? 1 : 2;

      const res = await reactionsPost2(postId, reaction_type);

      if (res.data?.status === 200) {
        const updatedLikes =
          res.data?.data?.likes ??
          (alreadyLiked ? post.likes! - 1 : post.likes! + 1);

        const updatedNews = news.map(item =>
          Number(item.id) === postId
            ? { ...item, liked: !alreadyLiked, likes: updatedLikes }
            : item
        );

        setNews(updatedNews);
        await AsyncStorage.setItem("cached_news", JSON.stringify(updatedNews));

        Toast.show({
          type: "success",
          text1: alreadyLiked ? "Bỏ thích" : "Thích",
          text2: alreadyLiked ? "Đã bỏ like bài viết" : "Đã like bài viết",
          visibilityTime: 2000
        });
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

  const fetchCommentCounts = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      const updatedNews = await Promise.all(
        news.map(async (item) => {
          const res = await detailComment(item.id)
      
          const count = res.data?.data?.list?.length ?? 0;
          return { ...item, comments: count };
        })
      );

      setNews(updatedNews);
    } catch (err: any) {
      console.error("Lỗi fetch comment count:", err.response?.data || err.message);
    }
  };




  const buildMediaUrl = (base: string, path: string) => {
    if (!path) return "";
    if (typeof path !== "string") return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = base.replace(/\/+$/, "");
    const cleanPath = path.startsWith("/") ? path : "/" + path;
    return cleanBase + cleanPath;
  };

  const getSafeMediaUrls = (medias: (string | { url?: string })[] = [], base: string) =>
    medias
      .map(m => {
        if (typeof m === "string") return buildMediaUrl(base, m);
        if (m && typeof m.url === "string") return buildMediaUrl(base, m.url);
        return null;
      })
      .filter(Boolean) as string[];



  const renderItem = ({ item }: { item: NewItem }) => {
    const avatarUrl = item.user_created.avatar
      ? `${resourceUrl}/${item.user_created.avatar}`
      : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    const medias = item.medias


    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.userName}>{item.user_created.name}</Text>
     
            <Text style={styles.time}>
              {item.updated_at
                ? `${dayjs(item.updated_at, "DD/MM/YYYY HH:mm", true).fromNow()}`
                : item.created_at
                  ? `${dayjs(item.created_at, "DD/MM/YYYY HH:mm", true).fromNow()}`
                  : ""}
            </Text>



          </View>
          {currentUserId === item.user_created.id && (
            <PostMenu postId={Number(item.id)} onPostDeleted={() => fetchNews(currentType)} />
          )}
        </View>

        <Text style={styles.userName}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>


        <NewsFeedImages
          // medias={medias}
          medias={getSafeMediaUrls(item.medias, resourceUrl)}
          resourceUrl={resourceUrl}
          onPressImage={(uri) => {
            setSelectedImage(uri);
            setModalVisible(true);
          }}
        />



        <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => setModalVisible(false)} />
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />}
          </View>
        </Modal>

        <View style={styles.acctionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => toggleLike(Number(item.id))}>
            <Ionicons name={item.liked ? 'heart' : 'heart-outline'} size={20} color='#FF5C5C' />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`../comment/CommentScreen?postId=${item.id}`)}>
            <Ionicons name="chatbubble-outline" size={20} color="#555" />
            <Text style={styles.actionText}>{item.comments ?? 0}</Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={{ width: 200, height: 30 }}
            onPress={() =>
              router.push({
                pathname: "/reactions/Post-Reactions-List",
                params: { postId: String(item.id) },
              })
            }
          >
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => router.push('/post/Create-Post')}>
          <TextInput
            style={styles.input}
            placeholder="Bạn đang nghĩ gì"
            placeholderTextColor="#aaa"
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center', marginRight: 10 }}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={{ fontSize: 12 }}>Thông báo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/Search')}>
          <Ionicons name="search-outline" size={24} color="#333" />
          <Text style={{ fontSize: 12 }}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.boxALl}>
        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.ALL)}
          style={[styles.tabButton, currentType === KAIZEN_POST_TYPE.ALL && styles.activeTab]}
        >
          <Text style={[styles.tabText, currentType === KAIZEN_POST_TYPE.ALL && styles.activeTabText]}>ALL({tabCounts.all})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.NORMAL)}
          style={[styles.tabButton, currentType === KAIZEN_POST_TYPE.NORMAL && styles.activeTab]}
        >
          <Text style={[styles.tabText, currentType === KAIZEN_POST_TYPE.NORMAL && styles.activeTabText]}>Normal({tabCounts.normal})</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentType(KAIZEN_POST_TYPE.KAIZEN)}
          style={[styles.tabButton, currentType === KAIZEN_POST_TYPE.KAIZEN && styles.activeTab]}
        >
          <Text style={[styles.tabText, currentType === KAIZEN_POST_TYPE.KAIZEN && styles.activeTabText]}>Kaizen({tabCounts.kaizen})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={news}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { top: 10, backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc' },
  userName: { fontWeight: '700', fontSize: 14 },
  time: { fontSize: 12, color: '#555' },
  content: { fontSize: 12, color: '#333', marginVertical: 6 },
  acctionRow: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: "#eee", paddingTop: 6, justifyContent: "flex-start" },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  actionText: { fontSize: 13, marginLeft: 4, color: '#555' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', marginTop: 50, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  input: { fontSize: 16, color: '#333' },
  boxALl: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10, backgroundColor: "#f5f5f5", borderRadius: 8, paddingVertical: 6, marginHorizontal: 12 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: "transparent" },
  activeTab: { backgroundColor: "#007AFF" },
  tabText: { color: "#333", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalImage: { width: '90%', height: '70%', borderRadius: 12 },
});
