// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AvatarPicker from "./AvatarPicker";
// import { Stack } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { useLayoutEffect } from "react";



// export default function UserDetailScreen() {
//   const { id, userData } = useLocalSearchParams();
//   const router = useRouter();
//   const parsedUserData = userData ? JSON.parse(userData as string) : null;

//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<any>(parsedUserData || null);
//   const [resourceUrl, setResourceUrl] = useState<string>("");

//   const [name, setName] = useState(user?.name || "");
//   const [birthday, setBirthday] = useState(user?.birthday || "");
//   const [email, setEmail] = useState(user?.email || "");
//   const [phone, setPhone] = useState(user?.phone || "");
//   const [address, setAddress] = useState(user?.address || "");
//   const [avatar, setAvatar] = useState(user?.avatar || "");
//   const [gender, setGender] = useState(user?.gender || "");
//   const [departments, setDepartments] = useState(user?.departments || "");
//   const navigation = useNavigation()

//   // Chuyển ngày sang DD/MM/YYYY
//   const fixDate = (d: string) => {
//     const [dd, mm, yyyy] = d.split("/");
//     return `${String(dd).padStart(2, "0")}/${Number(mm)}/${yyyy}`;
//   };


//   useLayoutEffect(() => {
//     navigation.setOptions({
//       title: "Chi tiết người dùng", 
//     });
//   }, [navigation]);

//   useEffect(() => {
//     const loadResourceUrl = async () => {
//       const storedResource = await AsyncStorage.getItem("resource_url");
//       if (storedResource) setResourceUrl(storedResource);
//       else {
//         const publicRes = await axios.get(
//           "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//           { headers: { "x-svc-id": 1153 } }
//         );
//         const url = publicRes.data.data.CONFIG_RESOURCE_URL;
//         setResourceUrl(url);
//         await AsyncStorage.setItem("resource_url", url);
//       }
//       setLoading(false);
//     };
//     loadResourceUrl();
//   }, []);

//   const avatarUrl = avatar
//     ? `${resourceUrl}/${avatar}`
//     : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//   const handleUpdate = async () => {
//     const finalUser = { ...user, name, birthday, email, phone, address, avatar, departments };

//     // Lưu local để PersonScreen đồng bộ
//     const storedUsers = await AsyncStorage.getItem("user_list");
//     let users = storedUsers ? JSON.parse(storedUsers) : [];
//     users = users.map((u: any) => (u.id === user.id ? finalUser : u));
//     await AsyncStorage.setItem("user_list", JSON.stringify(users));

//     setUser(finalUser);

//     Toast.show({ type: "success", text1: "Cập nhật thành công!" });

//     // Quay lại PersonScreen với dữ liệu mới
//     router.replace({
//       pathname: "/(tabs)/person",
//       params: { userData: JSON.stringify(finalUser) },
//     });

//   };

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* <Text style={styles.title}>Cập nhật thông tin</Text> */}
//       <Image source={{ uri: avatarUrl }} style={styles.avatar} />
//       <AvatarPicker></AvatarPicker>

//       <Field label="Họ và tên" value={name} onChange={setName} />
//       <Field label="Ngày sinh (DD/MM/YYYY)" value={birthday} onChange={setBirthday} />
//       <Field label="Giới tính (0: Nữ, 1: Nam)" value={gender} onChange={setGender}/>
//       <Field label="Email" value={email} onChange={setEmail} />
//       <Field label="Số điện thoại" value={phone} onChange={setPhone} />
//       <Field label="Địa chỉ" value={address} onChange={setAddress} />
//       <Field label="Phòng ban" value={departments} onChange={setDepartments}/>
//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         <Text style={styles.buttonText}>Cập nhật</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// function Field({ label, value, onChange }: { label: string; value: string; onChange: (txt: string) => void }) {
//   return (
//     <View style={styles.field}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput style={styles.input} value={value} onChangeText={onChange} />
//     </View>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import AvatarPicker from "./AvatarPicker";
// import { Stack } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { useLayoutEffect } from "react";
// import { Button } from "@react-navigation/elements";
// import { Ionicons } from "@expo/vector-icons";




