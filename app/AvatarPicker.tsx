// import React, { useState, useEffect } from "react";
// import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// type AvatarPickerProps = {
//   avatar?: string; // path avatar từ server
//   size?: number; // kích thước avatar
//   onUploadSuccess?: (newAvatarPath: string) => void; // callback sau khi upload
// };

// export default function AvatarPicker({ avatar, size = 80, onUploadSuccess }: AvatarPickerProps) {
//   const [avatarUri, setAvatarUri] = useState<string>(
//     avatar ? `${avatar}` : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
//   );

//   useEffect(() => {
//     if (avatar) {
//       setAvatarUri(`${avatar}`);
//     }
//   }, [avatar]);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setAvatarUri(uri);
//       await handleUpload(uri);
//     }
//   };

//   const handleUpload = async (uri: string) => {
//     try {
//       const formData = new FormData();
//       formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
//       formData.append("types", 1 as any);

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-svc-id": 1167,
//           },
//         }
//       );

//       const path = res.data?.data?.[0];
//       if (!path) {
//         Toast.show({ type: "error", text1: "Upload thất bại" });
//         return;
//       }

//       const resource = (await AsyncStorage.getItem("resource_url")) || "";
//       const fullUrl = `${resource}/${path}`;

//       setAvatarUri(fullUrl);
//       if (onUploadSuccess) onUploadSuccess(path);

//       Toast.show({ type: "success", text1: "Upload thành công" });
//     } catch (err: any) {
//       console.log("Lỗi upload avatar:", err.response?.data || err.message || err);
//       Toast.show({ type: "error", text1: "Upload thất bại" });
//     }
//   };

//   return (
//     <TouchableOpacity onPress={pickImage}>
//       <Image
//         source={{ uri: avatarUri }}
//         style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#ccc" }}
//       />
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({});


import React, { useState, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

type AvatarPickerProps = {
  avatar?: string;
  size?: number;
  onUploadSuccess?: (newAvatarPath: string) => void;
};

export default function AvatarPicker({ avatar, size = 120, onUploadSuccess }: AvatarPickerProps) {
  const [avatarUri, setAvatarUri] = useState<string>("https://cdn-icons-png.flaticon.com/512/847/847969.png");

  useEffect(() => {
    loadAvatarFromProps();
  }, [avatar]);

  const loadAvatarFromProps = async () => {
    if (!avatar) return;

    const resource = (await AsyncStorage.getItem("resource_url")) || "";
    const fullUrl = avatar.startsWith("http")
      ? avatar
      : `${resource}/${avatar}`;

    console.log("Avatar from props:", fullUrl);

    setAvatarUri(fullUrl);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri); // hiển thị tạm ảnh local
      await handleUpload(uri);
    }
  };


  const handleUpload = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
      formData.append("types", 1 as any);

      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-svc-id": 1167,
          },
        }
      );

      const fileObj = res.data?.data?.[0];

      if (!fileObj || !fileObj.path) {
        Toast.show({ type: "error", text1: "Upload thất bại" });
        return;
      }

      const path = fileObj.path;

      const resource = (await AsyncStorage.getItem("resource_url")) || "";
      const fullUrl = `${resource}/${path}`;

      console.log("Uploaded path:", path);
      console.log("Full Avatar URL:", fullUrl);

      setAvatarUri(fullUrl);

      if (onUploadSuccess) onUploadSuccess(path);

      Toast.show({ type: "success", text1: "Upload thành công" });
    } catch (err: any) {
      console.log("Lỗi upload avatar:", err.response?.data || err.message || err);
      Toast.show({ type: "error", text1: "Upload thất bại" });
    }
  };


  return (
    <View>
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center", marginBottom: 20 }}>
        <Image
          source={{ uri: avatarUri }}
          style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#ccc" }}
        />
        <Ionicons name="camera" size={25} color="#007AFF" style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 }} />
      </TouchableOpacity>
    </View>

  );
}


