

import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as Device from "expo-device";
import { Ionicons } from "@expo/vector-icons";

type AttendanceItemDetail = {
  id: string;
  date: string;
  check_in_at: string;
  check_out_at: string;
  location_in_status: string;
  address_check_in: string;
  avatar_check_in: string;
  avatar_check_out: string;
  employee: {
    id: number;
    name: string;
    avatar: string;
  };
  working_schedule: {
    weekday: number;
    start_time: string;
    end_time: string;
    is_active: number;
  };
};

export default function AttendanceDetailScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceList, setAttendanceList] = useState<AttendanceItemDetail[]>([]);
  const [checkedOutToday, setCheckedOutToday] = useState(false);
  const [resourceUrl, setResourceUrl] = useState<string>("");

  // Load resource URL từ AsyncStorage hoặc API
  const loadResourceUrl = async () => {
    try {
      const storedResource = await AsyncStorage.getItem("resource_url");
      if (storedResource) {
        setResourceUrl(storedResource);
        return storedResource;
      }

      const publicRes = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/settings/public",
        { headers: { "x-svc-id": 1153 } }
      );

      const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? "";
      if (url) {
        await AsyncStorage.setItem("resource_url", url);
        setResourceUrl(url);
        return url;
      }
      return "";
    } catch (err) {
      console.log("Lỗi lấy resource URL:", err);
      return "";
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Chi tiết chấm công" });
  }, [navigation]);

  const formatDate = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  };

  const onChangeDate = (event: any, date?: Date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      fetchAttendanceList(date);
    }
  };

  const fetchAttendanceList = async (dateObj?: Date) => {
    const token = await AsyncStorage.getItem("access_token");
    const userId = await AsyncStorage.getItem("user_id");
    if (!token || !userId) {
      Toast.show({ type: "error", text1: "Token hoặc userId không tồn tại" });
      return;
    }

    try {
      setLoading(true);
      const dateToSend = formatDate(dateObj || selectedDate);
      const res = await axios.get(
        "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/detail",
        {
          headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 },
          params: { date: dateToSend, user_id: userId },
        }
      );

      const detail = res.data?.data;
      const list = detail ? [detail] : [];
      setAttendanceList(list);
    } catch (err) {
      console.log("FETCH ATTENDANCE ERROR", err);
      Toast.show({
        type: "error",
        text1: "Không tải được danh sách chấm công",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
    loadResourceUrl();
  }, []);

  const handleCheckOut = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userId = await AsyncStorage.getItem("user_id");
      const avatar = (await AsyncStorage.getItem("user_avatar")) || "";

      if (!token || !userId) {
        Toast.show({ type: "error", text1: "Token hoặc userId không tồn tại" });
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Cần quyền truy cập vị trí" });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const latitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();

      const [addrObj] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      const address = `${addrObj.street || ""}, ${addrObj.city || ""}`.trim();

      const device_id = Device.osInternalBuildId || Device.deviceName || "unknown";

      let ip = "unknown";
      try {
        const resIp = await axios.get("https://api.ipify.org?format=json");
        ip = resIp.data.ip;
      } catch (e) {
        console.log("Lỗi lấy IP:", e);
      }

      await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-out",
        { latitude, longitude, ip, device_id, avatar, address },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      Toast.show({ type: "success", text1: "Check out thành công!" });
      fetchAttendanceList();
    } catch (err) {
      console.log("Check-out error:", err);
      Toast.show({ type: "error", text1: "Check out thất bại" });
    }
  };

  const renderItem = ({ item }: { item: AttendanceItemDetail }) => {
    let avatarUrl = "";
    if (item.avatar_check_in) {
      avatarUrl = resourceUrl.endsWith("/")
        ? resourceUrl + item.avatar_check_in
        : resourceUrl + "/" + item.avatar_check_in;
    } else if (item.employee.avatar) {
      avatarUrl = resourceUrl.endsWith("/")
        ? resourceUrl + item.employee.avatar
        : resourceUrl + "/" + item.employee.avatar;
    }

    return (
      <View style={styles.itemContainer}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require("../assets/images/icon.png")
            }
            style={styles.imageAvata}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.itemTextName}>{item.employee.name}</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Ionicons name="calendar" size={25}></Ionicons>
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 8, backgroundColor: '#dadadaff', borderRadius: 15 }}>
          {/* <View style={styles.row}>
            <Text style={styles.itemText}>Tên: {item.employee.name}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Ionicons name="calendar" size={25}></Ionicons>
            </TouchableOpacity>
          </View> */}

          <Text style={styles.itemText}>Ngày: {item.date}</Text>
          <Text style={styles.itemText}>Check-in: {item.check_in_at || "-"}</Text>
          <Text style={styles.itemText}>Check-out: {item.check_out_at || "-"}</Text>
          <Text style={styles.itemText}>Địa chỉ check-in: {item.address_check_in || "-"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={attendanceList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {/* <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Ngày: {formatDate(selectedDate)}
        </Text>
      </TouchableOpacity> */}

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}


      {/* FAB */}
      <View style={styles.fabContainer}>
        <View style={styles.fabItem}>

          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#007bff" }]}
            onPress={() => router.push("/CameraScreen")}
          >
            <Ionicons name="camera" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabText}>Chụp ảnh và check in</Text>
        </View>
        {/* <View style={styles.fabItem}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#28a745" }]}
            onPress={() => router.push("/checkIn")}
          >
            <Ionicons name="log-in-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabText}>Check In</Text>
        </View> */}
        {/* <View style={styles.fabItem}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#dc3545" }]}
            onPress={handleCheckOut}
          >
            <Ionicons name="log-out-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabText}>Check Out</Text>
        </View> */}

        <View style={styles.fabItem}>
          <TouchableOpacity
            style={[styles.fabButton, { backgroundColor: "#007bff" }]}
            onPress={() => router.push("/attendance")}
          >
            <Ionicons name="time-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.fabText}>Lịch sử</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", },
  itemContainer: {
    // backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,

  },
  itemText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 10
  },
  itemTextName: {
    fontSize: 20,
    marginVertical: 5,
    textAlign: "center",
    flex: 1,
    fontWeight: "bold"
  },

  dateButton: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  fabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20
  },
  fabItem: {
    alignItems: "center"
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginBottom: 4,
  },
  fabText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center"
  },
  imageAvata: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc"
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },



});
