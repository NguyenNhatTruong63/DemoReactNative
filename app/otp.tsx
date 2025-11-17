import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { user, password } = useLocalSearchParams();
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "OTP Đăng nhập",
    });
  }, [navigation]);

  const handleVerifyOtp = async () => {
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
        'https://beta.api.gateway.overate-vntech.com/api/v1/auth/verify-otp-login',
        {
          device_uuid: '7637015A-E714-4D59-A886-6555892886C3',
          otp,
          username: user,
          password,
        },
        {
          headers: { 'x-svc-id': 1153 },
        }
      );

      console.log('Kết quả verify OTP:', res.data);

      if (res.data?.status === 200) {
        // Lưu access_token
        const token = res.data?.data?.access_token;
        if (token) {
          await AsyncStorage.setItem('access_token', token);
          console.log('Đã lưu access_token:', token);
        }
        const userInfo = res.data?.data;
        if (userInfo) {
          await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
          await AsyncStorage.setItem('user_id', String(userInfo.id));
          console.log('Đã lưu thông tin user:', userInfo);
          console.log('Đã lưu user_id:', userInfo.id);
        }
        Toast.show({
          type: 'success',
          text1: 'Xác thực thành công',
          text2: 'Đăng nhập hoàn tất',
          visibilityTime: 2000,
          onHide: () => {
            router.push({
              pathname: '/'
            })
          }
        })
        // Alert.alert('Xác thực thành công', 'Đăng nhập hoàn tất!', [
        //   { text: 'OK', onPress: () => router.push('/') },
        // ]);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'OTP không chính xác',
          visibilityTime: 2000,
        })
        // Alert.alert('Lỗi', res.data?.message || 'OTP không chính xác');
      }
    } catch (error: any) {
      // const msg = error.response?.data?.message || 'OTP không chính xác hoặc hết hạn';
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

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
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


// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import OTPTextInput from 'react-native-otp-textinput';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';

// export default function OtpScreen() {
//   const [otp, setOtp] = useState('');
//   const router = useRouter();
//   const { user, password, temp_token } = useLocalSearchParams();

//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       Toast.show({ type: 'error', text1: 'Thông báo', text2: 'Vui lòng nhập OTP', visibilityTime: 2000 });
//       return;
//     }

//     try {
//       const res = await axios.post(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/auth/verify-otp-login',
//         { device_uuid: '7637015A-E714-4D59-A886-6555892886C3', otp, username: user, password },
//         { headers: { 'x-svc-id': 1153 } }
//       );

//       console.log('OTP verify response:', res.data);

//       if (res.data?.status === 200) {
//         const token = res.data.data?.access_token;
//         console.log('Access token from OTP:', token);

//         if (token) {
//           await AsyncStorage.setItem('access_token', token);
//         }

//         await AsyncStorage.setItem('user_info', JSON.stringify(res.data.data));
//         await AsyncStorage.setItem('user_id', String(res.data.data.id));

//         Toast.show({ type: 'success', text1: 'Xác thực thành công', text2: 'Đăng nhập hoàn tất', visibilityTime: 2000 });

//         router.push('/');
//       } else {
//         Toast.show({ type: 'error', text1: 'Lỗi', text2: res.data?.message || 'OTP không đúng', visibilityTime: 2000 });
//       }
//     } catch (err: any) {
//       console.log('OTP verify error:', err.response?.data || err.message);
//       Toast.show({ type: 'error', text1: 'Lỗi', text2: 'OTP không hợp lệ hoặc hết hạn', visibilityTime: 2000 });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nhập mã OTP</Text>
//       <OTPTextInput handleTextChange={setOtp} inputCount={6} />
//       <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
//         <Text style={styles.buttonText}>Xác nhận</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 22, textAlign: 'center', marginBottom: 30 },
//   button: { backgroundColor: '#1E90FF', padding: 12, borderRadius: 10, marginTop: 20 },
//   buttonText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },
// });