// UserDetailScreen.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// export default function UserDetailScreen() {
//   const [user, setUser] = useState<any>(null);
//   const [avatarUri, setAvatarUri] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   // -----------------------------
//   // Load user info từ AsyncStorage
//   // -----------------------------
//   useEffect(() => {
//     const loadUser = async () => {
//       const stored = await AsyncStorage.getItem("user_info");
//       const resource = await AsyncStorage.getItem("resource_url");

//       if (stored && resource) {
//         const u = JSON.parse(stored);
//         const fullAvatar = u.avatar ? `${resource}/${u.avatar}?t=${Date.now()}` : "";

//         setUser(u);
//         setAvatarUri(fullAvatar);
//       }
//     };
//     loadUser();
//   }, []);

//   // -----------------------------
//   // Chọn ảnh từ thư viện
//   // -----------------------------
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setAvatarUri(uri); // hiển thị ảnh local trước
//       await uploadAvatar(uri);
//     }
//   };

//   // -----------------------------
//   // Upload avatar lên server
//   // -----------------------------
//   const uploadAvatar = async (uri: string) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
//       formData.append("types", "1");

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-svc-id": 1167,
//           },
//         }
//       );

//       const path = res.data?.data?.[0];
//       if (!path) {
//         Toast.show({ type: "error", text1: "Upload thất bại" });
//         return;
//       }

//       await updateUserAvatar(path);

//       Toast.show({ type: "success", text1: "Upload thành công" });
//     } catch (err: any) {
//       console.log("Lỗi upload:", err.response?.data || err);
//       Toast.show({ type: "error", text1: "Upload thất bại" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -----------------------------
//   // API cập nhật avatar user
//   // -----------------------------
//   // const updateUserAvatar = async (avatarPath: string) => {
//   //   try {
//   //     const token = await AsyncStorage.getItem("access_token");
//   //     const userId = await AsyncStorage.getItem("user_id");
//   //     const resource = await AsyncStorage.getItem("resource_url");

//   //     if (!userId || !token || !user) return;

//   //     const body = {
//   //       id: Number(userId),
//   //       name: user.name || "",
//   //       username: user.username || "",
//   //       phone: user.phone || "",
//   //       department_id: Number(user.department_id),
//   //       avatar: avatarPath,
//   //       gender: user.gender ?? 1,
//   //       birthday: user.birthday,
//   //     };

//   //     await axios.post(
//   //       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
//   //       body,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "x-svc-id": 1153,
//   //         },
//   //       }
//   //     );

//   //     const fullAvatar = `${resource}/${avatarPath}?t=${Date.now()}`;

//   //     // Cập nhật UI
//   //     setUser((prev: any) => prev ? { ...prev, avatar: avatarPath } : null);
//   //     setAvatarUri(fullAvatar);

//   //     // Lưu lại vào AsyncStorage
//   //     await AsyncStorage.setItem(
//   //       "user_info",
//   //       JSON.stringify({ ...user, avatar: avatarPath })
//   //     );
//   //   } catch (err: any) {
//   //     console.log("ERR UPDATE:", err.response?.data || err);
//   //   }
//   // };



//   const updateUserAvatar = async (avatarPath: string) => {
//   try {
//     const token = await AsyncStorage.getItem("access_token");
//     const userId = await AsyncStorage.getItem("user_id");
//     const stored = await AsyncStorage.getItem("user_info");
//     const resource = await AsyncStorage.getItem("resource_url");

//     if (!token || !userId || !stored) return;

//     const user = JSON.parse(stored);

//     const body = {
//       id: Number(userId),
//       name: user.name,
//       username: user.username,
//       phone: user.phone,
//       department_id: Number(user.department_id),
//       avatar: avatarPath,      // <--- LƯU LÊN API
//       gender: user.gender,
//       birthday: user.birthday,
//     };

//     await axios.post(
//       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "x-svc-id": 1153,
//         },
//       }
//     );

//     // Tạo URL hiển thị đầy đủ
//     const fullUrl = `${resource}/${avatarPath}?t=${Date.now()}`;

