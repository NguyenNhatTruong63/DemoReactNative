// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useRouter, useFocusEffect } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';
// import { Ionicons } from '@expo/vector-icons';
// import { useLocalSearchParams } from "expo-router";


// type User = {
//   id: string;
//   name: string;
//   departments: string;
//   avatar: string;
// };

// export default function PersonScreen() {
//   const router = useRouter();
//   // const [user, setUser] = useState<User | null>(null);
//   const [resourceUrl, setResourceUrl] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   // const { userData } = useLocalSearchParams();
// //   const { userData } = useLocalSearchParams() as { userData?: string };
// // const parsedUserData = userData ? JSON.parse(userData) : null;
// // const [user, setUser] = useState(parsedUserData);
// const { userData } = useLocalSearchParams() as { userData?: string };
// const parsedUserData = userData ? JSON.parse(userData) : null;

// // Khởi tạo state 1 lần duy nhất
// const [user, setUser] = useState(parsedUserData);


// useEffect(() => {
//   if (parsedUserData && parsedUserData.id !== user?.id) {
//     setUser(parsedUserData);
//   }
// }, [parsedUserData]);



//   // Load CONFIG_RESOURCE_URL
//   const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem("resource_url");
//       if (storedResource) {
//         setResourceUrl(storedResource);
//         return storedResource;
//       }

//       const publicRes = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
//         { headers: { "x-svc-id": 1153 } }
//       );

//       const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) {
//         await AsyncStorage.setItem("resource_url", url);
//         setResourceUrl(url);
//         return url;
//       }
//       return '';
//     } catch (err) {
//       console.log('Lỗi lấy resource URL:', err);
//       return '';
//     }
//   };

//   //Load user từ AsyncStorage hoặc API
//   const loadUser = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (!token) {
//         setLoading(false);
//         // setUser(null);
//         return;
//       }

//       const url = await loadResourceUrl();

//       const storedUser = await AsyncStorage.getItem("user_info");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//         // return;
//       }

//       const userId = await AsyncStorage.getItem("user_id");
//       if (!userId) return;

//       const res = await axios.get(
//         `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/detail?id=${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "x-svc-id": 1153,
//           },
//         }
//       );

//       if (res.data?.status === 200 && res.data?.data) {
//         const u: User = res.data.data;
//         setUser(u);
//         await AsyncStorage.setItem("user_info", JSON.stringify(u));
//       }
//     } catch (err) {
//       console.log("Lỗi load user:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   //Reload khi focus màn hình (sau khi update UserDetail)
//   useFocusEffect(
//     React.useCallback(() => {
//       loadUser();
//     }, [])
//   );

//   const avatarUrl = user?.avatar
//     ? `${resourceUrl}/${user.avatar}`
//     : "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//   const handlePress = () => {
//     if (!user?.id) return;
//     router.replace({
//       pathname: '/userDetail',
//       params: {
//         id: user.id.toString(),
//         userData: JSON.stringify(user),
//       }
//     });

//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove(["access_token", "refresh_token", "user_info", "user_id"]);
//       setUser(null);
//       Toast.show({ type: 'success', text1: 'Đăng xuất thành công' });
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Đăng xuất thất bại' });
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" />
//         <Text>Đang tải...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{user ? 'Thông tin người dùng' : 'Chào mừng bạn!'}</Text>

//       {user ? (
//         <>
//           <TouchableOpacity onPress={handlePress}>
//             <View style={styles.card}>
//               <Image source={{ uri: avatarUrl }} style={styles.avatar} />
//               <View style={styles.info}>
//                 <Text style={styles.name}>{user.name}</Text>
//                 <View style={styles.row}>
//                   <Ionicons name="briefcase-outline" size={18} color="#555" />
//                   <Text style={styles.text}>{user.departments || "Không có phòng ban"}</Text>
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>
//           <View>
//             <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
//               <Text style={styles.buttonText}>Đăng xuất</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => router.push("/changePassword")}>
//               <Text style={styles.buttonText}>Đổi mật khẩu</Text>
//             </TouchableOpacity>
//           </View>


//         </>
//       ) : (
//         <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push("/login")}>
//           <Text style={styles.buttonText}>Đăng nhập</Text>
//         </TouchableOpacity>

//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
//   card: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 16, padding: 16, marginBottom: 30, elevation: 3 },
//   avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 16 },
//   info: { flex: 1 },
//   name: { fontWeight: '700', fontSize: 18, marginBottom: 6 },
//   row: { flexDirection: 'row', alignItems: 'center' },
//   text: { marginLeft: 6, color: '#555' },
//   button: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
//   loginButton: { backgroundColor: '#1E90FF' },
//   logoutButton: { marginTop: 30, backgroundColor: '#000' },
//   buttonText: { color: '#fff', fontWeight: '600' },
// });





// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import * as ImagePicker from "expo-image-picker";


// type User = {
//   id: string;
//   name: string;
//   departments: string;
//   avatar: string;
// };

