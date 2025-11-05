
// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import { OtpInput } from 'react-native-otp-entry';
// import axios from 'axios';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export default function OtpScreen() {
//   const [otp, setOtp] = useState('');
//   const router = useRouter();
//   const { user, password } = useLocalSearchParams();

//   const handleVerifyOtp = async () => {
//     if (!otp) {
//       Alert.alert('Thông báo', 'Vui lòng nhập mã OTP');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/auth/verify-otp-login',
//         {
//           device_uuid: '7637015A-E714-4D59-A886-6555892886C3', 
//           otp,
//           username: user,
//           password,
//         },
//         {
//           headers: { 'x-svc-id': 1153 },
//         }
//       );

//       console.log('Kết quả verify OTP:', res.data);

//       if (res.data?.status === 200) {
//         const token = res.data?.data?.access_token;
//         if (token) {
//           await AsyncStorage.setItem('access_token', token);
//           console.log('Đã lưu access_token:', token);
//         }

//         let userInfo = res.data?.data?.user;
//         if (!userInfo && token) {
//           const userRes = await axios.get(
//             `https://beta.api.gateway.overate-vntech.com/api/v1/users/${user}/detail?id=${user}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'x-svc-id': 1153,
//               },
//             }
//           );
//           if (userRes.data?.status === 200) {
//             userInfo = userRes.data.data;
//           }
//         }
//         // if (userInfo) {
//         //   await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
//         //   await AsyncStorage.setItem('user_id', userInfo.id);
//         //   console.log('Đã lưu thông tin user:', userInfo);
//         // }

//         if (userInfo) {
//           await AsyncStorage.setItem('user_info', JSON.stringify(userInfo));
//           await AsyncStorage.setItem('user_id', userInfo.id); 
//           console.log('Đã lưu thông tin user:', userInfo);
//           console.log('Đã lưu user_id:', userInfo.id); 
//         }


//         Alert.alert('Xác thực thành công', 'Đăng nhập hoàn tất!', [
//           { text: 'OK', onPress: () => router.push('/newFeed') },
//         ]);
//       } else {
//         Alert.alert('Lỗi', res.data?.message || 'OTP không chính xác');
//       }
//     } catch (error: any) {
//       const msg = error.response?.data?.message || 'OTP không chính xác hoặc hết hạn';
//       Alert.alert('Xác thực thất bại', msg);
//       console.log('Lỗi OTP:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nhập mã OTP</Text>

//       <OtpInput
//         numberOfDigits={6}
//         onTextChange={setOtp}
//         focusColor="#1E90FF"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
//         <Text style={styles.buttonText}>Xác nhận</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 22, textAlign: 'center', marginBottom: 30 },
//   button: {
//     backgroundColor: '#1E90FF',
//     padding: 12,
//     borderRadius: 10,
//     marginTop: 30,
//   },
//   buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
// });


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const { user, password } = useLocalSearchParams();

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Thông báo', 'Vui lòng nhập mã OTP');
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

        Alert.alert('Xác thực thành công', 'Đăng nhập hoàn tất!', [
          { text: 'OK', onPress: () => router.push('/person') },
        ]);
      } else {
        Alert.alert('Lỗi', res.data?.message || 'OTP không chính xác');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'OTP không chính xác hoặc hết hạn';
      Alert.alert('Xác thực thất bại', msg);
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