//     // Hiển thị ngay trên UI
//     setAvatarUri(fullUrl);

//     // Cập nhật local user
//     const newUser = { ...user, avatar: avatarPath };
//     await AsyncStorage.setItem("user_info", JSON.stringify(newUser));

//     // Nếu trang khác dùng user_created.avatar → load lại sẽ có avatar
//     setUser(newUser);

//   } catch (err:any) {
//     console.log("ERR UPDATE USER:", err.response?.data || err);
//   }
// };


//   if (!user) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
//         <Image source={{ uri: avatarUri }} style={styles.avatar} />

//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#fff" />
//           </View>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.name}>{user.name}</Text>
//       <Text style={styles.info}>Phòng ban: {user.department_name || "Không có"}</Text>
//       <Text style={styles.info}>SĐT: {user.phone}</Text>
//       <Text style={styles.info}>Giới tính: {user.gender === 1 ? "Nam" : "Nữ"}</Text>
//       <Text style={styles.info}>Sinh nhật: {user.birthday}</Text>
//     </View>
//   );
// }

// // -----------------------------
// // Styles
// // -----------------------------
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", paddingTop: 40 },
//   avatarWrapper: {
//     width: 120,
//     height: 120,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#ddd",
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     borderRadius: 60,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   name: { fontSize: 22, fontWeight: "600", marginTop: 20 },
//   info: { fontSize: 16, marginTop: 6, color: "#555" },
// });




// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// export default function UserDetailScreen() {
//   const [user, setUser] = useState<any>(null);
//   const [avatarUri, setAvatarUri] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   // LOAD USER
//   useEffect(() => {
//     const loadUser = async () => {
//       const stored = await AsyncStorage.getItem("user_info");
//       const resource = await AsyncStorage.getItem("resource_url");

//       if (stored) {
//         const u = JSON.parse(stored);
//         const fullAvatar = u.avatar ? `${resource}/${u.avatar}?t=${Date.now()}` : "";
//         setUser(u);
//         setAvatarUri(fullAvatar);
//       }
//     };
//     loadUser();
//   }, []);

//   // CHỌN ẢNH
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uri = result.assets[0].uri;
//       setAvatarUri(uri); // Hiển thị ảnh local ngay
//       await uploadAvatar(uri);
//     }
//   };

//   // UPLOAD FILE LÊN SERVER
//   const uploadAvatar = async (uri: string) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
//       formData.append("types", "1");

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-svc-id": 1167,
//           },
//         }
//       );


//       const path = res.data?.data?.[0];
//       if (!path) return Toast.show({ type: "error", text1: "Upload thất bại" });

//       await updateUserAvatar(path);

//       Toast.show({ type: "success", text1: "Cập nhật avatar thành công" });
//       console.log("PATH SERVER TRẢ VỀ:", path);

//     } catch (err: any) {
//       console.log("UPLOAD ERROR:", err.response?.data || err);
//       Toast.show({ type: "error", text1: "Upload thất bại" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // UPDATE USER AVATAR TRÊN API
//   // const updateUserAvatar = async (avatarPath: string) => {
//   //   try {
//   //     const token = await AsyncStorage.getItem("access_token");
//   //     const userId = await AsyncStorage.getItem("user_id");
//   //     const stored = await AsyncStorage.getItem("user_info");
//   //     const resource = await AsyncStorage.getItem("resource_url");

//   //     if (!token || !stored || !userId) return;

//   //     const u = JSON.parse(stored);

//   //     const body = {
//   //       id: Number(userId),
//   //       name: u.name,
//   //       username: u.username,
//   //       phone: u.phone,
//   //       department_id: Number(u.department_id),
//   //       avatar: avatarPath, // <-- LƯU path lên API
//   //       gender: u.gender,
//   //       birthday: u.birthday,
//   //     };

//   //     await axios.post(
//   //       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
//   //       body,
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "x-svc-id": 1153,
//   //         },
//   //       }
//   //     );

