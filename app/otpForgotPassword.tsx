
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export default function OtpForgotPasswordScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  // const { username } = useLocalSearchParams();
  const { username: rawUsername } = useLocalSearchParams();
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "OTP Quên mật khẩu",
    });
  }, [navigation]);

  const handleVerifyOtpForgotPassword = async () => {
    if (!otp) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập mã OTP',
        visibilityTime: 3000,
      })
      // Alert.alert('Thông báo', 'Vui lòng nhập mã OTP');
      return;
    }

    try {
      const res = await axios.post(
        'https://beta.api.gateway.overate-vntech.com/api/v1/auth/verify-otp-forgot-password',
        {
          // device_uuid: '7637015A-E714-4D59-A886-6555892886C3',
          otp,
          username,
          // password,
        },
        {
          headers: { 'x-svc-id': 1153 },
        }
      );

      console.log('Kết quả verify OTP:', res.data);
      if (res.data?.status === 200 && res.data?.data?.token) {
        const token = res.data.data.token;
        await AsyncStorage.setItem('forgot_password_token', token);
        await AsyncStorage.setItem('forgot_password_username', username);
        Toast.show({
          type: 'success',
          text1: 'Xác thực thành công',
          visibilityTime: 1500,
          onHide: () => {
            router.push({
              pathname: '/createPassword',
              params: { username, token: res.data.data.token }
            });
          },
        });
      }

      else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'OTP không chính xác',
          visibilityTime: 2000,
        })
        // Alert.alert('Lỗi', res.data?.message || 'OTP không chính xác');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.response?.data?.message || 'OTP không chính xác hoặc hết hạn',
        visibilityTime: 2000
      })
      // Alert.alert('Xác thực thất bại', msg);
      console.log('Lỗi OTP:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>

      <OtpInput
        numberOfDigits={6}
        onTextChange={setOtp}
        focusColor="#1E90FF"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtpForgotPassword}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 30 },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
