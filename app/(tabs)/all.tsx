// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState, useCallback } from "react";
// import { FlatList, Image, StyleSheet, TouchableOpacity, View, Alert, TextInput, Text, Modal } from "react-native";
// import axios from "axios";
// import { useRouter } from 'expo-router';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";
// import NewsFeedImages from "../NewsFeedImages";
// import { useFocusEffect } from '@react-navigation/native';
// // import { setNotificationListener } from "../PushNotificationConfig";
// // import PushNotification from "react-native-push-notification";
// // import * as Notifications from 'expo-notifications';
// // import { configureNotifications, setNotificationListener } from '../PushNotificationConfig';




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
// };
// export enum KAIZEN_POST_TYPE {
//     ALL = -1,
//     NORMAL = 1,
//     KAIZEN = 2,
// }


// export default function NewsFeedScreen() {
//     const [news, setNews] = useState<NewItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [resourceUrl, setResourceUrl] = useState<string>('');
//     const [notifications, setNotifications] = useState<any[]>([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [currentType, setCurrentType] = useState<KAIZEN_POST_TYPE>(KAIZEN_POST_TYPE.ALL);
//     const [isFetching, setIsFetching] = useState(false);


//     // const [user, setUser] = useState<userCreated | null>(null);

//     const loadResourceUrl = async () => {
//         try {
//             const stored = await AsyncStorage.getItem('resource_url')
//             if (stored) {
//                 setResourceUrl(stored);
//                 return stored;
//             }
//             const res = await axios.get('https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//                 {
//                     headers: { "x-svc-id": 1153 }
//                 }
//             );
//             const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
//             if (url) {
//                 await AsyncStorage.setItem("resource_url", url)
//                 setResourceUrl(url);
//                 return url;
//             }
//             return '';
//         } catch (err) {
//             console.log("Lỗi lấy resourceUrl", err);
//             return '';
//         }
//     }
//     // useEffect(() => {
//     //     const fetchNews = async (type: KAIZEN_POST_TYPE = KAIZEN_POST_TYPE.ALL) => {
//     //         try {
//     //             const token = await AsyncStorage.getItem("access_token");
//     //             if (!token) {
//     //                 setLoading(false)
//     //                 return
//     //             }
//     //             await loadResourceUrl();
//     //             const res = await axios.get(
//     //                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
//     //                 {
//     //                     params: {
//     //                         type,
//     //                         page: 1,
//     //                         limit: 50,
//     //                     },
//     //                     headers: {
//     //                         Authorization: `Bearer ${token}`,
//     //                         "x-svc-id": 1153,
//     //                     },
//     //                 }
//     //             );

//     //             console.log("Dữ liệu API:", res.data);
//     //             const newsList = res.data?.data?.list || [];
//     //             setNews(newsList);

//     //             // setNews(items || []);
//     //         } catch (error: any) {
//     //             console.error("Lỗi khi gọi API:", error.response?.data || error.message);
//     //             Toast.show({
//     //                 type: 'error',
//     //                 text1: 'Lỗi',
//     //                 text2: 'Không thể tải dữ liệu News Feed',
//     //                 visibilityTime: 2000
//     //             })
//     //             // Alert.alert("Lỗi", "Không thể tải dữ liệu News Feed");
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchNews();
//     // }, []);
//     // useEffect(() => {
//     //     fetchNews(KAIZEN_POST_TYPE.NORMAL);
//     // }, []);

//     // const fetchNews = useCallback(
//     //     async (type: KAIZEN_POST_TYPE = KAIZEN_POST_TYPE.ALL) => {
//     //         try {
//     //             const token = await AsyncStorage.getItem("access_token");
//     //             if (!token) {
//     //                 setLoading(false);
//     //                 return;
//     //             }

//     //             const url = await loadResourceUrl();
//     //             const res = await axios.get(
//     //                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
//     //                 {
//     //                     params: {
//     //                         type,
//     //                         page: 1,
//     //                         limit: 50
//     //                     },
//     //                     headers: {
//     //                         Authorization: `Bearer ${token}`,
//     //                         "x-svc-id": 1153,
//     //                     },
//     //                 }
//     //             );

//     //             console.log("Dữ liệu API:", res.data);
//     //             const list = res.data?.data?.list || [];
//     //             setNews(list);
//     //         } catch (error: any) {
//     //             console.error("Lỗi khi gọi API:", error.response?.data || error.message);
//     //             Toast.show({
//     //                 type: "error",
//     //                 text1: "Lỗi",
//     //                 text2: "Không thể tải dữ liệu News Feed",
//     //                 visibilityTime: 2000,
//     //             });
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     },
//     //     [loadResourceUrl]
//     // );


