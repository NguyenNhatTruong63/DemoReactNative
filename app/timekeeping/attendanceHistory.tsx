
import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ToastHelper } from "@/components/toast/ToastShow";
import { apiGetAttendanceDetail2 } from "@/api/attendance/getAttendanceDetail2";

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
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [checkedOutToday, setCheckedOutToday] = useState(false);


    useLayoutEffect(() => {
        navigation.setOptions({ title: "Lịch sử chấm công" });
    }, [navigation]);

    const fetchAttendanceList = async () => {
        const token = await AsyncStorage.getItem('access_token');
        const userId = await AsyncStorage.getItem('user_id');

        if (!token || !userId) {
            ToastHelper.error("Token hoặc userId không tồn tại")
            return;
        }


        try {
            const now = new Date();
            const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
            setLoading(true);
            const res = await apiGetAttendanceDetail2(month, userId)
           

            const data: AttendanceItem[] = res.data?.data || [];
            setAttendanceList(data);
        } catch (err) {
            console.log("FETCH ATTENDANCE ERROR", err);
            ToastHelper.error("Không tải được danh sách chấm công")
        
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchAttendanceList();
    }, []);

    useEffect(() => {
        const checkToday = async () => {
            const token = await AsyncStorage.getItem('access_token');
            const userId = await AsyncStorage.getItem('user_id');
            if (!token || !userId) return;

            try {
                const now = new Date();
                const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
                const res = await  apiGetAttendanceDetail2(month, userId)
          

                const records: AttendanceItem[] = res.data?.data || [];
                const today = new Date();
                const hasCheckIn = records.some(r => {
                    const d = new Date(r.check_in_at || r.date);
                    return (
                        d.getDate() === today.getDate() &&
                        d.getMonth() === today.getMonth() &&
                        d.getFullYear() === today.getFullYear()
                    );
                });

                const hasCheckOut = records.some(r => {
                    const d = new Date(r.check_out_at || r.date);
                    return (
                        d.getDate() === today.getDate() &&
                        d.getMonth() === today.getMonth() &&
                        d.getFullYear() === today.getFullYear()
                    );
                });

                setCheckedInToday(hasCheckIn);
                setCheckedInToday(hasCheckOut);
            } catch (err) {
                console.log('Error fetching attendance:', err);
            }
        };

        checkToday();
    }, []);

    const renderItem = ({ item }: { item: AttendanceItem }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Ngày: {item.date}</Text>
            <Text style={styles.itemText}>Check-in: {item.check_in_at}</Text>
            <Text style={styles.itemText}>Check-out: {item.check_out_at}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
