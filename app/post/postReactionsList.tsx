import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/vi';
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ToastHelper } from "@/components/toast/ToastShow";
import { apiGetReactionsPost } from "@/api/postNewsFeed/getReactionsPost";

dayjs.extend(relativeTime);
dayjs.locale('vi');
dayjs.extend(customParseFormat);

export default function PostReactionsList({ onClose }: { onClose?: () => void }) {
  const { postId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<any[]>([]);
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Danh sách",
    });
  }, [navigation]);

  const fetchReactions = async () => {
    setLoading(true);
    try {
      const pid = Number(postId);
      if (!pid || isNaN(pid) || pid < 1) throw new Error("postId không hợp lệ");

      const token = await AsyncStorage.getItem("access_token");
      if (!token) throw new Error("Chưa đăng nhập");
      const res = await apiGetReactionsPost(pid)

      if (res.data?.status === 200) {
        setReactions(res.data.data?.list || []);
      } else {
        throw new Error(res.data?.message || "Lỗi khi lấy reactions");
      }
    } catch (err: any) {
      console.log("Lỗi fetch reactions:", err.message || err);
      ToastHelper.custom({
        type: "error",
        text1: "Lỗi",
        text2: err.message || "Lấy danh sách like thất bại",
      });
      setReactions([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReactions();
    }, [postId])
  );

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );

  if (!reactions.length) return (
    <View style={styles.center}>
      <Text>Chưa có ai tương tác bài viết này</Text>
    </View>
  );
  const renderReactionIcon = (reactionType: string) => {
    switch (reactionType) {
      case "like":
        return <Ionicons name="thumbs-up-outline" size={22} color="#0a77f3ff" />;
      default:
        return <Ionicons name="thumbs-up-outline" size={22} color="#555" />;
    }
  };

  const extractUser = (item: any) =>
    item.user || item.user_created || item.user_created_info || item.created_by || item.userInfo || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Danh sách tương tác ({reactions.length})</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={reactions}
        keyExtractor={(item, idx) => (item.id ? String(item.id) : String(idx))}
        renderItem={({ item }) => {
          const user = extractUser(item);
          const name = user.name || user.username || "Người dùng";
          const avatar = user.avatar || "";
          // const reactionType =  "like";
          const reactionType = item.reaction_type;


          const avatarUri =
            avatar.startsWith("http")
              ? avatar
              : avatar
                ? `https://beta.api.gateway.overate-vntech.com/msh-media/short/${avatar}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

          return (
            <View style={styles.item}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{name}</Text>
                {renderReactionIcon(reactionType)}
                <Text>
                  {dayjs(item.created_at, "DD/MM/YYYY HH:mm:ss", true).fromNow()}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
  },
  center: {
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
  },
  close: {
    fontSize: 18,
    color: "#007AFF",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  reaction: {
    fontSize: 13,
    color: "#666",
  },
});