//     const fetchNews = async (type: KAIZEN_POST_TYPE) => {
//         if (isFetching) return; 
//         setIsFetching(true);
//         setLoading(true);

//         try {
//             const token = await AsyncStorage.getItem("access_token");
//             if (!token) return;

//             await loadResourceUrl();

//             const res = await axios.get(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
//                 {
//                     params: { type, page: 1, limit: 50 },
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153,
//                     },
//                 }
//             );

//             const list = res.data?.data?.list || [];
//             setNews(list);
//         } catch (err: any) {
//             console.error("Lỗi khi gọi API:", err.response?.data || err.message);
//             Toast.show({
//                 type: "error",
//                 text1: "Lỗi",
//                 text2: "Không thể tải dữ liệu News Feed",
//                 visibilityTime: 2000,
//             });
//         } finally {
//             setLoading(false);
//             setIsFetching(false);
//         }
//     };




//     // useEffect(() => {
//     //     fetchNews(currentType);
//     // }, [currentType, fetchNews]);


//     useFocusEffect(
//         useCallback(() => {
//             fetchNews(currentType); // currentType là state của tab
//         }, [currentType])
//     );





//     //    useEffect(() => {
//     //     // Khi có notification tới → cập nhật state
//     //     setNotificationListener((notif) => {
//     //       setNotifications((prev) => [notif, ...prev]);
//     //     });
//     //   }, []);
//     //   useEffect(() => {
//     //   configureNotifications();

//     //   // Cập nhật state khi notification tới
//     //   setNotificationListener((notif) => {
//     //     setNotifications(prev => [notif, ...prev]);
//     //   });
//     // }, []);







//     const renderItem = ({ item }: { item: NewItem }) => {
//         // const avatarUri = item.user_created.avatar
//         //   ? `${resourceUrl}/${item.user_created.avatar}`
//         //   : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//         const avatarUri = item.user_created.avatar
//             ? `${resourceUrl}/${item.user_created.avatar}.jpg`
//             : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//         // console.log("avatar:", item.user_created.avatar, "resourceUrl:", resourceUrl);


//         return (
//             <ThemedView style={styles.card}>
//                 <View style={styles.header}>
//                     {/* {item.avatar ? (
//             <Image source={{ uri: item.user_created.avatar }} style={styles.avatar} />
//           ) : (
//             <View style={[styles.avatar, styles.avatarPlaceholder]} />
//           )} */}
//                     {/* {item.user_created.avatar ? (
//             <Image source={{ uri: `${resourceUrl}/${item.user_created.avatar}` }} style={styles.avatar} />
//           ) : (
//             <View style={[styles.avatar, styles.avatarPlaceholder]} />
//           )} */}
//                     <TouchableOpacity onPress={() => router.push('/(tabs)/person')}>
//                         <Image source={{ uri: avatarUri }} style={styles.avatar} />
//                     </TouchableOpacity>



//                     <View style={{ flex: 1, marginLeft: 10 }}>
//                         <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
//                         <ThemedText style={styles.time}>{item.created_at}</ThemedText>
//                     </View>
//                 </View>
//                 <ThemedText style={styles.userName}>{item.title}</ThemedText>
//                 <ThemedText style={styles.content}>{item.content}</ThemedText>

//                 <NewsFeedImages
//                     medias={item.medias?.map(uri => `${resourceUrl}/${uri}`) || []}
//                     onPressImage={(uri) => {
//                         setSelectedImage(uri);
//                         setModalVisible(true);
//                     }}
//                 />

//                 <Modal visible={modalVisible} transparent onRequestClose={() => setModalVisible(false)}>
//                     <View style={{
//                         flex: 1,
//                         backgroundColor: 'rgba(0,0,0,0.8)',
//                         justifyContent: 'center',
//                         alignItems: 'center'
//                     }}>
//                         <TouchableOpacity style={{ position: 'absolute', width: '100%', height: '100%' }} onPress={() => setModalVisible(false)} />
//                         {selectedImage && (
//                             <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '70%', borderRadius: 12 }} resizeMode="contain" />
//                         )}
//                     </View>
//                 </Modal>


//                 <View style={styles.acctionRow}>
//                     <TouchableOpacity style={styles.actionButton}>
//                         <Ionicons name='heart-outline' color='#FF5C5C' />
//                         <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.actionButton}>
//                         <Ionicons name='chatbubbles-outline' color='#555'></Ionicons>
//                         <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
//                     </TouchableOpacity>
//                 </View>