// export default function PersonScreen() {
//   const router = useRouter();
//   const { userData } = useLocalSearchParams() as { userData?: string };
//   const parsedUserData = userData ? JSON.parse(userData) : null;

//   const [user, setUser] = useState<User | null>(parsedUserData || null);
//   const [loading, setLoading] = useState(true);
//   const [resourceUrl, setResourceUrl] = useState<string>('');
//   const [avatarUri, setAvatarUri] = useState<string | null>(null);


//   // Load resource URL
//   const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem('resource_url');
//       if (storedResource) {
//         setResourceUrl(storedResource);
//         return storedResource;
//       }
//       const publicRes = await axios.get(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//         { headers: { 'x-svc-id': 1153 } }
//       );
//       const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
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

//   // Load user info từ AsyncStorage nếu chưa có param
//   useFocusEffect(
//     React.useCallback(() => {
//       const loadUser = async () => {
//         setLoading(true);
//         try {
//           await loadResourceUrl();

//           if (!user) {
//             const storedUser = await AsyncStorage.getItem('user_info');
//             if (storedUser) setUser(JSON.parse(storedUser));
//           }
//         } catch (err) {
//           console.log('Lỗi load user:', err);
//         } finally {
//           setLoading(false);
//         }
//       };
//       loadUser();
//     }, [user])
//   );

//   const avatarUrl = user?.avatar
//     ? `${resourceUrl}/${user.avatar}`
//     : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

//   const handlePress = () => {
//     if (!user?.id) return;
//     router.push({
//       pathname: '/userDetail',
//       params: {
//         id: user.id.toString(),
//         userData: JSON.stringify(user),
//       },
//     });
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_info', 'user_id']);
//       setUser(null);
//       Toast.show({ type: 'success', text1: 'Đăng xuất thành công' });
//     } catch (err) {
//       Toast.show({ type: 'error', text1: 'Đăng xuất thất bại' });
//     }
//   };
//   // const handleAvatar = async () => {

//   // }
//   const pickImage = async () => {
//   const result = await ImagePicker.launchImageLibraryAsync({
//     mediaTypes: ImagePicker.MediaTypeOptions.Images,
//     quality:1
//   });

//   if (!result.canceled) {
//     const uri = result.assets[0].uri;
//     setAvatarUri(uri);
//     await handleAvatar(uri);
//   }
// };
//   const handleAvatar = async (uri: string) => {
//     const formData = new FormData();

//     formData.append("file", {
//       uri,
//       name: "upload.jpg",
//       type: "image/jpeg",
//     } as any);
//     formData.append("types", "1");

//     try {
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
//       const fileId = res.data?.data?.[0]?.id;
//       console.log("UPLOAD OK:", fileId);



//       console.log("OK:", res.data);
//        const resourceUrl = await AsyncStorage.getItem("resource_url");

//     if (resourceUrl && fileId) {
//       const fullUrl = `${resourceUrl}${fileId}`;
//       // Cập nhật avatar hiển thị sau khi upload
//       setAvatarUri(fullUrl);
//     }
//   }  catch (err) {
//       console.log("ERR:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" />
//         <Text>Đang tải...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{user ? 'Thông tin người dùng' : 'Chào mừng bạn!'}</Text>

