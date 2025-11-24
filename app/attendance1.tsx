
import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';

type AttendanceItem = {
    id: string;
    date: string;
    check_in_at: string;
    check_out_at: string;
};

export default function AttendanceScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [attendanceList, setAttendanceList] = useState<AttendanceItem[]>([]);
    const now = new Date();
    const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;

    useLayoutEffect(() => {
        navigation.setOptions({ title: "Chấm công" });
    }, [navigation]);

    const fetchAttendanceList = async () => {
        const token = await AsyncStorage.getItem('access_token');
        const userId = await AsyncStorage.getItem('user_id');

        if (!token || !userId) {
            Toast.show({ type: "error", text1: "Token hoặc userId không tồn tại" });
            return;
        }


        try {
            const now = new Date();
            const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
            // console.log(month);
            setLoading(true);
            const res = await axios.get(
                "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records",
                {
                    headers:
                    {
                        Authorization: `Bearer ${token}`,
                        "x-svc-id": 1153
                    },
                    params:
                    {
                        month,
                        user_id: userId
                    },
                }

            );

            const data: AttendanceItem[] = res.data?.data || [];
            setAttendanceList(data);
        } catch (err) {
            console.log("FETCH ATTENDANCE ERROR", err);
            Toast.show({
                type: "error",
                text1: "Không tải được danh sách chấm công"
            });
        } finally {
            setLoading(false);
        }
    };

    //     const token = await AsyncStorage.getItem('access_token');
    //     const userId = await AsyncStorage.getItem('user_id');

    //     if (!token || !userId) {
    //         Toast.show({ type: "error", text1: "Token hoặc userId không tồn tại" });
    //         return;
    //     }


    //     try {
    //         const now = new Date();
    //         const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
    //         // console.log(month);
    //         setLoading(true);
    //         const res = await axios.post(
    //             "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in",
    //             {
    //                 latitude: "10.812588328511268",
    //                 longitude: "106.66854123482754",
    //                 ip: "2831",
    //                 device_id: "1",
    //                 avatar: "",
    //                 address: "thủ đức",

    //             },
    //             {
    //                 headers:
    //                 {
    //                     Authorization: `Bearer ${token}`,
    //                     "x-svc-id": 1153
    //                 },
    //             }

    //         );

    //         const data: AttendanceItem[] = res.data?.data || [];
    //         setAttendanceList(data);
    //     } catch (err) {
    //         console.log("FETCH ATTENDANCE ERROR", err);
    //         Toast.show({
    //             type: "error",
    //             text1: "Không tải được danh sách chấm công"
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };





    const handleCheckIn = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const userId = await AsyncStorage.getItem('user_id');
            const avatar = (await AsyncStorage.getItem('user_avatar')) || '';

            if (!token || !userId) {
                Toast.show({ type: 'error', text1: 'Token hoặc userId không tồn tại' });
                return;
            }
            const alreadyCheckedIn = attendanceList.some((item: any) => {
                const d = new Date(item.created_at);
                return (
                    d.getDate() === now.getDate() &&
                    d.getMonth() === now.getMonth() &&
                    d.getFullYear() === now.getFullYear()
                );
            });

            if (alreadyCheckedIn) {
                Toast.show({ type: "error", text1: "Hôm nay bạn đã chấm công rồi!" });
                return;
            }

            //Lấy tọa độ
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: 'error', text1: 'Cần quyền truy cập vị trí' });
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const latitude = location.coords.latitude.toString();
            const longitude = location.coords.longitude.toString();

            // Lấy địa chỉ từ tọa độ (reverse geocode)
            const [addrObj] = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            const address = `${addrObj.street || ''}, ${addrObj.city || ''}`.trim();

            // Lấy device ID
            const device_id = Device.osInternalBuildId || Device.deviceName || 'unknown';

            // Lấy IP public
            let ip = 'unknown';
            try {
                const resIp = await axios.get('https://api.ipify.org?format=json');
                ip = resIp.data.ip;
            } catch (e) {
                console.log('Lỗi lấy IP:', e);
            }

            // Gọi API check-in
            const res = await axios.post(
                'https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in',
                {
                    latitude,
                    longitude,
                    ip,
                    device_id,
                    avatar,
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-svc-id': 1153,
                    },
                }
            );

            console.log('Check-in success:', res.data);
            Toast.show({ type: 'success', text1: 'Chấm công thành công!' });
        } catch (err) {
            console.log('Check-in error:', err);
            Toast.show({ type: 'error', text1: 'Chấm công không thành công' });
        }
    };


    const handleCheckOut = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            const userId = await AsyncStorage.getItem('user_id');
            const avatar = (await AsyncStorage.getItem('user_avatar')) || '';

            if (!token || !userId) {
                Toast.show({ type: 'error', text1: 'Token hoặc userId không tồn tại' });
                return;
            }

            //Lấy tọa độ
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({ type: 'error', text1: 'Cần quyền truy cập vị trí' });
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            const latitude = location.coords.latitude.toString();
            const longitude = location.coords.longitude.toString();

            // Lấy địa chỉ từ tọa độ (reverse geocode)
            const [addrObj] = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            const address = `${addrObj.street || ''}, ${addrObj.city || ''}`.trim();

            // Lấy device ID
            const device_id = Device.osInternalBuildId || Device.deviceName || 'unknown';

            // Lấy IP public
            let ip = 'unknown';
            try {
                const resIp = await axios.get('https://api.ipify.org?format=json');
                ip = resIp.data.ip;
            } catch (e) {
                console.log('Lỗi lấy IP:', e);
            }

            // Gọi API check-in
            const res = await axios.post(
                'https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in',
                {
                    latitude,
                    longitude,
                    ip,
                    device_id,
                    avatar,
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-svc-id': 1153,
                    },
                }
            );

            console.log('Check-in success:', res.data);
            Toast.show({ type: 'success', text1: 'Chấm công thành công!' });
        } catch (err) {
            console.log('Check-in error:', err);
            Toast.show({ type: 'error', text1: 'Chấm công thất bại' });
        }
    };



    useEffect(() => {
        fetchAttendanceList();
    }, []);

    const renderItem = ({ item }: { item: AttendanceItem }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => router.push('/attendanceDetail')}  >
                <Text style={styles.itemText}>Ngày: {item.date}</Text>
                {/* <Text style={styles.itemText}>Tên: {item.user_name}</Text>
            <Text style={styles.itemText}>Chức vụ: {item.position}</Text> */}
                <Text style={styles.itemText}>Check-in: {item.check_in_at}</Text>
                <Text style={styles.itemText}>Check-out: {item.check_out_at}</Text>
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
                <Text style={styles.buttonText}>Chấm Công</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/attendanceDetail')}>
                <Text style={styles.buttonText}>Chi tiết</Text>
            </TouchableOpacity> */}

            <Text style={styles.label}>Danh sách chấm công</Text>

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    itemContainer: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },
    itemText: {
        fontSize: 14,
        marginBottom: 2
    },
});