// export default function UserDetailScreen() {
//   const router = useRouter()
//   const [name, setName] = useState("")
//   const [birthday, setBirthday] = useState("")
//   const [gender, setGender] = useState("")
//   const [phone, setPhone] = useState("")
//   const [email, setEmail] = useState("")
//   const [CCCD, setCCCD] = useState("")
//   const [address, setAddress] = useState("")
//   const [departments, setDepartments] = useState("")


//   const handleUpdate = async () =>{

//   }

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <View style={{ alignSelf: "center", position: "relative", marginBottom: 10 }}>
//           <TouchableOpacity>
//             <Image source={{}} style={styles.avatar} />
//             <Ionicons name="camera" size={25} color="#007AFF" style={styles.iconCamera} />
//           </TouchableOpacity>
//         </View>
//         <View>
//           <Text style={styles.label}>Họ và tên</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập họ và tên"
//             value={name}
//             onChangeText={setName}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Ngày sinh</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập ngày sinh(DD/MM/YY)"
//             value={birthday}
//             onChangeText={setBirthday}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Giới tính</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập giới tính"
//             value={gender}
//             onChangeText={setGender}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Số điện thoại</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập số điện thoại"
//             value={phone}
//             onChangeText={setPhone}
//             keyboardType="phone-pad"
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Email</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>CCCD</Text>
//           <TextInput style={styles.input}
//             placeholder="Nhập CCCD"
//             value={CCCD}
//             onChangeText={setCCCD}
//             keyboardType="numeric"
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Địa chỉ</Text>
//           <TextInput style={styles.input}
//             placeholder="Địa chỉ"
//             value={address}
//             onChangeText={setAddress}
//           />
//         </View>
//         <View>
//           <Text style={styles.label}>Bộ phận</Text>
//           <TextInput style={styles.input}
//             placeholder="Bộ phận"
//             value={departments}
//             onChangeText={setDepartments}
//           />

//         </View>
//         <View>
//           <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//             <Text style={styles.buttonText}>Cập nhập</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>

//   )
// };

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
//   iconCamera: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 2,
//   }
// })


// import React, { useState, useEffect } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// type InputProps = {
//   label: string;
//   value: string;
//   onChange: (text: string) => void;
//   placeholder?: string;
//   keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
// };

// const Input = ({ label, value, onChange, placeholder, keyboardType }: InputProps) => (
//   <View style={{ marginBottom: 12 }}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       value={value}
//       onChangeText={onChange}
//       placeholder={placeholder || `Nhập ${label}`}
//       keyboardType={keyboardType || "default"}
//       style={styles.input}
//     />
//   </View>
// );

// type Params = {
//   id: string;
//   userData?: string;
// };

// export default function UserDetailScreen() {
//   const router = useRouter();
//   const { id, userData } = useLocalSearchParams() as Params;
//   const parsedUser = userData ? JSON.parse(userData) : null;

//   const [loading, setLoading] = useState(false);
//   const [initLoading, setInitLoading] = useState(true);

//   const [token, setToken] = useState("");
//   const [CONFIG_RESOURCE_URL, setCONFIG_RESOURCE_URL] = useState("");

