
import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import QRCodeComponent from "./QRCodeComponent"

export default function TwoFASettings() {
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Xác thực 2 yếu tố",
    });
  }, [navigation]);



  const fetch2FAStatus = async () => {
    setLoading(true);
    try {
      const userInfoString = await AsyncStorage.getItem('user_info');
      if (!userInfoString) throw new Error('Không có thông tin user');

      const userInfo = JSON.parse(userInfoString);
      // const is2fa = userInfo?.is_2fa === 1; // true nếu 1, false nếu 0
      setIs2FAEnabled(userInfo?.is_2fa === 1);
      // setIs2FAEnabled(is2fa);
    } catch (err: any) {
      console.log('Fetch 2FA error:', err.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không lấy được trạng thái 2FA',
      });
    } finally {
      setLoading(false);
    }
  };


  //   const fetch2FAStatus = async () => {
  //   setLoading(true);
  //   try {
  //     const token = await AsyncStorage.getItem('access_token');
  //     if (!token) throw new Error('Không có access token');

  //     const res = await axios.get(
  //       'https://beta.api.gateway.overate-vntech.com/api/v1/users',

  //       { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
  //     );

  //     if (res.data?.status === 200 && res.data?.data) {
  //       const is2fa = res.data.data.is_2fa === 1;
  //       setIs2FAEnabled(is2fa);
  //       console.log("Fetch 2FA from API:", is2fa);
  //     } else {
  //       throw new Error(res.data?.message || 'Không lấy được trạng thái 2FA');
  //     }

  //   } catch (err: any) {
  //     console.log('Fetch 2FA error:', err.response?.data || err.message);
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Lỗi',
  //       text2: 'Không lấy được trạng thái 2FA',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  // Toggle 2FA
  const toggle2FA = async (value: boolean) => {
    setLoading(true);
    const userId = await AsyncStorage.getItem('user_id');
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) throw new Error('Không có access token');

      // Gửi lên API giá trị 0 hoặc 1
      const res = await axios.post(
        `https://beta.api.gateway.overate-vntech.com/api/v1/users/2fa`,
        { enable: value ? 1 : 0 },
        { headers: { Authorization: `Bearer ${token}`, "x-svc-id": 1153 } }
      );

      if (res.data?.status === 200) {
        setIs2FAEnabled(value);

        // Cập nhật luôn user_info trong AsyncStorage
        const userInfoString = await AsyncStorage.getItem('user_info');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          userInfo.is_2fa = value ? 1 : 0;
          await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
          console.log("user:", userInfo)
        }


        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: `2FA đã ${value ? 'bật' : 'tắt'}`,
        });

      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'Cập nhật thất bại',
        });
      }
    } catch (err: any) {
      console.log('2FA toggle error:', err.response?.data || err.message);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể thay đổi trạng thái 2FA',
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetch2FAStatus();
  }, []);
  
  if (loading && is2FAEnabled === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Xác thực 2 yếu tố (2FA)</Text> */}
      <View style={styles.row}>
        <Text style={styles.label}>Bật / Tắt 2FA</Text>
        <Switch
          value={!!is2FAEnabled}
          onValueChange={toggle2FA}
          thumbColor={is2FAEnabled ? '#1E90FF' : '#f4f3f4'}
          trackColor={{ false: '#ccc', true: '#81b0ff' }}
        />
      </View>
      {is2FAEnabled ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.title}>Vui lòng tải app Google Authenticator để lấy mã OTP </Text>
          <QRCodeComponent />
        </View>

      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fef9f9ff' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 18 },
});