//   //     // FULL URL ĐỂ HIỂN THỊ
//   //     const fullUrl = `${resource}/${avatarPath}?t=${Date.now()}`;
//   //     console.log("FULL AVATAR URL:", fullUrl);


//   //     // CẬP NHẬT UI
//   //     setAvatarUri(fullUrl);
//   //     const newUser = { ...u, avatar: avatarPath };
//   //     setUser(newUser);

//   //     // CẬP NHẬT LOCAL STORAGE → giúp user_created.avatar hiển thị trên trang khác
//   //     await AsyncStorage.setItem("user_info", JSON.stringify(newUser));


//   //   } catch (err: any) {
//   //     console.log("UPDATE USER ERROR:", err.response?.data || err);
//   //   }
//   // };


//   const updateUserAvatar = async (avatarPath: string) => {
//   try {
//     const token = await AsyncStorage.getItem("access_token");
//     const userId = await AsyncStorage.getItem("user_id");
//     const stored = await AsyncStorage.getItem("user_info");
//     const resource = await AsyncStorage.getItem("resource_url");

//     if (!token || !stored || !userId) return;

//     const u = JSON.parse(stored);

//     const body = {
//       id: Number(userId),
//       name: u.name,
//       username: u.username,
//       phone: u.phone,
//       department_id: Number(u.department_id),
//       avatar: avatarPath,     // <- chỉ truyền string, KHÔNG truyền object
//       gender: u.gender,
//       birthday: u.birthday,
//     };

//     await axios.post(
//       `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
//       body,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "x-svc-id": 1153,
//         },
//       }
//     );

//     const fullUrl = `${resource}/${avatarPath}?t=${Date.now()}`;

//     setAvatarUri(fullUrl);

//     const newUser = { ...u, avatar: avatarPath };
//     await AsyncStorage.setItem("user_info", JSON.stringify(newUser));

//     setUser(newUser);

//   } catch (err:any) {
//     console.log("ERR UPDATE USER:", err?.response?.data || err);
//   }
// };


//   if (!user) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
//         <Image source={{ uri: avatarUri }} style={styles.avatar} />

//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#fff" />
//           </View>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.name}>{user.name}</Text>
//       <Text style={styles.info}>Phòng ban: {user.department_name || "Không có"}</Text>
//       <Text style={styles.info}>SĐT: {user.phone}</Text>
//       <Text style={styles.info}>Giới tính: {user.gender === 1 ? "Nam" : "Nữ"}</Text>
//       <Text style={styles.info}>Sinh nhật: {user.birthday}</Text>
//     </View>
//   );
// }


// // STYLE
// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", paddingTop: 40 },
//   avatarWrapper: { width: 120, height: 120 },
//   avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#ddd" },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     borderRadius: 60,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   name: { fontSize: 22, fontWeight: "600", marginTop: 20 },
//   info: { fontSize: 16, marginTop: 6, color: "#555" },
// });




// import React, { useEffect, useState } from "react";
// import { View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";

