import React, { useEffect, useState } from "react";
import {View,Text,TextInput,Image,StyleSheet,ScrollView,TouchableOpacity,ActivityIndicator,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [resourceUrl, setResourceUrl] = useState<string>("");

  // Form state
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [joining_date, setJoining_date] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idCard, setIdCard] = useState("");
  const [address, setAddress] = useState("");
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // Chuyển ngày sang DD/MM/YYYY
  const fixDate = (d: string) => {
    const [dd, mm, yyyy] = d.split("/");
    return `${String(dd).padStart(2, "0")}/${Number(mm)}/${yyyy}`;
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");

        // Lấy resource URL từ cache hoặc public API
        const storedResource = await AsyncStorage.getItem("resource_url");
        if (storedResource) {
          setResourceUrl(storedResource);
        } else {
          const publicRes = await axios.get(
            "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
            { headers: { "x-svc-id": 1153 } }
          );
          const url = publicRes.data.data.CONFIG_RESOURCE_URL;
          setResourceUrl(url);
          await AsyncStorage.setItem("resource_url", url);
        }

        // Lấy user detail
        const res = await axios.get(
          `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/detail?id=${id}`,
          { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
        );

        const u = res.data.data;
        setUser(u);

        // Fill form
        setName(u.name || "");
        setBirthday(u.birthday || "");
        setJoining_date(u.joining_date || "");
        setGender(u.gender?.toString() || "");
        setEmail(u.email || "");
        setPhone(u.phone || "");
        setIdCard(u.id_card_number || "");
        setAddress(u.address || "");
        setDepartmentId(u.department_id || 0);
        setDepartmentName(u.departments || "Không có phòng ban");
        setUsername(u.username || u.login_name || "");
        setAvatar(u.avatar || "");
      } catch (err) {
        console.log("ERR DETAIL:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const avatarUrl = avatar
    ? `${resourceUrl}/${avatar}`
    : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const handleUpdate = async () => {
    if (!username.trim()) {
      Toast.show({ type: "error", text1: "Tên đăng nhập không được trống!" });
      return;
    }
    if (!departmentId) {
      Toast.show({ type: "error", text1: "Thiếu phòng ban!" });
      return;
    }
    if (!birthday.includes("/")) {
      Toast.show({ type: "error", text1: "Ngày sinh phải dạng DD/MM/YYYY" });
      return;
    }

    const finalBirthday = fixDate(birthday);

    try {
      const token = await AsyncStorage.getItem("access_token");

      const body = {
        name,
        birthday: finalBirthday,
        joining_date: finalBirthday,
        gender: Number(gender),
        avatar: avatar.toString(),
        phone,
        address,
        id_card_number: idCard,
        email,
        department_id: Number(departmentId),
        username,
      };

      console.log("FINAL BODY:", body);

      const res = await axios.post(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/${id}/update`,
        body,
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      console.log("UPDATE RESP:", res.data);

      if (res.data.status === 200) {
        const newUser = {
          ...user,
          name,
          birthday: finalBirthday,
          joining_date: finalBirthday,
          gender,
          email,
          phone,
          id_card_number: idCard,
          address,
          department_id: departmentId,
          username,
          avatar,
        };
        await AsyncStorage.setItem("user_info", JSON.stringify(newUser));

        Toast.show({ type: "success", text1: "Cập nhật thành công!" });

        router.replace("/(tabs)/person");
      } else {
        Toast.show({ type: "error", text1: res.data.message });
      }
    } catch (error: any) {
      console.log("ERR UPDATE:", error.response?.data || error);
      Toast.show({
        type: "error",
        text1: "API lỗi",
        text2: JSON.stringify(error.response?.data || error.message),
      });
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cập nhật thông tin</Text>

      <View style={styles.avatarContainer}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>

      {/* <Field label="Tên đăng nhập" value={username} onChange={setUsername} /> */}
      <Field label="Họ và tên" value={name} onChange={setName} />
      <Field
        label="Ngày sinh (DD/MM/YYYY)"
        value={birthday}
        onChange={setBirthday}
      />
      <Field
        label="Ngày tham gia (DD/MM/YYYY)"
        value={joining_date}
        onChange={setJoining_date}
      />
      <Field label="Giới tính (0: Nữ, 1: Nam)" value={gender} onChange={setGender} />
      <Field label="Email" value={email} onChange={setEmail} />
      <Field label="Số điện thoại" value={phone} onChange={setPhone} />
      <Field label="CCCD" value={idCard} onChange={setIdCard} />
      <Field label="Địa chỉ" value={address} onChange={setAddress} />

      <View style={styles.field}>
        <Text style={styles.label}>Phòng ban</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#eee" }]}
          value={departmentName}
          editable={false}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (txt: string) => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  field: { marginBottom: 15 },
  label: { fontSize: 15, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 10 },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

