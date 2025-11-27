
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { getPublicSettings } from '@/api/public-settings';
import { apiGetUserDetail } from '@/api/auth/getUserDetail';

type User = {
  id: string;
  name: string;
  department_name?: string;
  avatar?: string;
};

export default function PersonScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
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
      
      const publicRes = await getPublicSettings()

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

  const fetchUserDetail = async () => {
    console.log("=== fetchUserDetail CALLED ===");
    const token = await AsyncStorage.getItem('access_token');
    const userId = await AsyncStorage.getItem('user_id');
    console.log("Token lấy từ AsyncStorage:", token);
     setLoading(true);
    if (!token) {
      Toast.show({ type: "error", text1: "Token không tồn tại hoặc hết hạn" });
      setLoading(false)
      return;
    }
      if (!userId){
        setLoading(false)
        return;
      } 
    try {
      setLoading(true);

      console.log("Stored token:", token);
      console.log("Stored user_id:", userId);

      if (!token || !userId) {
        console.log('Không tìm thấy token hoặc user_id');
        setLoading(false)
        return;
      }

      await loadResourceUrl();
      const res = await apiGetUserDetail(userId)

      console.log("API RESPONSE:", res.data);

      const d = res?.data?.data;

      if (!d || !d.id) {
        console.log('User data null hoặc thiếu id:', d);
      
        return;
      }

      setUser({
        id: d.id.toString(),
        name: d.name,
        department_name: d.department_name,
        avatar: d.avatar,
      });

    } catch (err) {
      console.log("FETCH USER ERROR", err);
      Toast.show({ type: "error", text1: "Không tải được thông tin người dùng" });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("=== PersonScreen FOCUSED ===");
      fetchUserDetail();
    }, [])
  );


  // Safe avatar URL
  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : resourceUrl
        ? `${resourceUrl}/${user.avatar}`
        : 'https://cdn-icons-png.flaticon.com/512/847/847969.png'
    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  const handlePress = () => {
    if (!user?.id) return;
    router.push("/auth/userDetail")
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

  const settingsOptions = [
    { id: "1", label: "Đổi mật khẩu", onPress: () => router.push("/auth/changePassword") },
    { id: "2", label: "Đăng xuất", onPress: handleLogout },
    { id: "3", label: "Xác thực 2 yếu tố", onPress: () => router.push("/auth/twoFaSettings") },
    { id: "4", label: "Chấm công", onPress: () => router.push("/timekeeping/attendanceDetail") },
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
          <View style={{ alignSelf: "center", position: "relative", marginBottom: 10, width: 100, height: 100 }}>
            <TouchableOpacity>
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              <Ionicons name="camera" size={25} color="#007AFF" style={styles.iconCamera} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={styles.card}
          >
            <View style={styles.info}>
              <Text style={styles.name}>{user?.name ?? ''}</Text>
              <View style={styles.row}>
                <Ionicons name="briefcase-outline" size={18} color="#555" />
                <Text style={styles.text}>{user?.department_name ?? 'Không có phòng ban'}</Text>
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
      ) : !loading ? (
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={() => router.push('/auth/login')}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  card: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 16, padding: 16, marginBottom: 30, elevation: 3 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginRight: 16 },
  info: { flex: 1 },
  name: { fontWeight: '700', fontSize: 18, marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { marginLeft: 6, color: '#555' },
  button: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12 },
  loginButton: { backgroundColor: '#1E90FF' },
  buttonText: { color: '#fff', fontWeight: '600' },
  iconCamera: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 }
});


