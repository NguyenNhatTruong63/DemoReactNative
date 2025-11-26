import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import AvatarPicker from "../avatar/AvatarPicker";
import { getPublicSettings, userDetail, userUpdate } from "../api/auth";
import { ToastHelper } from "@/components/toast/ToastShow";



type Params = {
  id: string;
  userData?: string;
};
type User = {
  id: string;
  name: string;
  department_name: string;
  avatar: string;
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
  const [departmentId, setDepartmentId] = useState(parsedUser?.department_id || 1);
  const [user, setUser] = useState<User | null>(null);
  const [salary, setSalary] = useState(parsedUser?.salary_level_id)

  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Thông tin chi tiết",
    });
  }, [navigation]);

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
      await fetchUserDetail();
    } catch (err) {
      console.log("INIT ERROR:", err);
      Toast.show({ type: "error", text1: "Lỗi khởi tạo" });
    } finally {
      setInitLoading(false);
    }
  };

  const fetchPublicConfig = async () => {
    try {
      const res = await getPublicSettings()
      const cfg = res?.data?.data?.CONFIG_RESOURCE_URL ?? "";
      setCONFIG_RESOURCE_URL(cfg);
      console.log("CONFIG_RESOURCE_URL:", cfg);
    } catch (err) {
      console.log("CONFIG ERROR", err);
    }
  };

  const fetchUserDetail = async () => {
    const token = await AsyncStorage.getItem('access_token');
    const userId = await AsyncStorage.getItem('user_id');
    console.log("Token lấy từ AsyncStorage:", token);
    if (!token) {
      ToastHelper.error("Token không tồn tại hoặc hết hạn")
      return;
    }
    if (!userId) return;
    try {
      setLoading(true);
      if (!token || !userId) return;

      // await loadResourceUrl();
      const res = await userDetail(userId)

      const data = res.data?.data;
      if (data.id) {
        setUser({
          id: data.id,
          name: data.name,
          department_name: data.department_name,
          avatar: data.avatar,
        });
      }
      setName(data.name || "");
      setBirthday(data.birthday || "");
      setJoining_date(data.joining_date || "");
      setGender(data.gender?.toString() || "1");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setCCCD(data.id_card_number || "");
      setAddress(data.address || "");
      setDepartmentId(data.department_id || 1);
      setDepartmentName(data.department_name || 1);
      setAvatar(data.avatar || "");
      setSalary(data.salary_level_id)

      console.log("FETCH SUCCESS:", data);
    } catch (err) {
      console.log('Lỗi lấy user detail:', err);
      ToastHelper.error('Không tải được thông tin người dùng')
      // Toast.show({ type: 'error', text1: 'Không tải được thông tin người dùng' });
    } finally {
      setLoading(false);
    }
  };



  const handleUpdate = async () => {
    // const userId = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('access_token');
    const userId = await AsyncStorage.getItem('user_id');
    console.log("Token lấy từ AsyncStorage:", token);
    if (!token) {
      ToastHelper.error("Token không tồn tại hoặc hết hạn")
      return;
    }
    if (!userId) return;
    try {
      setLoading(true);

      // Kiểm tra định dạng ngày
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(birthday)) {
        ToastHelper.error("Ngày sinh không đúng định dạng DD/MM/YYYY")
       
        return;
      }
      if (!dateRegex.test(joining_date)) {
        ToastHelper.error("Ngày tham gia  không đúng định dạng DD/MM/YYYY")
        return;
      }


      const body = {
        name,
        username: name,
        birthday,
        joining_date,
        gender: Number(gender),
        avatar,
        phone,
        address,
        id_card_number: CCCD,
        email,
        department_id: Number(departmentId),
        manager_id: Number(),
        privilege_group_id: Number(),
        salary_level_id: salary,
      };

      console.log("UPDATE REQUEST BODY:", body);
      const res = await userUpdate(userId, body)

      if (res.data?.status === 200) {
        ToastHelper.success('Cập nhật thành công')
      
        router.push('/(tabs)/person')
      }
      else {
        ToastHelper.custom({
          type: "error",
          text1: "thất bại",
          text2: res.data
        });
      }

      console.log("UPDATE RESPONSE:", res.data);



    } catch (err: any) {
      console.log("UPDATE ERROR:", err.response?.data || err);
      ToastHelper.custom({
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // điều chỉnh offset nếu cần
    >
      <ScrollView style={{ padding: 20, backgroundColor: "#edf0f4ff" }}>
        <AvatarPicker
          avatar={avatar}
          onUploadSuccess={(newPath) => {
            console.log("Avatar updated to path:", newPath);
            setAvatar(newPath);
          }}
        />

        <Input label="Họ và tên" value={name} onChange={setName} />
        <Input label="Ngày sinh (DD-MM-YYYY)" value={birthday} onChange={setBirthday} placeholder="DD/MM/YYYY" />
        <Input label="Ngày tham gia (DD-MM-YYYY)" value={joining_date} onChange={() => { }} placeholder="DD/MM/YYYY" editable={false} />
        <Input label="Giới tính (Nam: 1, Nữ: 0) " value={gender} onChange={setGender} keyboardType="numeric" />
        <Input label="Số điện thoại" value={phone} onChange={setPhone} keyboardType="phone-pad" />
        <Input label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
        <Input label="CCCD" value={CCCD} onChange={setCCCD} keyboardType="numeric" />
        <Input label="Địa chỉ" value={address} onChange={setAddress} />
        <Input label="ID mức lương" value={String(salary)} onChange={() => { }} editable={false} />
        <Input label="ID bộ phận" value={String(departmentId)} onChange={setDepartmentId} />

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cập nhật</Text>}
        </TouchableOpacity>
      </ScrollView>

    </KeyboardAvoidingView>

  );
}

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  editable = true,

}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
}) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder || `Nhập ${label}`}
      keyboardType={keyboardType || "default"}
      editable={editable}
      style={[
        styles.input,
        !editable && {
          backgroundColor: "#f0f0f0",
          color: "#555",
        },
      ]}
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