//   const [avatar, setAvatar] = useState(""); // avatar path từ API
//   const [avatarUri, setAvatarUri] = useState(""); // avatar hiển thị trực tiếp
//   const [name, setName] = useState(parsedUser?.name || "");
//   const [birthday, setBirthday] = useState(parsedUser?.birthday || "");
//   const [gender, setGender] = useState(parsedUser?.gender?.toString() || "1");
//   const [phone, setPhone] = useState(parsedUser?.phone || "");
//   const [email, setEmail] = useState(parsedUser?.email || "");
//   const [CCCD, setCCCD] = useState(parsedUser?.id_card_number || "");
//   const [address, setAddress] = useState(parsedUser?.address || "");
//   const [departments, setDepartments] = useState(parsedUser?.department || "");

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     try {
//       const t = await AsyncStorage.getItem("access_token");
//       if (!t) {
//         Toast.show({ type: "error", text1: "Không tìm thấy token" });
//         setInitLoading(false);
//         return;
//       }
//       setToken(t);
//       await fetchPublicConfig();
//       await fetchUserDetail(id, t);
//     } catch (err) {
//       console.log("INIT ERROR:", err);
//       Toast.show({ type: "error", text1: "Lỗi khởi tạo" });
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const fetchPublicConfig = async () => {
//     try {
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );
//       const cfg = res?.data?.data?.CONFIG_RESOURCE_URL ?? "";
//       setCONFIG_RESOURCE_URL(cfg);
//     } catch (err) {
//       console.log("CONFIG ERROR", err);
//     }
//   };

//   const fetchUserDetail = async (userId: string, token: string) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/detail?id=${userId}`,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );
//       const d = res?.data?.data;
//       setName(d?.name || "");
//       setBirthday(d?.birthday || "");
//       setGender(d?.gender?.toString() || "1");
//       setPhone(d?.phone || "");
//       setEmail(d?.email || "");
//       setCCCD(d?.id_card_number || "");
//       setAddress(d?.address || "");
//       setDepartments(d?.department || "");
//       setAvatar(d?.avatar || "");
//       // hiển thị avatar ngay
//       setAvatarUri(d?.avatar ? `${CONFIG_RESOURCE_URL}/${d.avatar}` : "");
//     } catch (err) {
//       console.log("FETCH USER ERROR", err);
//       Toast.show({ type: "error", text1: "Không tải được thông tin người dùng" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setAvatarUri(uri);
//       setAvatar(uri); // dùng avatar này để gửi lên API
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       setLoading(true);
//       const body = {
//         name,
//         birthday,
//         gender: Number(gender),
//         avatar,
//         phone,
//         address,
//         id_card_number: CCCD,
//         email,
//         department: departments,
//       };
//       await axios.post(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
//         body,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );
//       Toast.show({ type: "success", text1: "Cập nhật thành công" });
//       router.push("/(tabs)/person");
//     } catch (err: any) {
//       console.log("UPDATE ERROR", err);
//       Toast.show({ type: "error", text1: "Cập nhật thất bại", text2: err?.response?.data?.message || "" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (initLoading)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );

//   return (
//     <ScrollView style={{ padding: 20, backgroundColor: "#edf0f4ff" }}>
//       <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }} onPress={pickImage}>
//         <Image source={{ uri: avatarUri || "https://cdn-icons-png.flaticon.com/512/847/847969.png" }} style={styles.avatar} />
//         <Ionicons name="camera" size={25} color="#007AFF" style={styles.iconCamera} />
//       </TouchableOpacity>

//       <Input label="Họ và tên" value={name} onChange={setName} />
//       <Input label="Ngày sinh" value={birthday} onChange={setBirthday} placeholder="DD/MM/YYYY" />
//       <Input label="Giới tính" value={gender} onChange={setGender} />
//       <Input label="Số điện thoại" value={phone} onChange={setPhone} keyboardType="phone-pad" />
//       <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
//       <Input label="CCCD" value={CCCD} onChange={setCCCD} keyboardType="numeric" />
//       <Input label="Địa chỉ" value={address} onChange={setAddress} />
//       <Input label="Bộ phận" value={departments} onChange={setDepartments} />

//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cập nhật</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   avatar: { width: 120, height: 120, borderRadius: 60 },
//   iconCamera: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 },
//   label: { fontSize: 15, marginBottom: 6 },
//   input: { borderWidth: 1, borderColor: "#161616", padding: 12, borderRadius: 10, marginBottom: 12, backgroundColor: "#fff" },
//   button: { backgroundColor: "#007AFF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 25, marginBottom: 40 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



// import React, { useState, useEffect } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";

// type Params = {
//   id: string;
//   userData?: string;
// };

// export default function UserDetailScreen() {
//   const router = useRouter();
//   const { id, userData } = useLocalSearchParams() as Params;
//   const parsedUser = userData ? JSON.parse(userData) : null;

//   const [loading, setLoading] = useState(false);
//   const [initLoading, setInitLoading] = useState(true);

//   const [token, setToken] = useState("");
//   const [CONFIG_RESOURCE_URL, setCONFIG_RESOURCE_URL] = useState("");

//   const [avatar, setAvatar] = useState("");
//   const [name, setName] = useState(parsedUser?.name || "");
//   const [birthday, setBirthday] = useState(parsedUser?.birthday || "");
//   const [gender, setGender] = useState(parsedUser?.gender?.toString() || "1");
//   const [phone, setPhone] = useState(parsedUser?.phone || "");
//   const [email, setEmail] = useState(parsedUser?.email || "");
//   const [CCCD, setCCCD] = useState(parsedUser?.id_card_number || "");
//   const [address, setAddress] = useState(parsedUser?.address || "");
//   const [departmentId, setDepartmentId] = useState(parsedUser?.department_id || 1);
//   const [departmentName, setDepartmentName] = useState(parsedUser?.department_name || "");

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     try {
//       const t = await AsyncStorage.getItem("access_token");
//       if (!t) {
//         Toast.show({ type: "error", text1: "Không tìm thấy token" });
//         setInitLoading(false);
//         return;
//       }
//       setToken(t);
//       await fetchPublicConfig();
//       await fetchUserDetail(id, t);
//     } catch (err) {
//       console.log("INIT ERROR:", err);
//       Toast.show({ type: "error", text1: "Lỗi khởi tạo" });
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const fetchPublicConfig = async () => {
//     try {
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );
//       const cfg = res?.data?.data?.CONFIG_RESOURCE_URL ?? "";
//       setCONFIG_RESOURCE_URL(cfg);
//     } catch (err) {
//       console.log("CONFIG ERROR", err);
//     }
//   };

//   const fetchUserDetail = async (userId: string, token: string) => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/detail?id=${userId}`,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );
//       const d = res?.data?.data;
//       console.log("FETCH USER SUCCESS:", d);

//       setName(d?.name || "");
//       setBirthday(d?.birthday || "");
//       setGender(d?.gender?.toString() || "1");
//       setPhone(d?.phone || "");
//       setEmail(d?.email || "");
//       setCCCD(d?.id_card_number || "");
//       setAddress(d?.address || "");
//       setDepartmentId(d?.department_id || 1);
//       setDepartmentName(d?.department_name || "");
//       setAvatar(d?.avatar || "");
//     } catch (err) {
//       console.log("FETCH USER ERROR", err);
//       Toast.show({ type: "error", text1: "Không tải được thông tin người dùng" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: "images",
//       quality: 0.7,
//     });
//     if (!result.canceled) {
//       const localUri = result.assets[0].uri;
//       setAvatar(localUri);

//       // Upload ảnh lên server
//       await uploadAvatar(localUri);
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

//       const path = res?.data?.data?.[0];
//       console.log("UPLOAD AVATAR SUCCESS:", path);

//       if (path) setAvatar(`${CONFIG_RESOURCE_URL}/${path}`);
//     } catch (err) {
//       console.log("UPLOAD AVATAR ERROR:", err);
//       Toast.show({ type: "error", text1: "Upload avatar thất bại" });
//     }
//   };

//   // const handleUpdate = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const body = {
//   //       name,
//   //       birthday,
//   //       gender: Number(gender),
//   //       avatar,
//   //       phone,
//   //       address,
//   //       id_card_number: CCCD,
//   //       email,
//   //       department_id: departmentId,
//   //     };
//   //     console.log("UPDATE REQUEST BODY:", body);

//   //     const res = await axios.post(
//   //       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
//   //       body,
//   //       { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//   //     );
//   //     console.log("UPDATE RESPONSE:", res.data);
//   //     Toast.show({ type: "success", text1: "Cập nhật thành công" });
//   //     router.push("/(tabs)/person");
//   //   } catch (err: any) {
//   //     console.log("UPDATE ERROR:", err.response?.data || err);
//   //     Toast.show({ type: "error", text1: "Cập nhật thất bại", text2: err?.response?.data?.message || "" });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleUpdate = async () => {
//   try {
//     setLoading(true);

//     const body = {
//       name,
//       birthday,
//       gender: Number(gender),
//       avatar,
//       phone,
//       address,
//       id_card_number: CCCD,
//       email,
//       department_id: parsedUser?.department_id || 1, // giữ nguyên nếu có
//     };

//     console.log("LOG UPDATE REQUEST BODY:", body);

//     const res = await axios.post(
//       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
//       body,
//       { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//     );

//     console.log("LOG UPDATE RESPONSE:", res.data);

//     Toast.show({ type: 'success', text1: 'Cập nhật thành công' });

//     // Gọi lại API để lấy thông tin mới nhất
//     const userRes = await axios.get(
//       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/detail?id=${id}`,
//       { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//     );

//     const updatedUser = userRes.data?.data;
//     console.log("FETCH UPDATED USER SUCCESS:", updatedUser);

//     // Điều hướng sang trang hiển thị thông tin vừa cập nhật
//     router.push({
//       pathname: '/UpdatedUserScreen',
//       params: { userData: JSON.stringify({ ...updatedUser, resourceUrl: CONFIG_RESOURCE_URL }) },
//     });

//   } catch (err: any) {
//     console.log("UPDATE ERROR", err);
//     Toast.show({
//       type: "error",
//       text1: "Cập nhật thất bại",
//       text2: err?.response?.data?.message || "",
//     });
//   } finally {
//     setLoading(false);
//   }
// };


//   if (initLoading)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );

//   const avatarUrl = avatar.startsWith("http") ? avatar : CONFIG_RESOURCE_URL ? `${CONFIG_RESOURCE_URL}/${avatar}` : "";

//   return (
//     <ScrollView style={{ padding: 20, backgroundColor: "#edf0f4ff" }}>
//       <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }} onPress={pickImage}>
//         <Image source={{ uri: avatarUrl || "" }} style={styles.avatar} />
//         <Ionicons name="camera" size={25} color="#007AFF" style={styles.iconCamera} />
//       </TouchableOpacity>

//       <Input label="Họ và tên" value={name} onChange={setName} />
//       <Input label="Ngày sinh" value={birthday} onChange={setBirthday} placeholder="DD/MM/YYYY" />
//       <Input label="Giới tính" value={gender} onChange={setGender} />
//       <Input label="Số điện thoại" value={phone} onChange={setPhone} keyboardType="phone-pad" />
//       <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
//       <Input label="CCCD" value={CCCD} onChange={setCCCD} keyboardType="numeric" />
//       <Input label="Địa chỉ" value={address} onChange={setAddress} />
//       <Input label="Bộ phận" value={departmentName} onChange={setDepartmentName} />

//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cập nhật</Text>}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const Input = ({ label, value, onChange, placeholder, keyboardType }: any) => (
//   <View style={{ marginBottom: 12 }}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       value={value}
//       onChangeText={onChange}
//       placeholder={placeholder || `Nhập ${label}`}
//       keyboardType={keyboardType || "default"}
//       style={styles.input}
//     />
//   </View>
// );

// const styles = StyleSheet.create({
//   avatar: { width: 120, height: 120, borderRadius: 60 },
//   iconCamera: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 },
//   label: { fontSize: 15, marginBottom: 6 },
//   input: { borderWidth: 1, borderColor: "#161616", padding: 12, borderRadius: 10, marginBottom: 12, backgroundColor: "#fff" },
//   button: { backgroundColor: "#007AFF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 25, marginBottom: 40 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });



// import React, { useState, useEffect } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// type InputProps = {
//   label: string;
//   value: string;
//   onChange: (text: string) => void;
//   placeholder?: string; // dấu ? nghĩa là tùy chọn
//   keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
// };

// const Input = ({ label, value, onChange, placeholder, keyboardType }: InputProps) => (
//   <View style={{ marginBottom: 12 }}>
//     <Text style={styles.label}>{label}</Text>
//     <TextInput
//       value={value}
//       onChangeText={onChange}
//       placeholder={placeholder || `Nhập ${label}`} // dùng mặc định nếu không truyền
//       keyboardType={keyboardType || "default"} // dùng mặc định nếu không truyền
//       style={styles.input}
//     />
//   </View>
// );


// export default function UserDetailScreen() {
//   const router = useRouter();
//   const { id } = useLocalSearchParams();

//   const [initLoading, setInitLoading] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const [token, setToken] = useState("");
//   const [CONFIG_RESOURCE_URL, setCONFIG_RESOURCE_URL] = useState("");

//   const [avatar, setAvatar] = useState("");
//   const [name, setName] = useState("");
//   const [birthday, setBirthday] = useState("");
//   const [gender, setGender] = useState("1");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [CCCD, setCCCD] = useState("");
//   const [address, setAddress] = useState("");
//   const [department_id, setDepartmentId] = useState(1);
//   const [department_name, setDepartmentName] = useState("");
//   const [branches, setBranches] = useState([]);

//   useEffect(() => {
//     init();
//   }, []);

//   const init = async () => {
//     try {
//       const t = await AsyncStorage.getItem("access_token");
//       if (!t) {
//         Toast.show({ type: "error", text1: "Không tìm thấy token" });
//         setInitLoading(false);
//         return;
//       }
//       setToken(t);

//       await fetchPublicConfig();
//       await fetchUserDetail();
//     } catch (err) {
//       console.log("INIT ERROR:", err);
//       Toast.show({ type: "error", text1: "Lỗi khởi tạo" });
//     } finally {
//       setInitLoading(false);
//     }
//   };

//   const fetchPublicConfig = async () => {
//     try {
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );
//       const cfg = res?.data?.data?.CONFIG_RESOURCE_URL ?? "";
//       setCONFIG_RESOURCE_URL(cfg);
//       console.log("CONFIG_RESOURCE_URL:", cfg);
//     } catch (err) {
//       console.log("CONFIG ERROR:", err);
//     }
//   };

//   const fetchUserDetail = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/detail?id=${id}`,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );

//       const d = res?.data?.data;
//       console.log("FETCH USER SUCCESS:", d);

//       setName(d?.name || "");
//       setBirthday(d?.birthday || "");
//       setGender(d?.gender?.toString() || "1");
//       setPhone(d?.phone || "");
//       setEmail(d?.email || "");
//       setCCCD(d?.id_card_number || "");
//       setAddress(d?.address || "");
//       setDepartmentId(d?.department_id || 1);
//       setDepartmentName(d?.department_name || "");
//       setAvatar(d?.avatar || "");
//       setBranches(d?.branches || []);
//     } catch (err) {
//       console.log("FETCH USER ERROR:", err);
//       Toast.show({ type: "error", text1: "Không tải được thông tin người dùng" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const pickImage = async () => {
//   //   const result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//   //     quality: 0.7,
//   //   });
//   //   if (!result.canceled) {
//   //     setAvatar(result.assets[0].uri);
//   //   }
//   // };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       const localUri = result.assets[0].uri;

//       // Upload lên API và nhận path trả về
//       const formData = new FormData();
//       formData.append("files", { uri: localUri, name: "avatar.jpg", type: "image/jpeg" } as any);
//       formData.append("types", "1");

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data", "x-svc-id": 1153 } }
//       );

//       const avatarPath = res.data?.data?.[0];
//       if (avatarPath) {
//         setAvatar(`${CONFIG_RESOURCE_URL}/${avatarPath}`); // hiển thị ngay
//       }
//     }
//   };


//   const handleUpdate = async () => {
//     try {
//       setLoading(true);

//       const body = {
//         name,
//         birthday,
//         gender: Number(gender),
//         avatar,
//         phone,
//         address,
//         id_card_number: CCCD,
//         email,
//         department_id,
//       };

//       console.log("LOG UPDATE REQUEST BODY:", body);

//       const res = await axios.post(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
//         body,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );

//       console.log("LOG UPDATE RESPONSE:", res.data);

//       Toast.show({ type: "success", text1: "Cập nhật thành công" });

//       // Lấy dữ liệu mới nhất để hiển thị
//       await fetchUserDetail();

//       // Điều hướng sang trang UpdatedUser
//       router.push({
//         pathname: "/UpdatedUserScreen",
//         params: {
//           userData: JSON.stringify({
//             id,
//             name,
//             birthday,
//             gender,
//             avatar,
//             phone,
//             address,
//             id_card_number: CCCD,
//             email,
//             department_id,
//             department_name,
//             branches,
//             resourceUrl: CONFIG_RESOURCE_URL,
//           }),
//         },
//       });
//     } catch (err: any) {
//       console.log("UPDATE ERROR:", err.response?.data || err.message || err);
//       Toast.show({
//         type: "error",
//         text1: "Cập nhật thất bại",
//         text2: err?.response?.data?.message || "",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (initLoading)
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );

