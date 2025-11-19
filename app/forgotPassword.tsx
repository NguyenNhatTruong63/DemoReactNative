import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { router, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from '@react-navigation/elements';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import base64 from 'react-native-base64';
import Toast from 'react-native-toast-message';
import { useLayoutEffect } from "react";

export default function ForgotPassword() {
    const [username, setUsername] = useState('')
    const [forgotPassword, setForgotPassword] = useState()
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Quên mật khẩu",
        });
    }, [navigation]);


    const handleNext = () => {
        if (!username.trim) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng nhập tên đăng nhập',
                visibilityTime: 2000
            })
            return
        }
        router.push({
            pathname: '/otpForgotPassword',
            params: { username }
        })
    }
    return (
        <View style={style.container}>
            {/* <Text style={style.title}>Quên mật khẩu</Text> */}
            <View >
                <Text style={style.label}>Tên đăng nhập</Text>
                <View style={style.inputContainer}>
                    <TextInput style={style.input}
                        placeholder='Tên đăng nhập'
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"

                    />
                </View>

            </View>
            <TouchableOpacity style={style.button} onPress={handleNext} >
                <Text style={style.buttonText}>Tiếp tục</Text>
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