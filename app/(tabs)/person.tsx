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





import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

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

  // Load user info từ AsyncStorage nếu chưa có param
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

  const avatarUrl = user?.avatar
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

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.logoutButton, styles.changeButton]}
              onPress={() => router.push('/changePassword')}
            >
              <Text style={styles.buttonText}>Đổi mật khẩu</Text>
            </TouchableOpacity>
          </View>
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
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