//   const avatarUrl =
//     avatar.startsWith("http") || avatar.startsWith("https")
//       ? avatar
//       : CONFIG_RESOURCE_URL
//         ? `${CONFIG_RESOURCE_URL}/${avatar}`
//         : "";

//   return (
//     <ScrollView style={{ padding: 20, backgroundColor: "#edf0f4ff" }}>
//       <TouchableOpacity
//         style={{ alignSelf: "center", marginBottom: 20 }}
//         onPress={pickImage}
//       >
//         <Image source={{ uri: avatarUrl || "" }} style={styles.avatar} />
//         <Ionicons
//           name="camera"
//           size={25}
//           color="#007AFF"
//           style={styles.iconCamera}
//         />
//       </TouchableOpacity>

//       <Input label="Họ và tên" value={name} onChange={setName} />
//       <Input label="Ngày sinh" value={birthday} onChange={setBirthday} placeholder="DD/MM/YYYY" />
//       <Input label="Giới tính" value={gender} onChange={setGender} />
//       <Input label="Số điện thoại" value={phone} onChange={setPhone} keyboardType="phone-pad" />
//       <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
//       <Input label="CCCD" value={CCCD} onChange={setCCCD} keyboardType="numeric" />
//       <Input label="Địa chỉ" value={address} onChange={setAddress} />
//       <Input label="Bộ phận" value={department_name} onChange={setDepartmentName} />

