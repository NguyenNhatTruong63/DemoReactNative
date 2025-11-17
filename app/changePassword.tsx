import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import { Stack } from 'expo-router';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";


export default function ChangePassword() {
    const router = useRouter()
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [verifypassword, setVerifyPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    // const [showPassword, setShowPassword] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showVerifyPassword, setShowVerifyPassword] = useState(false)
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Đổi mật khẩu",
        });
    }, [navigation]);



    useEffect(() => {
        const getUserId = async () => {
            const id = await AsyncStorage.getItem('user_id');
            if (id) setUserId(Number(id));
        };
        getUserId();
    }, []);

    const handleChangePassword = async () => {
        if (!oldPassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập mật khẩu cũ',
                visibilityTime: 2000
            })
            return
        }

        if (!verifypassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập lại mật khẩu mới',
                visibilityTime: 2000
            })
            return
        }
        if (newPassword !== verifypassword) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Mật khẩu mới và xác nhận không khớp',
                visibilityTime: 2000
            })
            return
        }
        setLoading(true)
        try {
            const token = await AsyncStorage.getItem('access_token');
            console.log("Call API change password with userId:", userId);
            console.log("Old Base64:", base64.encode(oldPassword));
            console.log("New Base64:", base64.encode(newPassword));
            const res = await axios.post(
                `https://beta.api.gateway.overate-vntech.com/api/v1/users/${userId}/change-password`,
                {
                    id: userId,
                    old_password: base64.encode(oldPassword),
                    new_password: base64.encode(newPassword),
                },
                {
                    headers: {
                        'x-svc-id': 1153,
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công' });
            setOldPassword('');
            setNewPassword('');
            setVerifyPassword('');
            setTimeout(() => {
                router.push("/(tabs)/person");
            }, 1000);
        } catch (error: any) {
            console.log("ERROR change password:", error.response?.data);
            Toast.show({ type: 'error', text1: error.response?.data?.message || 'Đổi mật khẩu thất bại' });
        } finally {
            setLoading(false);
        }

    }


    return (
        <View style={style.container}>
            {/* <Text style={style.title}>Đổi mật khẩu</Text> */}

            <View style={{ marginBottom: 15 }}>
                <Text style={style.label}>Mật khẩu cũ </Text>
                <View style={style.inputContainer}>
                    <TextInput style={style.input}
                        placeholder='Nhập mật khẩu cũ'
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        secureTextEntry={!showOldPassword}

                    />
                    <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                        <Ionicons name={showOldPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555"></Ionicons>
                    </TouchableOpacity>

                </View>

            </View>
            <View style={{ marginBottom: 15 }}>
                <Text style={style.label}>Mật khẩu mới </Text>
                <View style={style.inputContainer}>
                    <TextInput style={style.input}
                        placeholder='Nhập mật khẩu mới'
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!showNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                        <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555"></Ionicons>
                    </TouchableOpacity>
                </View>

            </View>

            <View style={{ marginBottom: 15 }}>
                <Text style={style.label}>Xác nhận mật khẩu</Text>
                <View style={style.inputContainer}>
                    <TextInput style={style.input}
                        placeholder='Xác nhận mật khẩu'
                        value={verifypassword}
                        onChangeText={setVerifyPassword}
                        secureTextEntry={!showVerifyPassword}
                    />
                    <TouchableOpacity onPress={() => setShowVerifyPassword(!showVerifyPassword)}>
                        <Ionicons name={showVerifyPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555"></Ionicons>
                    </TouchableOpacity>

                </View>

            </View>
            <TouchableOpacity style={style.button} onPress={handleChangePassword} disabled={loading}>
                <Text style={style.buttonText}>{loading ? 'Đang xử lý' : 'Đổi mật khẩu'}</Text>
            </TouchableOpacity>

        </View>
    )

}

const style = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f2f2f2',
        flex: 1,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },

    label: {
        fontSize: 15,
        marginBottom: 4,
    },

    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderWidth: 0,
        backgroundColor: 'transparent',
    },

    button: {
        backgroundColor: '#1E90FF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
        marginBottom: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});