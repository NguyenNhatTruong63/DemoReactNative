import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View, Alert, TextInput } from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";


type userCreated={
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
};


export default function NewsFeedScreen(){
    const[news, setNews] = useState<NewItem[]>([]);
    const[loading, setLoading] = useState(true);
    const router = useRouter();
     const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
    const fetchNews = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
       if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: 'Vui lòng đăng nhập trước khi xem News Feed',
          visibilityTime: 2000
        })
        // Alert.alert(
        //   "Thông báo",
        //   "Vui lòng đăng nhập trước khi xem News Feed",
        //   [
        //     {
        //       text: "OK",
        //       onPress: () => router.push('/login'),
        //     },
        //   ]
        // );
        setLoading(false);
        return;
      }

        const res = await axios.get(
          "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
          {
            params: {
              type: 1,
              page: 1,
              limit: 50,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "x-svc-id": 1153,
            },
          }
        );

        console.log("Dữ liệu API:", res.data);
        const newsList = res.data?.data?.list || [];
        setNews(newsList);

        // setNews(items || []);
      } catch (error: any) {
        console.error("Lỗi khi gọi API:", error.response?.data || error.message);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể tải dữ liệu News Feed',
          visibilityTime: 2000
        })
        // Alert.alert("Lỗi", "Không thể tải dữ liệu News Feed");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

    const renderItem = ({ item }: { item: NewItem }) => {
        return (
            <ThemedView style={styles.card}>
            <View style={styles.header}>
                {item.avatar ? (
                <Image source={{ uri: item.user_created.avatar}} style={styles.avatar} />
                ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]} />
                )}
                <View style={{ flex: 1, marginLeft: 10 }}>
                <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
                <ThemedText style={styles.time}>{item.created_at}</ThemedText>
                </View>
            </View>
             <ThemedText style={styles.userName}>{item.title}</ThemedText>
            <ThemedText style={styles.content}>{item.content}</ThemedText>
            <View style={styles.acctionRow}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name='heart-outline' color='#FF5C5C'/>
                        <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name='chatbubbles-outline' color='#555'></Ionicons>
                        <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
                    </TouchableOpacity>
                </View>

            </ThemedView>
        );
    };

    return(
      <>
        <View style={styles.inputContainer}>
          <TouchableOpacity  onPress={() => router.push('/createPost')}>
            <TextInput
              style={styles.input}
              placeholder="Bạn đang nghĩ gì"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              editable={false}
            />
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
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    card:{
        top:30,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width:0, height: 2},
        shadowRadius: 4,
        elevation: 2
    },
    header:{
        flexDirection:'row',
        alignItems: 'center',
        marginBottom: 8
    },
    avatar:{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ccc'
    },
    avatarPlaceholder:{
        backgroundColor: '#bbb'
    },
    userName:{
        fontWeight:'700',
        fontSize: 14
    },
    time:{
        fontSize: 12,
        color: '#555'
    },
    content:{
        fontSize: 12,
        color: '#333'
    },
    acctionRow:{
        flexDirection: "row",
        borderTopWidth: 0.5,
        borderTopColor: "#eee",
        paddingTop: 6,
        justifyContent: "flex-start",
    },
    actionButton:{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16
    },
    actionText:{
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
})