//       {/* <Text style={{ fontWeight: "700", marginTop: 12 }}>Chi nhánh:</Text>
//       {branches.map((b) => (
//         <Text key={b.id}>{b.name} - {b.address}</Text>
//       ))} */}

//       <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Cập nhật</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   avatar: { width: 120, height: 120, borderRadius: 60 },
//   iconCamera: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 2,
//   },
//   label: { fontSize: 15, marginBottom: 6 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#161616",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     backgroundColor: "#fff",
//   },
//   button: {
//     backgroundColor: "#007AFF",
//     paddingVertical: 15,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 25,
//     marginBottom: 40,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
// });


import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import AvatarPicker from "./AvatarPicker";

type Params = {
  id: string;
  userData?: string;
};

export default function UserDetailScreen() {
  const router = useRouter();
  const { id, userData } = useLocalSearchParams() as Params;
  const parsedUser = userData ? JSON.parse(userData) : null;

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState("");
  const [CONFIG_RESOURCE_URL, setCONFIG_RESOURCE_URL] = useState("");

  const [avatar, setAvatar] = useState(""); // path từ server
  const [name, setName] = useState(parsedUser?.name || "");
  const [birthday, setBirthday] = useState(parsedUser?.birthday || "");
  const [joining_date, setJoining_date] = useState(parsedUser?.joining_date || "");
  const [gender, setGender] = useState(parsedUser?.gender?.toString() || "1");
  const [phone, setPhone] = useState(parsedUser?.phone || "");
  const [email, setEmail] = useState(parsedUser?.email || "");
  const [CCCD, setCCCD] = useState(parsedUser?.id_card_number || "");
  const [address, setAddress] = useState(parsedUser?.address || "");
  const [departmentName, setDepartmentName] = useState(parsedUser?.department_name || "");

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const t = await AsyncStorage.getItem("access_token");
      if (!t) {
        Toast.show({ type: "error", text1: "Không tìm thấy token" });
        setInitLoading(false);
        return;
      }
      setToken(t);

      await fetchPublicConfig();
      await fetchUserDetail(id, t);
    } catch (err) {
      console.log("INIT ERROR:", err);
      Toast.show({ type: "error", text1: "Lỗi khởi tạo" });
    } finally {
      setInitLoading(false);
    }
  };

  const fetchPublicConfig = async () => {
    try {
      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
        { headers: { "x-svc-id": 1153 } }
      );
      const cfg = res?.data?.data?.CONFIG_RESOURCE_URL ?? "";
      setCONFIG_RESOURCE_URL(cfg);
      console.log("CONFIG_RESOURCE_URL:", cfg);
    } catch (err) {
      console.log("CONFIG ERROR", err);
    }
  };

  const fetchUserDetail = async (userId: string, token: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/detail?id=${userId}`,
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );
      const d = res?.data?.data;
      console.log("FETCH USER SUCCESS:", d);

      setName(d?.name || "");
      setBirthday(d?.birthday || "");
      setBirthday(d?.joining_date || "");
      setGender(d?.gender?.toString() || "1");
      setPhone(d?.phone || "");
      setEmail(d?.email || "");
      setCCCD(d?.id_card_number || "");
      setAddress(d?.address || "");
      setDepartmentName(d?.department_name || "");
      setAvatar(d?.avatar || "");
    } catch (err) {
      console.log("FETCH USER ERROR", err);
      Toast.show({ type: "error", text1: "Không tải được thông tin người dùng" });
    } finally {
      setLoading(false);
    }
  };

  // const pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: "images",
  //     quality: 0.7,
  //   });

  //   if (!result.canceled) {
  //     const localUri = result.assets[0].uri;
  //     console.log("PICK IMAGE URI:", localUri);
  //     await uploadAvatar(localUri);
  //   }
  // };

  // const uploadAvatar = async (uri: string) => {
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();
  //     formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
  //     formData.append("types", "1");

  //     const res = await axios.post(
  //       "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data", "x-svc-id": 1153 } }
  //     );

  //     const avatarPath = res.data?.data?.[0];
  //     console.log("UPLOAD AVATAR SUCCESS, path:", avatarPath);

  //     if (avatarPath) setAvatar(avatarPath);
  //   } catch (err) {
  //     console.log("UPLOAD AVATAR ERROR", err);
  //     Toast.show({ type: "error", text1: "Upload avatar thất bại" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Kiểm tra định dạng ngày
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(birthday)) {
        Toast.show({ type: "error", text1: "Ngày sinh không đúng định dạng DD/MM/YYYY" });
        return;
      }

      const body = {
        name,
        birthday,
        gender: Number(gender),
        avatar,
        phone,
        address,
        id_card_number: CCCD,
        email,
        department_name: departmentName,
        username: name,
      };

      console.log("UPDATE REQUEST BODY:", body);

      const res = await axios.post(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
        body,
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      console.log("UPDATE RESPONSE:", res.data);

      Toast.show({ type: "success", text1: "Cập nhật thành công" });
      // Khi push sang trang UpdatedUserScreen
      router.push({
        pathname: "/(tabs)/person",
        params: { userData: encodeURIComponent(JSON.stringify(body)) },
      });

    } catch (err: any) {
      console.log("UPDATE ERROR:", err.response?.data || err);
      Toast.show({
        type: "error",
        text1: "Cập nhật thất bại",
        text2: err?.response?.data?.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (initLoading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  const avatarUrl = avatar
    ? avatar.startsWith("http")
      ? avatar
      : CONFIG_RESOURCE_URL
        ? `${CONFIG_RESOURCE_URL}/${avatar}`
        : ""
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#edf0f4ff" }}>
      {/* <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }} onPress={pickImage}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Ionicons name="camera" size={25} color="#007AFF" style={styles.iconCamera} />
      </TouchableOpacity> */}
      {/* <AvatarPicker></AvatarPicker> */}
      <AvatarPicker
        avatar={avatar}
        onUploadSuccess={(newPath) => {
          console.log("Avatar updated to path:", newPath);
          setAvatar(newPath);
        }}
      />

      <Input label="Họ và tên" value={name} onChange={setName} />
      <Input label="Ngày sinh" value={birthday} onChange={setBirthday} placeholder="DD/MM/YYYY" />
      <Input label="Ngày tham gia" value={joining_date} onChange={setJoining_date} placeholder="DD/MM/YYYY" />
      <Input label="Giới tính (Nam: 1, Nữ: 0) " value={gender} onChange={setGender} />
      <Input label="Số điện thoại" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
      <Input label="CCCD" value={CCCD} onChange={setCCCD} keyboardType="numeric" />
      <Input label="Địa chỉ" value={address} onChange={setAddress} />
      <Input label="Bộ phận" value={departmentName} onChange={setDepartmentName} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cập nhật</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder || `Nhập ${label}`}
      keyboardType={keyboardType || "default"}
      style={styles.input}
    />
  </View>
);

const styles = StyleSheet.create({
  avatar: { width: 120, height: 120, borderRadius: 60 },
  iconCamera: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 },
  label: { fontSize: 15, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#161616", padding: 12, borderRadius: 10, marginBottom: 12, backgroundColor: "#fff" },
  button: { backgroundColor: "#007AFF", paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 25, marginBottom: 40 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
