import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import * as Device from "expo-device";
import Toast from "react-native-toast-message";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SearchParams } from "expo-router";
import { useLocalSearchParams } from "expo-router";


type LocationType = { latitude: number; longitude: number };

export default function CheckInScreen() {
    const [location, setLocation] = useState<LocationType | null>(null);
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [checkedInToday, setCheckedInToday] = useState<boolean>(false);
    const [checkedOutToday, setCheckedOutToday] = useState<boolean>(false);
    // const [hasCheckedIn, setHasCheckedIn] = useState(false);
    // const [hasCheckedOut, setHasCheckedOut] = useState(false);

    const params = useLocalSearchParams();
    const photoUri = params.photoUri as string | undefined;


    // const photoUri = searchParams.photoUri;

    const STORAGE_KEY = "last_checkin_date";
    const STORAGE_KEY_OUT = "last_checkout_date";
    useEffect(() => {
        console.log("Ảnh truyền vào:", photoUri);
    }, [photoUri]);

    useEffect(() => {
        const checkLastCheckIn = async () => {
            const lastDateStr = await AsyncStorage.getItem(STORAGE_KEY);
            const todayStr = new Date().toISOString().split("T")[0];
            if (lastDateStr === todayStr) setCheckedInToday(true);
        };
        checkLastCheckIn();
    }, []);
    useEffect(() => {
        const checkLastCheckOut = async () => {
            const lastDateStr = await AsyncStorage.getItem(STORAGE_KEY_OUT);
            const todayStr = new Date().toISOString().split("T")[0];
            if (lastDateStr === todayStr) setCheckedOutToday(true);
        };
        checkLastCheckOut();
    }, []);
    //vi tri
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Toast.show({
                    type: "error",
                    text1: "Ứng dụng cần quyền truy cập vị trí",
                });
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            const coords: LocationType = {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            };
            setLocation(coords);

            const [addr] = await Location.reverseGeocodeAsync(coords);
            setAddress(`${addr.street || ""}, ${addr.city || ""}`);
        })();
    }, []);

    const handleSelectOnMap = (e: MapPressEvent) => {
        const coords: LocationType = e.nativeEvent.coordinate;
        setLocation(coords);
        Location.reverseGeocodeAsync(coords).then(([addr]) => {
            console.log("Địa chỉ đầy đủ từ reverseGeocodeAsync:", addr);
            setAddress(`${addr.street || ""}, ${addr.subregion || ""}, ${addr.city || ""}`);
        });
    };



    const handleCheckIn = async () => {
        if (!location || !photoUri) {
            Toast.show({
                type: "error",
                text1: "Không có thông tin ảnh hoặc vị trí",
            });
            return;
        }

        try {
            setLoading(true);
            setCheckedInToday(true);
            await AsyncStorage.setItem(STORAGE_KEY, new Date().toISOString().split("T")[0]);

            const token = await AsyncStorage.getItem("access_token");
            if (!token) {
                Toast.show({ type: "error", text1: "Không tìm thấy token" });
                return;
            }

            // 1) Upload ảnh
            const formData = new FormData();
            formData.append("file", {
                uri: photoUri,
                name: "checkin.jpg",
                type: "image/jpeg",
            } as any);

            const uploadRes = await axios.post(
                "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-svc-id": 1167,
                    },
                }
            );

            const avatarFileName = uploadRes.data?.data?.file_name;
            console.log("Ảnh upload thành công:", avatarFileName);


            let ip = "unknown";
            try {
                const resIp = await axios.get("https://api.ipify.org?format=json");
                ip = resIp.data.ip;
            } catch { }

            const device_id = Device.osInternalBuildId || Device.deviceName || "unknown";

            await axios.post(
                "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in",
                {
                    latitude: String(location.latitude),
                    longitude: String(location.longitude),
                    ip,
                    device_id,
                    avatar: avatarFileName,
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "x-svc-id": 1153,
                    },
                }
            );

            Toast.show({
                type: "success",
                text1: "Check-in thành công",
                onHide: () => router.push("/attendanceDetail"),
            });
            setCheckedInToday(true);

        } catch (err) {
            console.log("Lỗi check-in:", err);
            Toast.show({ type: "error", text1: "Check-in thất bại!" });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token");
            const userId = await AsyncStorage.getItem("user_id");
            const avatar = (await AsyncStorage.getItem("user_avatar")) || "";
            setCheckedOutToday(true);
            await AsyncStorage.setItem(STORAGE_KEY_OUT, new Date().toISOString().split("T")[0]);


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
            const formData = new FormData();
            formData.append("file", {
                uri: photoUri,
                name: "checkin.jpg",
                type: "image/jpeg",
            } as any);

            const uploadRes = await axios.post(
                "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "x-svc-id": 1167,
                    },
                }
            );

            const avatarFileName = uploadRes.data?.data?.file_name;
            console.log("Ảnh upload thành công:", avatarFileName);

            await axios.post(
                "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-out",
                {
                    latitude,
                    longitude,
                    ip,
                    device_id,
                    avatar: avatarFileName,
                    address
                },
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                        "x-svc-id": 1153
                    }
                }
            );

            Toast.show({ type: "success", text1: "Check out thành công!" });
            setLoading(false);
            setCheckedOutToday(true);


            setTimeout(() => {
                router.replace("/attendanceDetail");
            }, 2000);
        } catch (err) {
            console.log("Check-out error:", err);
            Toast.show({ type: "error", text1: "Check out thất bại" });
        }
    };





    if (!location) return null;

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.imageContainer}>
                {photoUri && (
                    <Image
                        source={{ uri: photoUri }}
                        style={styles.imageAvata}
                        resizeMode="cover"
                    />
                )}
            </View>

            {/* MAP */}
            <MapView
                style={styles.map}
                onPress={handleSelectOnMap}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker coordinate={location} />
            </MapView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <Text style={styles.address}> <Ionicons name="location-outline"></Ionicons> {address}</Text>

                {/* Nút Check-in*/}
                {/* {!checkedInToday && (
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handleCheckIn}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Đang check-in..." : "Check-in"}
                        </Text>
                    </TouchableOpacity>

                )},
                {!checkedOutToday && (
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handleCheckOut}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Đang check-out..." : "Check-out"}
                        </Text>
                    </TouchableOpacity>

                )}

                {checkedInToday && (
                    <Text style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
                        Bạn đã check-in hôm nay
                    </Text>
                )} */}


                {!checkedInToday && (
                    <TouchableOpacity
                        style={[styles.btn, loading && { opacity: 0.7 }]}
                        onPress={handleCheckIn}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Đang check-in..." : "Check-in"}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Nút Check-out */}
                {checkedInToday && !checkedOutToday && (
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: "orange" }, loading && { opacity: 0.7 }]}
                        onPress={handleCheckOut}
                        disabled={loading}
                    >
                        <Text style={styles.btnText}>
                            {loading ? "Đang check-out..." : "Check-out"}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Đã check-out */}
                {checkedOutToday && (
                    <Text style={{ marginTop: 10, color: "green", fontWeight: "bold" }}>
                        Bạn đã hoàn tất check-out hôm nay
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    map: { flex: 1 },
    footer: {
        padding: 15,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    btn: {
        backgroundColor: "#0066FF",
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    address: {
        fontSize: 15,
        marginBottom: 5,
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
    },

    imageAvata: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: "#ccc"

    },
});
