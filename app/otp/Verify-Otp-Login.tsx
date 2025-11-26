import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { verifyOtpLogin } from '../api/auth';
import { ToastHelper } from '@/components/toast/ToastShow';


export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const navigation = useNavigation();
  const { user, password, temp_token, is_2fa } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({ title: "OTP Đăng nhập" });
  }, [navigation]);

  // Hàm gọi verify OTP
  const verifyOtp = async (otpValue: string) => {
    try {
      const res = await verifyOtpLogin(
        
        {
          device_uuid: '7637015A-E714-4D59-A886-6555892886C3',
          otp: otpValue,
          username: user,
          password,
          temp_token: temp_token || null,
        },
        
      );

      const token = res.data?.data?.access_token;
      const userInfo = res.data?.data?.user || res.data?.data;

      if (res.data?.status === 200 && token) {
        await AsyncStorage.setItem('access_token', token);
        if (userInfo) {
          await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
          await AsyncStorage.setItem('user_id', String(userInfo.id));
        }
        console.log('Đã lưu access_token:', token);

        ToastHelper.custom({
          type: 'success',
          text1: 'Xác thực thành công',
          text2: 'Đăng nhập hoàn tất',
          visibilityTime: 2000,
          onHide: () => router.replace('/'),
        });
      } else {
        ToastHelper.custom({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'OTP không chính xác',
          visibilityTime: 2000,
        });
      }
    } catch (error: any) {
      ToastHelper.custom({
        type: 'error',
        text1: 'Lỗi',
        text2: error.response?.data?.message || 'OTP không chính xác hoặc hết hạn',
        visibilityTime: 2000,
      });
      console.log('Lỗi OTP:', error.response?.data || error.message);
    }
  };

  // Nếu is_2fa === 0
  useEffect(() => {
    if (is_2fa === '0') {
      verifyOtp('123456');
    }
  }, [is_2fa]);

  //nút xác nhận
  const handleVerifyOtp = () => {
    if (!otp) {
      Toast.show({ 
        type: 'error', 
        text1: 'Thông báo', 
        text2: 'Vui lòng nhập mã OTP', 
        visibilityTime: 3000 
      });
      return;
    }
    verifyOtp(otp);
  };

  // Nếu is_2fa === 0, không hiển thị input OTP
  if (is_2fa === '0') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang xác thực...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <OtpInput numberOfDigits={6} onTextChange={setOtp} focusColor="#1E90FF" />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#1E90FF', padding: 12, borderRadius: 10, marginTop: 30 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
