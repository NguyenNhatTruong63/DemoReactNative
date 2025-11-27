
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ToastHelper } from '@/components/toast/ToastShow';
import { apiPostVerifyOtpForgotPassword } from '@/api/auth/postVerifyOtpForgotPassword';

export default function OtpForgotPasswordScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { username: rawUsername } = useLocalSearchParams();
  const username = Array.isArray(rawUsername) ? rawUsername[0] : rawUsername;
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "OTP Quên mật khẩu",
       headerStyle: {
      backgroundColor: "#fff", }
    });
  }, [navigation]);

  const handleVerifyOtpForgotPassword = async () => {
    if (!otp) {
      ToastHelper.error('Vui lòng nhập mã OTP')
      return;
    }

    try {
      const res = await apiPostVerifyOtpForgotPassword(
        {
          otp,
          username,
        },
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
              pathname: '/auth/createNewPassword',
              params: { username, token: res.data.data.token }
            });
          },
        });
      }

      else {
        ToastHelper.custom({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'OTP không chính xác',
          visibilityTime: 2000,
        })
      }
    } catch (error: any) {
      ToastHelper.custom({
        type: 'error',
        text1: 'Lỗi',
        text2: error.response?.data?.message || 'OTP không chính xác hoặc hết hạn',
        visibilityTime: 2000
      })
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
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 30 },
  button: {
    backgroundColor: '#1E90FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
