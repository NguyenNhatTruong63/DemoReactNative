// // components/UserAvatar.tsx
// import React, { useState, useEffect, useCallback } from "react";
// import { Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import Toast from "react-native-toast-message";



// type User = {
//   id: string;
//   name: string;
//   departments: string;
//   avatar: string;
// };

// type UserAvatarProps = {
//   user: User;
//   size?: number;
//   onPress?: () => void;
// };

// export default function UserAvatar({ user, size = 40, onPress }: UserAvatarProps) {
//   const [avatarUri, setAvatarUri] = useState<string | null>(null);
//   const [resourceUrl, setResourceUrl] = useState<string>('');
//   const [loading, setLoading] = useState(true);

//   const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem('resource_url');
//       if (storedResource) {
//         setResourceUrl(storedResource);
//         return storedResource;
//       }
//       const res = await axios.get(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//         { headers: { 'x-svc-id': 1153 } }
//       );
//       const url = res.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) {
//         await AsyncStorage.setItem('resource_url', url);
//         setResourceUrl(url);
//         return url;
//       }
//       return '';
//     } catch (err) {
//       console.log('Lỗi lấy resource URL:', err);
//       return '';
//     }
//   };

//   const loadAvatar = useCallback(async () => {
//     setLoading(true);
//     try {
//       await loadResourceUrl();
//       const storedUser = await AsyncStorage.getItem('user_info');
//       if (storedUser) {
//         const userData: User = JSON.parse(storedUser);
//         if (userData.avatar) setAvatarUri(`${resourceUrl}/${userData.avatar}`);
//       }
//     } catch (err) {
//       console.log('Lỗi load avatar:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [resourceUrl]);

//   useEffect(() => {
//     loadAvatar();
//   }, [loadAvatar]);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setAvatarUri(uri);
//       await uploadAvatar(uri);
//     }
//   };

//   const uploadAvatar = async (uri: string) => {
//     try {
//       const formData = new FormData();
//       formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
//       formData.append("types", "1");

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data", "x-svc-id": 1167 } }
//       );

//       const path = res.data?.data?.[0];
//       if (!path) throw new Error("Upload thất bại");

//       const token = await AsyncStorage.getItem("access_token");
//       await axios.post(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${user.id}/update`,
//         { ...user, avatar: path },
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );

//       await AsyncStorage.setItem("user_info", JSON.stringify({ ...user, avatar: path }));
//       const resource = await AsyncStorage.getItem("resource_url");
//       setAvatarUri(`${resource}/${path}`);
//       Toast.show({ type: "success", text1: "Cập nhật avatar thành công" });
//     } catch (err: any) {
//       console.log("Lỗi upload avatar:", err.response?.data || err.message);
//       Toast.show({ type: "error", text1: "Upload thất bại" });
//     }
//   };

//   if (loading) return <ActivityIndicator />;

//   return (
//     <TouchableOpacity
//       onPress={onPress ?? pickImage}
//       style={{ width: size, height: size, borderRadius: size / 2 }}
//     >
//       <Image
//         source={{ uri: avatarUri ?? "https://cdn-icons-png.flaticon.com/512/847/847969.png" }}
//         style={{ width: size, height: size, borderRadius: size / 2 }}
//       />
//     </TouchableOpacity>
//   );
// }

// import React, { useState, useEffect, useCallback } from "react";
// import { Image, TouchableOpacity, StyleSheet, ActivityIndicator, View, Text, TextInput } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";
// import Toast from "react-native-toast-message";


// export default function AvatarScreen() {

//   return (
//     <View>
//       <TouchableOpacity>
//         <View>
//           <Image></Image>
//         </View>
//       </TouchableOpacity>
//       <View>
//         <Text>Họ và tên</Text>
//         <TextInput></TextInput>
//       </View>
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#edf0f4ff'
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 20
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: "center",
//     marginBottom: 20
//   },
//   field: {
//     marginBottom: 15
//   },
//   label: {
//     fontSize: 15,
//     marginBottom: 6
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#161616ff",
//     padding: 12,
//     borderRadius: 10
//   },
//   button: {
//     backgroundColor: "#1E90FF",
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 30,
//     marginBottom: 40
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700"
//   },
// })


import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";
import AvatarPicker from "./AvatarPicker";
import { Stack } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";


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
  const [gender, setGender] = useState(user?.gender || "");
  const [departments, setDepartments] = useState(user?.departments || "");
  const navigation = useNavigation()

  // Chuyển ngày sang DD/MM/YYYY
  const fixDate = (d: string) => {
    const [dd, mm, yyyy] = d.split("/");
    return `${String(dd).padStart(2, "0")}/${Number(mm)}/${yyyy}`;
  };
  

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chi tiết người dùng", 
    });
  }, [navigation]);

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
    const finalUser = { ...user, name, birthday, email, phone, address, avatar, departments };

    // Lưu local để PersonScreen đồng bộ
    const storedUsers = await AsyncStorage.getItem("user_list");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    users = users.map((u: any) => (u.id === user.id ? finalUser : u));
    await AsyncStorage.setItem("user_list", JSON.stringify(users));

    setUser(finalUser);

    Toast.show({ type: "success", text1: "Cập nhật thành công!" });

    // Quay lại PersonScreen với dữ liệu mới
    router.replace({
      pathname: "/(tabs)/person",
      params: { userData: JSON.stringify(finalUser) },
    });

  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.title}>Cập nhật thông tin</Text> */}
      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      <AvatarPicker></AvatarPicker>

      <Field label="Họ và tên" value={name} onChange={setName} />
      <Field label="Ngày sinh (DD/MM/YYYY)" value={birthday} onChange={setBirthday} />
      <Field label="Giới tính (0: Nữ, 1: Nam)" value={gender} onChange={setGender}/>
      <Field label="Email" value={email} onChange={setEmail} />
      <Field label="Số điện thoại" value={phone} onChange={setPhone} />
      <Field label="Địa chỉ" value={address} onChange={setAddress} />
      <Field label="Phòng ban" value={departments} onChange={setDepartments}/>
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
  container: { padding: 20, backgroundColor: '#edf0f4ff' },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: "center", marginBottom: 20 },
  field: { marginBottom: 15 },
  label: { fontSize: 15, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#161616ff", padding: 12, borderRadius: 10 },
  button: { backgroundColor: "#1E90FF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 30, marginBottom: 40 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

