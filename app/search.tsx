import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type userCreated = {
  id: string;
  name: string;
  avatar: string;
};

type NewItem = {
  id: string;
  title: string;
  user_created: userCreated;
  content: string;
  likes?: number;
  comments?: number;
  medias?: string[];
};

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [news, setNews] = useState<NewItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewItem[]>([]);
  const [resourceUrl, setResourceUrl] = useState<string>("");
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Tìm kiếm",
    });
  }, [navigation]);

  // Load resource URL
  const loadResourceUrl = async () => {
    const stored = await AsyncStorage.getItem("resource_url");
    if (stored) {
      setResourceUrl(stored);
      return stored;
    }
    const res = await axios.get(
      "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
      {
        headers: { "x-svc-id": 1153 },
      });
    const url = res.data?.data?.CONFIG_RESOURCE_URL ?? "";
    if (url) {
      await AsyncStorage.setItem("resource_url", url);
      setResourceUrl(url);
      return url;
    }
    return "";
  };

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) return;

      await loadResourceUrl();

      const res = await axios.get("https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed", {
        params: { type: 1, page: 1, limit: 50 },
        headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
      });

      const newsList = res.data?.data?.list || [];
      setNews(newsList);
      setFilteredNews(newsList);
    };
    fetchNews();
  }, []);

  // Filter news theo searchText
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredNews([]);
    } else {
      const filtered = news.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.content.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchText, news]);

  const renderItem = ({ item }: { item: NewItem }) => {
    const avatarUri = item.user_created.avatar
      ? `${resourceUrl}/${item.user_created.avatar}`
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    return (
      <ThemedView style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <ThemedText style={{ marginLeft: 8 }}>{item.user_created.name}</ThemedText>
        </View>

        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.content}>{item.content}</ThemedText>
        {/* <View style={styles.imgs}>
          <NewsFeedImages medias={item.medias?.map(uri => `${resourceUrl}/${uri}`) || []} />
        </View> */}
        <View>
          <View style={styles.acctionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name='heart-outline' color='#FF5C5C' />
              <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name='chatbubbles-outline' color='#555'></Ionicons>
              <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    );
  };


  return (
    <View>
      <TextInput
        placeholder="Tìm kiếm..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => {
          if (searchText.trim() !== "") {
            return <Text style={{ textAlign: "center", marginTop: 20 }}>Không có kết quả</Text>;
          }
          return null;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: { padding: 10, borderRadius: 8, backgroundColor: "#eee", marginBottom: 12 },
  card: { marginBottom: 12, padding: 12, backgroundColor: "#fff", borderRadius: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc" },
  title: { fontWeight: "bold", marginBottom: 4 },
  content: { fontSize: 12, color: "#333" },
  imgs: {
    marginTop: 8,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap"
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
});