// export default function AvatarUploader() {
//   const [configUrl, setConfigUrl] = useState("");
//   const [avatarPath, setAvatarPath] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 1️⃣ Lấy CONFIG_RESOURCE_URL từ API Public
//   const fetchConfig = async () => {
//     try {
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         {
//           headers: { "x-svc-id": 1153 },
//         }
//       );

//       const url = res.data?.data?.CONFIG_RESOURCE_URL;
//       if (url) setConfigUrl(url);
//     } catch (error) {
//       console.log("LỖI LẤY CONFIG_RESOURCE_URL:", error);
//     }
//   };

//   useEffect(() => {
//     fetchConfig();
//   }, []);

//   // 2️⃣ Chọn ảnh từ máy
//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       uploadImage(result.assets[0]);
//     }
//   };

//   // 3️⃣ Upload ảnh lên server
//   const uploadImage = async (asset: any) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("file", {
//         uri: asset.uri,
//         name: "avatar.jpg",
//         type: "image/jpeg",
//       } as any);

//       const uploadRes = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/media/upload",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-svc-id": 1153,
//           },
//         }
//       );

//       const path = uploadRes?.data?.data?.path;
//       console.log("PATH SERVER TRẢ VỀ:", uploadRes.data.data);

//       if (path) {
//         setAvatarPath(path); // lưu path để hiển thị
//         saveAvatarToApi(path); // lưu avatar vào user_created
//       }
//     } catch (error) {
//       console.log("LỖI UPLOAD:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 4️⃣ Lưu avatar vào API (user_created.avatar)
//   const saveAvatarToApi = async (path: string) => {
//     try {
//       await axios.put(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/users/update-avatar",
//         { avatar: path },
//         { headers: { "x-svc-id": 1153 } }
//       );
//     } catch (error) {
//       console.log("LỖI LƯU AVATAR:", error);
//     }
//   };

//   // 5️⃣ Tạo URL ảnh đầy đủ
//   const fullAvatarUrl =
//     configUrl && avatarPath ? `${configUrl}/${avatarPath}` : null;

//   console.log("FULL URL:", fullAvatarUrl);

//   return (
//     <View style={{ alignItems: "center" }}>
//       <TouchableOpacity onPress={pickImage}>
//         {loading ? (
//           <ActivityIndicator size="large" />
//         ) : fullAvatarUrl ? (
//           <Image
//             source={{ uri: fullAvatarUrl }}
//             style={{ width: 120, height: 120, borderRadius: 100 }}
//           />
//         ) : (
//           <View
//             style={{
//               width: 120,
//               height: 120,
//               backgroundColor: "#ddd",
//               borderRadius: 100,
//             }}
//           />
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }






// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// export default function UserDetailScreen() {
//   const [user, setUser] = useState<any>(null);
//   const [avatarUri, setAvatarUri] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [configResourceUrl, setConfigResourceUrl] = useState<string>("");

//   // 1️⃣ Lấy CONFIG_RESOURCE_URL từ API public
//   const fetchConfig = async () => {
//     try {
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );
//       const url = res.data?.data?.CONFIG_RESOURCE_URL;
//       if (url) setConfigResourceUrl(url);
//     } catch (err) {
//       console.log("ERR FETCH CONFIG:", err);
//     }
//   };

//   // 2️⃣ Load user từ AsyncStorage
//   const loadUser = async () => {
//     try {
//       const stored = await AsyncStorage.getItem("user_info");
//       if (!stored) return;

//       const u = JSON.parse(stored);
//       setUser(u);

//       if (u.avatar && configResourceUrl) {
//         setAvatarUri(`${configResourceUrl}/${u.avatar}?t=${Date.now()}`);
//       }
//     } catch (err) {
//       console.log("ERR LOAD USER:", err);
//     }
//   };

//   useEffect(() => {
//     fetchConfig();
//   }, []);

//   useEffect(() => {
//     if (configResourceUrl) loadUser();
//   }, [configResourceUrl]);

//   // 3️⃣ Chọn ảnh từ thư viện
//   const pickImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         quality: 1,
//       });

//       if (result.canceled || !result.assets?.length) return;

//       const asset = result.assets[0];
//       setAvatarUri(asset.uri); // hiển thị ảnh local ngay
//       await uploadAvatar(asset.uri);

//     } catch (err) {
//       console.log("ERR PICK IMAGE:", err);
//     }
//   };

//   // 4️⃣ Upload ảnh lên server
//   const uploadAvatar = async (uri: string) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append("files", {
//         uri,
//         name: "avatar.jpg",
//         type: "image/jpeg",
//       } as any);

//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             "x-svc-id": 1167,
//           },
//         }
//       );

//       const fileObj = res.data?.data?.[0];
//       if (!fileObj?.path) {
//         Toast.show({ type: "error", text1: "Upload thất bại" });
//         return;
//       }

//       console.log("PATH SERVER TRẢ VỀ:", fileObj.path);
//       await updateUserAvatar(fileObj.path);

//       Toast.show({ type: "success", text1: "Upload thành công" });

