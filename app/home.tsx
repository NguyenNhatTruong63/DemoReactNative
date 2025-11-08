// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useEffect, useState } from "react";
// import { FlatList, Image, StyleSheet, TouchableOpacity, View, TextInput, ActivityIndicator } from "react-native";
// import axios from "axios";
// import { useRouter } from 'expo-router';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";

// type UserCreated = {
//   id: string;
//   name: string;
//   avatar: string;
// };

// type NewItem = {
//   id: string;
//   title: string;
//   content: string;
//   created_at: string;
//   likes?: number;
//   comments?: number;
//   user_created: UserCreated;
// };

// export default function NewsFeedScreen() {
//   const router = useRouter();
//   const [news, setNews] = useState<NewItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [resourceUrl, setResourceUrl] = useState<string>('');

//   // Load CONFIG_RESOURCE_URL
//   const loadResourceUrl = async () => {
//     try {
//       const stored = await AsyncStorage.getItem("resource_url");
//       if (stored) {
//         setResourceUrl(stored);
//         return stored;
//       }
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );
//       const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) {
//         await AsyncStorage.setItem("resource_url", url);
//         setResourceUrl(url);
//         return url;
//       }
//       return '';
//     } catch (err) {
//       console.log("Lỗi lấy resourceUrl:", err);
//       return '';
//     }
//   };

//   useEffect(() => {
//     const fetchNews = async () => {
//       setLoading(true);
//       try {
//         const token = await AsyncStorage.getItem("access_token");
//         if (!token) {
//           Toast.show({ type: 'error', text1: 'Vui lòng đăng nhập để xem News Feed' });
//           setLoading(false);
//           return;
//         }

//         await loadResourceUrl();

//         const res = await axios.get(
//           "https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/news-feed",
//           {
//             params: { type: 1, page: 1, limit: 50 },
//             headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
//           }
//         );

//         const list = res.data?.data?.list || [];
//         setNews(list);
//       } catch (err: any) {
//         console.log("Lỗi fetch news:", err);
//         Toast.show({ type: 'error', text1: 'Không thể tải News Feed' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   const renderItem = ({ item }: { item: NewItem }) => {
//     const avatarUri = item.user_created.avatar
//       ? `${resourceUrl}/${item.user_created.avatar}`
//       : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//     return (
//       <ThemedView style={styles.card}>
//         <View style={styles.header}>
//           <Image source={{ uri: avatarUri }} style={styles.avatar} />
//           <View style={{ flex: 1, marginLeft: 10 }}>
//             <ThemedText style={styles.userName}>{item.user_created.name}</ThemedText>
//             <ThemedText style={styles.time}>{item.created_at}</ThemedText>
//           </View>
//         </View>
//         <ThemedText style={styles.userName}>{item.title}</ThemedText>
//         <ThemedText style={styles.content}>{item.content}</ThemedText>
//         <View style={styles.actionRow}>
//           <TouchableOpacity style={styles.actionButton}>
//             <Ionicons name="heart-outline" color="#FF5C5C" />
//             <ThemedText style={styles.actionText}>{item.likes ?? 0}</ThemedText>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.actionButton}>
//             <Ionicons name="chatbubbles-outline" color="#555" />
//             <ThemedText style={styles.actionText}>{item.comments ?? 0}</ThemedText>
//           </TouchableOpacity>
//         </View>
//       </ThemedView>
//     );
//   };

//   if (loading || !resourceUrl) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" />
//         <ThemedText>Đang tải...</ThemedText>
//       </View>
//     );
//   }

//   return (
//     <ThemedView style={{ flex: 1 }}>
//       <View style={styles.inputContainer}>
//         <TouchableOpacity onPress={() => router.push('/createPost')}>
//           <TextInput
//             style={styles.input}
//             placeholder="Bạn đang nghĩ gì"
//             placeholderTextColor="#aaa"
//             editable={false}
//           />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={news}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     margin: 12,
//     borderRadius: 12,
//     padding: 12,
//     backgroundColor: '#fff',
//     elevation: 2,
//   },
//   header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc' },
//   userName: { fontWeight: '700', fontSize: 14 },
//   time: { fontSize: 12, color: '#555' },
//   content: { fontSize: 12, color: '#333', marginVertical: 4 },
//   actionRow: { flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#eee', paddingTop: 6 },
//   actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
//   actionText: { fontSize: 13, marginLeft: 4, color: '#555' },
//   inputContainer: { padding: 12, backgroundColor: '#fff', marginTop: 50, borderRadius: 10 },
//   input: { fontSize: 16, color: '#333' },
// });


import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function UserDetailScreen() {
  const { id, userData } = useLocalSearchParams();
  const router = useRouter();
  const parsedUserData = userData ? JSON.parse(userData as string) : null;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(parsedUserData || null);
  const [resourceUrl, setResourceUrl] = useState<string>("");

  const [name, setName] = useState(user?.name || "");
  const [birthday, setBirthday] = useState(user?.birthday || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Chuyển ngày sang DD/MM/YYYY
  const fixDate = (d: string) => {
    const [dd, mm, yyyy] = d.split("/");
    return `${String(dd).padStart(2, "0")}/${Number(mm)}/${yyyy}`;
  };

  useEffect(() => {
    const loadResourceUrl = async () => {
      const storedResource = await AsyncStorage.getItem("resource_url");
      if (storedResource) setResourceUrl(storedResource);
      else {
        const publicRes = await axios.get(
          "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
          { headers: { "x-svc-id": 1153 } }
        );
        const url = publicRes.data.data.CONFIG_RESOURCE_URL;
        setResourceUrl(url);
        await AsyncStorage.setItem("resource_url", url);
      }
      setLoading(false);
    };
    loadResourceUrl();
  }, []);

  const avatarUrl = avatar
    ? `${resourceUrl}/${avatar}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const handleUpdate = async () => {
    const finalUser = { ...user, name, birthday, email, phone, address, avatar };

    // Lưu local để PersonScreen đồng bộ
    const storedUsers = await AsyncStorage.getItem("user_list");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    users = users.map((u: any) => (u.id === user.id ? finalUser : u));
    await AsyncStorage.setItem("user_list", JSON.stringify(users));

    setUser(finalUser);

    Toast.show({ type: "success", text1: "Cập nhật thành công!" });

    // Quay lại PersonScreen với dữ liệu mới
    router.push({
      pathname: "/(tabs)/person",
      params: { userData: JSON.stringify(finalUser) },
    });
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cập nhật thông tin</Text>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />

      <Field label="Họ và tên" value={name} onChange={setName} />
      <Field label="Ngày sinh (DD/MM/YYYY)" value={birthday} onChange={setBirthday} />
      <Field label="Email" value={email} onChange={setEmail} />
      <Field label="Số điện thoại" value={phone} onChange={setPhone} />
      <Field label="Địa chỉ" value={address} onChange={setAddress} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (txt: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 20 },
  field: { marginBottom: 15 },
  label: { fontSize: 15, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 10 },
  button: { backgroundColor: "#1E90FF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 30, marginBottom: 40 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});