//       {user ? (
//         <>
//           <TouchableOpacity onPress={handlePress}>
//             <View style={styles.card}>
//               <Image source={{ uri: avatarUrl }} style={styles.avatar} />
//               <View style={styles.info}>
//                 <Text style={styles.name}>{user.name}</Text>
//                 <View style={styles.row}>
//                   <Ionicons name="briefcase-outline" size={18} color="#555" />
//                   <Text style={styles.text}>{user.departments || 'Không có phòng ban'}</Text>
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={[styles.button, styles.buttonAvatar]} onPress={pickImage}>
//               <Text style={styles.buttonText}>Thay Avatar</Text>
//             </TouchableOpacity>
//           </View>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
//               <Text style={styles.buttonText}>Đăng xuất</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.button, styles.logoutButton, styles.changeButton]}
//               onPress={() => router.push('/changePassword')}
//             >
//               <Text style={styles.buttonText}>Đổi mật khẩu</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       ) : (
//         <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
//           <Text style={styles.buttonText}>Đăng nhập</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
//   loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
//   card: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 30,
//     elevation: 3,
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginTop: 20,
//   },
//   changeButton: {
//     backgroundColor: '#1636a0ff'
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginRight: 16
//   },
//   buttonAvatar: {
//     backgroundColor: '#0f8ee2ff'
//   },
//   info: {
//     flex: 1
//   },
//   name: {
//     fontWeight: '700',
//     fontSize: 18,
//     marginBottom: 6
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   text: {
//     marginLeft: 6,
//     color: '#555'
//   },
//   button: {
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 12
//   },
//   loginButton: {
//     backgroundColor: '#1E90FF'
//   },
//   logoutButton: {
//     marginTop: 30,
//     backgroundColor: '#e51212ff'
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600'
//   },
// });



import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { FlatList } from "react-native";

type User = {
  id: string;
  name: string;
  departments: string;
  avatar: string;
};

export default function PersonScreen() {
  const router = useRouter();
  const { userData } = useLocalSearchParams() as { userData?: string };
  const parsedUserData = userData ? JSON.parse(userData) : null;

  const [user, setUser] = useState<User | null>(parsedUserData || null);
  const [loading, setLoading] = useState(true);
  const [resourceUrl, setResourceUrl] = useState<string>('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Load resource URL
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

  // Load user info nếu chưa có
  useFocusEffect(
    React.useCallback(() => {
      const loadUser = async () => {
        setLoading(true);
        try {
          await loadResourceUrl();
          if (!user) {
            const storedUser = await AsyncStorage.getItem('user_info');
            if (storedUser) setUser(JSON.parse(storedUser));
          }
        } catch (err) {
          console.log('Lỗi load user:', err);
        } finally {
          setLoading(false);
        }
      };
      loadUser();
    }, [user])
  );

  const avatarUrl = avatarUri
    ? avatarUri
    : user?.avatar
      ? `${resourceUrl}/${user.avatar}`
      : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  const handlePress = () => {
    if (!user?.id) return;
    router.push({
      pathname: '/userDetail',
      params: {
        id: user.id.toString(),
        userData: JSON.stringify(user),
      },
    });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_info', 'user_id']);
      setUser(null);
      Toast.show({ type: 'success', text1: 'Đăng xuất thành công' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Đăng xuất thất bại' });
    }
  };

  // PICK IMAGE
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      // Hiển thị ngay ảnh chọn
      setAvatarUri(uri);

      // Upload lên server
      await handleAvatar(uri);
    }
  };


  const handleAvatar = async (uri: string) => {
    try {
      //Tạo form data
      const formData = new FormData();
      formData.append("files", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);
      formData.append("types", "1");

      //Upload ảnh lên server
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

      //Lấy path ảnh đầu tiên trả về
      const path = res.data?.data?.[0];
      if (!path) {
        console.log("Upload thất bại hoặc không trả về path");
        return;
      }

      //Lấy resource URL để hiển thị
      const resource = (await AsyncStorage.getItem("resource_url")) || '';
      const fullUrl = `${resource}/${path}`;

      // Cập nhật state để hiển thị ngay avatar mới
      setUser(prev => prev ? { ...prev, avatar: path } : null);
      setAvatarUri(fullUrl);

      // Cập nhật avatar trên server
      await updateUserAvatar(path);

    } catch (err: any) {
      console.log("Lỗi upload avatar:", err.response?.data || err.message || err);
      Toast.show({ type: 'error', text1: 'Upload thất bại' });
    }
  };


  const updateUserAvatar = async (avatarPath: { path: string; type: number }) => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userId = await AsyncStorage.getItem("user_id");
      const storedUser = await AsyncStorage.getItem("user_info");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const body = {
        id: Number(userId),
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        department_id: Number(user.department_id),
        avatar: avatarPath.path,
        gender: user.gender ?? 1,
        birthday: user.birthday,
      };

      const res = await axios.post(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/update`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-svc-id": 1153,
          },
        }
      );

      console.log("UPDATE USER OK:", res.data);

      const resource = await AsyncStorage.getItem("resource_url");
      const fullUrl = `${resource}/${avatarPath.path}`;

      //Update state
      setUser(prev => prev ? { ...prev, avatar: avatarPath.path } : null);

      //Update avatarUri để hiển thị ngay
      setAvatarUri(fullUrl);

      //Lưu lại vào storage
      await AsyncStorage.setItem(
        "user_info",
        JSON.stringify({ ...user, avatar: avatarPath.path })
      );

    } catch (err: any) {
      console.log("ERR UPDATE USER:", err.response?.data || err);
    }
  };

  const settingsOptions = [
    {
      id: "1",
      label: "Thay Avatar",
      onPress: pickImage,
    },
    {
      id: "2",
      label: "Đổi mật khẩu",
      onPress: () => router.push("/changePassword"),
    },
    {
      id: "3",
      label: "Đăng xuất",
      onPress: handleLogout,
    },
  ];

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user ? 'Thông tin người dùng' : 'Chào mừng bạn!'}</Text>

      {user ? (
        <>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.card}>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <View style={styles.row}>
                  <Ionicons name="briefcase-outline" size={18} color="#555" />
                  <Text style={styles.text}>{user.departments || 'Không có phòng ban'}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <FlatList
            data={settingsOptions}
            keyExtractor={(item) => item.id}
            style={{ width: "100%", marginTop: 20 }}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={item.onPress}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 16, color: "#333" }}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/login')}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  changeButton: {
    backgroundColor: '#1636a0ff'
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16
  },
  buttonAvatar: {
    backgroundColor: '#0f8ee2ff'
  },
  info: {
    flex: 1
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 6
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 6,
    color: '#555'
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12
  },
  loginButton: {
    backgroundColor: '#1E90FF'
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#e51212ff'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  },
});

