// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

// type User = {
//   name: string;
//   departments: string;
//   avatar: string;
// };

// export default function PersonScreen() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   // const user = {
//   //   name: 'Nguyễn Văn A',
//   //   departments: 'IT',
//   //   avatar: 'https://jbagy.me/wp-content/uploads/2025/03/anh-avatar-vo-tri-meo-3.jpg',
//   // };

//   useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const token = await AsyncStorage.getItem("access_token");

//       if (!token) {
//         Alert.alert("Thông báo", "Bạn chưa đăng nhập!");
//         setUser(null);
//         return;
//       }

//       // Gọi API lấy thông tin người dùng
//       const res = await axios.get(
//         "https://beta.api.gateway.overate-vntech.com//api/v1/users/<id>/detail?id=<id>",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "x-svc-id": 1153,
//           },
//         }
//       );

//       console.log("Thông tin user:", res.data);

//       // Kiểm tra dữ liệu trả về
//       if (res.data?.status === 200 && res.data?.data) {
//         setUser(res.data.data);

//         // ✅ Lưu lại thông tin user để lần sau mở app không cần gọi lại
//         await AsyncStorage.setItem("user_info", JSON.stringify(res.data.data));
//       } else {
//         Alert.alert("Lỗi", "Không thể tải thông tin người dùng!");
//       }
//     } catch (err: any) {
//       console.log("Lỗi khi gọi API user info:", err.response?.data || err.message);
//       Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
//       setUser(null);
//     }
//   };

//   fetchUser();
// }, []);


//   const handleGoToLogin = () => router.push('/login');
//   const handleGoToRegister = () => router.push('/register');

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('access_token');
//       await AsyncStorage.removeItem('refresh_token');
//       Alert.alert('Thông báo', 'Bạn đã đăng xuất!');
//       router.replace('/login');
//     } catch (error) {
//       console.error('Lỗi khi đăng xuất:', error);
//       Alert.alert('Lỗi', 'Đăng xuất thất bại, thử lại sau!');
//     }
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText type="title" style={styles.title}>
//         {user ? "Thông tin người dùng" : "Chào mừng bạn!"}
//       </ThemedText>

//       {user ? (
//         <>
//           <View style={styles.card}>
//             <Image
//               source={{
//                 uri:
//                   user.avatar ||
//                   "https://cdn-icons-png.flaticon.com/512/847/847969.png",
//               }}
//               style={styles.avatar}
//             />
//             <View style={styles.info}>
//               <ThemedText style={styles.name}>{user.name}</ThemedText>
//               <View style={styles.row}>
//                 <Ionicons name="briefcase-outline" size={18} color="#555" />
//                 <ThemedText style={styles.text}>
//                   {user.departments || "Không có phòng ban"}
//                 </ThemedText>
//               </View>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, styles.logoutButton]}
//             onPress={handleLogout}
//           >
//             <ThemedText style={styles.buttonText}>Đăng xuất</ThemedText>
//           </TouchableOpacity>
//         </>
//       ) : (
//         <View style={styles.buttonRow}>
//           <TouchableOpacity
//             style={[styles.button, styles.loginButton]}
//             onPress={handleGoToLogin}
//           >
//             <ThemedText style={styles.buttonText}>Đăng nhập</ThemedText>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.registerButton]}
//             onPress={handleGoToRegister}
//           >
//             <ThemedText style={styles.buttonText}>Đăng ký</ThemedText>
//           </TouchableOpacity>
//         </View>
//       )}
//     </ThemedView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 24,
//     backgroundColor: '#fff',
//   },
//   title: {
//     marginBottom: 20,
//     fontSize: 22,
//     fontWeight: '700',
//   },
//   card: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginRight: 16,
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontWeight: '700',
//     fontSize: 18,
//     marginBottom: 6,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   text: {
//     marginLeft: 6,
//     color: '#555',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 10,
//   },
//   button: {
//     paddingVertical: 14,
//     paddingHorizontal: 30,
//     borderRadius: 12,
//   },
//   loginButton: {
//     backgroundColor: '#1E90FF',
//   },
//   registerButton: {
//     backgroundColor: '#ce113a',
//   },
//   logoutButton: {
//     marginTop: 30,
//     backgroundColor: '#000',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// });



import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

type User = {
  id: string;
  name: string;
  departments: string;
  avatar: string;
};

export default function PersonScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Kiểm tra user_info đã lưu
        const storedUser = await AsyncStorage.getItem('user_info');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }

        // Nếu chưa có, gọi API để lấy user info
       const userId = await AsyncStorage.getItem('user_id'); 
       console.log(userId)
      if (!userId) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/detail?id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'x-svc-id': 1153,
          },
        }
      );


        if (res.data?.status === 200 && res.data?.data) {
          setUser(res.data.data);
          await AsyncStorage.setItem('user_info', JSON.stringify(res.data.data));
        }
      } catch (err: any) {
        console.log('Lỗi lấy thông tin user:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user_info');
      await AsyncStorage.removeItem('user_id');
      setUser(null);
      Alert.alert('Thông báo', 'Bạn đã đăng xuất!');
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Đăng xuất thất bại!');
    }
  };

  const handleGoToLogin = () => router.push('/login');
  const handleGoToRegister = () => router.push('/register');

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Đang tải...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        {user ? 'Thông tin người dùng' : 'Chào mừng bạn!'}
      </ThemedText>

      {user ? (
        <>
          <View style={styles.card}>
            <Image
              source={{ uri: user.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <ThemedText style={styles.name}>{user.name}</ThemedText>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={18} color="#555" />
                <ThemedText style={styles.text}>{user.departments || 'Không có phòng ban'}</ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <ThemedText style={styles.buttonText}>Đăng xuất</ThemedText>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleGoToLogin}>
            <ThemedText style={styles.buttonText}>Đăng nhập</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={handleGoToRegister}>
            <ThemedText style={styles.buttonText}>Đăng ký</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  card: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 16, padding: 16, marginBottom: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 16 },
  info: { flex: 1 },
  name: { fontWeight: '700', fontSize: 18, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  text: { marginLeft: 6, color: '#555' },
  buttonRow: { flexDirection: 'row', gap: 10 },
  button: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  loginButton: { backgroundColor: '#1E90FF' },
  registerButton: { backgroundColor: '#ce113a' },
  logoutButton: { marginTop: 30, backgroundColor: '#000' },
  buttonText: { color: '#fff', fontWeight: '600' },
});