//             </ThemedView>
//         );
//     };

//     return (
//         <>
//             <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
//                 <TouchableOpacity style={{ flex: 1, marginRight: 10 }} onPress={() => router.push('/createPost')}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Bạn đang nghĩ gì"
//                         placeholderTextColor="#aaa"
//                         autoCapitalize="none"
//                         editable={false}
//                     />
//                 </TouchableOpacity>

//                 <TouchableOpacity style={{ alignItems: 'center', marginRight: 10 }}>
//                     <Ionicons name="notifications-outline" size={24} color="#333" />
//                     <Text style={{ fontSize: 12 }}>Thông báo</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => router.push('/search')}>
//                     <Ionicons name="search-outline" size={24} color="#333" />
//                     <Text style={{ fontSize: 12 }}>Tìm kiếm</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.boxALl}>
//                 <TouchableOpacity
//                     onPress={() => setCurrentType(KAIZEN_POST_TYPE.ALL)}
//                     style={{
//                         paddingVertical: 6,
//                         paddingHorizontal: 12,
//                         borderRadius: 6,
//                         backgroundColor: currentType === KAIZEN_POST_TYPE.ALL ? "#007AFF" : "transparent",
//                     }}
//                 >
//                     <Text style={{
//                         color: currentType === KAIZEN_POST_TYPE.ALL ? "#fff" : "#333",
//                         fontWeight: "600"
//                     }}>Tất cả</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={() => setCurrentType(KAIZEN_POST_TYPE.NORMAL)}
//                     style={{
//                         paddingVertical: 6,
//                         paddingHorizontal: 12,
//                         borderRadius: 6,
//                         backgroundColor: currentType === KAIZEN_POST_TYPE.NORMAL ? "#007AFF" : "transparent",
//                     }}
//                 >
//                     <Text style={{
//                         color: currentType === KAIZEN_POST_TYPE.NORMAL ? "#fff" : "#333",
//                         fontWeight: "600"
//                     }}>Normal</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={() => setCurrentType(KAIZEN_POST_TYPE.KAIZEN)}
//                     style={{
//                         paddingVertical: 6,
//                         paddingHorizontal: 12,
//                         borderRadius: 6,
//                         backgroundColor: currentType === KAIZEN_POST_TYPE.KAIZEN ? "#007AFF" : "transparent",
//                     }}
//                 >
//                     <Text style={{
//                         color: currentType === KAIZEN_POST_TYPE.KAIZEN ? "#fff" : "#333",
//                         fontWeight: "600"
//                     }}>Kaizen</Text>
//                 </TouchableOpacity>
//             </View>




//             <ThemedView>
//                 <FlatList
//                     data={news}
//                     keyExtractor={(item) => item.id}
//                     renderItem={renderItem}
//                     contentContainerStyle={{}}
//                 />
//             </ThemedView>
//         </>

//     );

// }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff'
//     },
//     card: {
//         top: 30,
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 12,
//         marginBottom: 12,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowOffset: { width: 0, height: 2 },
//         shadowRadius: 4,
//         elevation: 2
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8
//     },
//     avatar: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         backgroundColor: '#ccc'
//     },
//     avatarPlaceholder: {
//         backgroundColor: '#bbb'
//     },
//     userName: {
//         fontWeight: '700',
//         fontSize: 14
//     },
//     time: {
//         fontSize: 12,
//         color: '#555'
//     },
//     content: {
//         fontSize: 12,
//         color: '#333'
//     },
//     acctionRow: {
//         flexDirection: "row",
//         borderTopWidth: 0.5,
//         borderTopColor: "#eee",
//         paddingTop: 6,
//         justifyContent: "flex-start",
//     },
//     actionButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginRight: 16
//     },
//     actionText: {
//         fontSize: 13,
//         marginLeft: 4,
//         color: '#555'
//     },
//     inputContainer: {
//         backgroundColor: '#fff',
//         marginTop: 50,
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 10,
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     input: {
//         fontSize: 16,
//         color: '#333',
//     },
//     boxALl: {
//         flexDirection: "row",
//         justifyContent: "space-around",
//         marginVertical: 10,
//         backgroundColor: "#f5f5f5",
//         borderRadius: 8,
//         paddingVertical: 6,
//         marginHorizontal: 12,
//     },

//     banner: { padding: 12, backgroundColor: "#eee", borderRadius: 8, marginBottom: 10 },
//     bannerTitle: { fontWeight: "bold", marginBottom: 4 },
// })