//     } catch (err: any) {
//       console.log("ERR UPLOAD:", err.response?.data || err);
//       Toast.show({ type: "error", text1: "Upload thất bại" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 5️⃣ Gọi API update avatar
//   const updateUserAvatar = async (path: string) => {
//     try {
//       if (!user) return;

//       const token = await AsyncStorage.getItem("access_token");
//       const userId = await AsyncStorage.getItem("user_id");
//       if (!token || !userId) return;

//       const body = {
//         ...user,
//         avatar: path,
//       };

//       await axios.post(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
//         body,
//         { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
//       );

//       const fullUrl = `${configResourceUrl}/${path}?t=${Date.now()}`;
//       setAvatarUri(fullUrl);

//       const newUser = { ...user, avatar: path };
//       setUser(newUser);
//       await AsyncStorage.setItem("user_info", JSON.stringify(newUser));

//     } catch (err: any) {
//       console.log("ERR UPDATE USER:", err.response?.data || err);
//     }
//   };

//   if (!user) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
//         <Image source={{ uri: avatarUri || undefined }} style={styles.avatar} />
//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#fff" />
//           </View>
//         )}
//       </TouchableOpacity>

//       <Text style={styles.name}>{user.name}</Text>
//       <Text style={styles.info}>Phòng ban: {user.department_name || "Không có"}</Text>
//       <Text style={styles.info}>SĐT: {user.phone}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", paddingTop: 40 },
//   avatarWrapper: { width: 120, height: 120 },
//   avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#ddd" },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     borderRadius: 60,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   name: { fontSize: 22, fontWeight: "600", marginTop: 20 },
//   info: { fontSize: 16, marginTop: 6, color: "#555" },
// });


// import React, { useState, useEffect } from "react";
// import { View, Image, Button, ActivityIndicator, StyleSheet } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import axios from "axios";

// const CONFIG_SVC_ID = 1153; // header khi gọi API public
// const USER_ID = 40; // thay bằng userId hiện tại

// export default function AvatarUpload() {
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [configUrl, setConfigUrl] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   // Lấy CONFIG_RESOURCE_URL từ API public
//   const fetchConfig = async () => {
//     try {
//       const res = await axios.get("https://beta.api.gateway.overate-vntech.com/api/v1/settings/public", {
//         headers: { "x-svc-id": CONFIG_SVC_ID },
//       });
//       if (res.data?.data?.CONFIG_RESOURCE_URL) {
//         setConfigUrl(res.data.data.CONFIG_RESOURCE_URL);
//       }
//     } catch (err) {
//       console.log("Err fetch config:", err);
//     }
//   };

//   useEffect(() => {
//     fetchConfig();
//   }, []);

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//     });
//     if (!result.canceled) {
//       // result.assets là mảng các ảnh được chọn
//       const asset = result.assets[0];
//       await uploadAvatar(asset.uri);
//     }
//   };

//   const uploadAvatar = async (uri: string) => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("avatar", {
//         uri,
//         name: "avatar.jpg",
//         type: "image/jpeg",
//       } as any);

//       // Upload ảnh lên server media
//       const res = await axios.post(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/media/upload",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (res.data?.data?.path) {
//         const uploadedPath = res.data.data.path;

//         // Gọi API update user, lưu vào avatar
//         await axios.post(
//           `https://beta.api.gateway.overate-vntech.com/api/v1/users/${USER_ID}/update`,
//           { avatar: uploadedPath }
//         );

//         // Hiển thị avatar mới
//         setAvatarUrl(`${configUrl}/${uploadedPath}`);
//       } else {
//         console.log("Server không trả path:", res.data);
//       }
//     } catch (err) {
//       console.log("ERR UPLOAD:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" />}
//       {avatarUrl ? (
//         <Image source={{ uri: avatarUrl }} style={styles.avatar} />
//       ) : (
//         <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
//       )}
//       <Button title="Chọn ảnh" onPress={pickImage} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { alignItems: "center", marginTop: 50 },
//   avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 20 },
// });


