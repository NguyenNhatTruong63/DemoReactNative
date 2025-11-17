import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text } from '@react-navigation/elements';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import base64 from 'react-native-base64';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const router = useRouter()
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false)
  const isUserValidate = user.trim().length > 0;
  const isPassValidate = password.trim().length >= 6;

  // const request2FA = async (tempToken: string) => {
  //   try {
  //     const res = await axios.post(
  //       "https://beta.api.gateway.overate-vntech.com/api/v1/users/2fa",
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tempToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     return res.data;
  //   } catch (error: any) {
  //     console.log("2FA error:", error.response?.data || error);
  //     return null;
  //   }
  // };


  const handleLogin = async () => {
    const trimUser = user.trim()
    const trimPass = password.trim()

    if (!isUserValidate && !isPassValidate) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập tài khoản và mật khẩu ít nhất 6 ký tự',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }

    if (!isUserValidate) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Vui lòng nhập tài khoản',
        position: 'top',
        visibilityTime: 4000,
      });
      return;
    }
    if (!isPassValidate) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Mật Khẩu phải có ít nhất 6 ký tự',
        position: 'top',
        visibilityTime: 4000,
      })
      // Alert.alert('Thông báo', 'Mật Khẩu phải có ít nhất 6 ký tự');
      return;
    }
    try {
      const encodedPassword = base64.encode(password);
      console.log('encodedPassword', encodedPassword)
      const res = await axios.post(
        'https://beta.api.gateway.overate-vntech.com/api/v1/auth/login',
        {
          username: trimUser,
          password: encodedPassword,

        },

        {
          headers: {
            'x-svc-id': 1153,
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.data?.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công',
          text2: 'Vui lòng nhập mã OTP',
          position: 'top',
          visibilityTime: 2000,
          onHide: () => {
            router.push({
              pathname: '/otp',
              params: {
                user: trimUser,
                password: encodedPassword,
              },
            });
          },
        });
      }
      // if (res.data.status === 200) {
      //   const { is_2fa, temp_token, access_token } = res.data.data || {};

      //   if (is_2fa === 1) {
      //     // console.log("Cần xác thực 2 yếu tố, temp_token:", temp_token);
      //     Toast.show({
      //       type: 'success',
      //       text1: 'Đăng nhập thành công',
      //       text2: 'Vui lòng nhập OTP',
      //       position: 'top',
      //       visibilityTime: 2000,
      //       onHide: () => {
      //         router.push({
      //           pathname: "/otp",
      //           params: { user: trimUser, password: encodedPassword, temp_token }
      //         });
      //       }
      //     })

      //   } else {
      //     console.log("Đăng nhập không cần 2FA, access_token:", access_token);
      //     if (access_token) {
      //       await AsyncStorage.setItem("access_token", access_token);
      //       router.push("/");
      //     } else {
      //       console.log("Login error: access_token trống");
      //     }
      //   }
      // }

      else {
        const msg = res.data?.message || 'Đăng nhập thất bại';
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'Đăng nhập thất bại',
          position: 'top',
          visibilityTime: 4000,
        })

      }
      console.log("res", res.data)
      // Alert.alert('Đăng nhập thành công', 'Vui lòng nhập mã OTP để tiếp tục');

    } catch (err: any) {
      // const msg = err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu';
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu',
        position: 'top',
        visibilityTime: 2000,
      });
      // Alert.alert('Đăng nhập thất bại', msg);
      console.log('Login error:', err.response?.data || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8f8f8" />
      <ThemedText type="title" style={styles.title}>Đăng nhập</ThemedText>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#0c0c0cff" />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#0d0d0dff"
          value={user}
          onChangeText={setuser}
          autoCapitalize="none"
        />
      </View>
      {!isUserValidate && user.length > 0 && (
        <Text style={styles.errorText}>Tài khoản không được để trống</Text>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#0b0b0bff" />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu ít nhất 6 ký tự"
          placeholderTextColor="#0a0a0aff"
          value={password}
          // secureTextEntry = {!setShowPassword}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}


        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555"></Ionicons>
        </TouchableOpacity>
      </View>
      {!isPassValidate && password.length > 0 && (
        <Text style={styles.errorText}>Mật khẩu phải có ít nhất 6 ký tự</Text>
      )}
      <TouchableOpacity onPress={() => router.push("/forgotPassword")}>
        <Text style={styles.buttonText}>Quên mật khẩu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>

    </View>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 20,
    backgroundColor: '#f7f7f7ff'

  },
  title: {
    height: 60,
    textAlign: 'center',
    marginBottom: 10,
    color: "#000",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0f0f0fff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#000',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#050505ff',
    fontWeight: '600',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 10,
    fontSize: 12,
  },
});
// i2ft=1 thì xác thực 2 yếu tố bằng 0 thì không xác thực 2 yếu tố



// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';
// import axios from 'axios';
// import base64 from 'react-native-base64';

// export default function LoginScreen() {
//   const [user, setUser] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const isUserValid = user.trim().length > 0;
//   const isPassValid = password.trim().length >= 6;

//   // Gửi request 2FA
//   const request2FA = async (tempToken: string) => {
//     try {
//       const res = await axios.post(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/users/2fa',
//         {},
//         {
//           headers: { Authorization: `Bearer ${tempToken}`, 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('2FA request response:', res.data);
//       return res.data;
//     } catch (err: any) {
//       console.log('2FA request error:', err.response?.data || err.message);
//       return null;
//     }
//   };

//   const handleLogin = async () => {
//     const trimUser = user.trim();
//     const trimPass = password.trim();

//     if (!isUserValid || !isPassValid) {
//       Toast.show({
//         type: 'error',
//         text1: 'Thông báo',
//         text2: 'Tài khoản hoặc mật khẩu không hợp lệ',
//         position: 'top',
//         visibilityTime: 3000,
//       });
//       return;
//     }

//     try {
//       const encodedPassword = base64.encode(trimPass);
//       console.log('Encoded password:', encodedPassword);

//       const res = await axios.post(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/auth/login',
//         { username: trimUser, password: encodedPassword },
//         { headers: { 'x-svc-id': 1153, 'Content-Type': 'application/json' } }
//       );

//       console.log('Login response:', res.data);

//       if (res.data.status === 200) {
//         const { is_2fa, temp_token, access_token } = res.data.data || {};

//         if (is_2fa === 1) {
//           console.log("Cần xác thực 2 yếu tố, temp_token:", temp_token);
//           router.push({
//             pathname: "/otp",
//             params: { user: trimUser, password: encodedPassword, temp_token }
//           });
//         } else {
//           console.log("Đăng nhập không cần 2FA, access_token:", access_token);
//           if (access_token) {
//             await AsyncStorage.setItem("access_token", access_token);
//             router.push("/");
//           } else {
//             console.log("Login error: access_token trống");
//           }
//         }
//       }
//     }

//     catch (err: any) {
//         console.log('Login error:', err.response?.data || err.message);
//         Toast.show({
//           type: 'error',
//           text1: 'Đăng nhập thất bại',
//           text2: err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu',
//         });
//       }
//     };

//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Đăng nhập</Text>

//         <View style={styles.inputContainer}>
//           <Ionicons name="person-outline" size={20} color="#000" />
//           <TextInput
//             style={styles.input}
//             placeholder="Tên đăng nhập"
//             value={user}
//             onChangeText={setUser}
//             autoCapitalize="none"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <Ionicons name="lock-closed-outline" size={20} color="#000" />
//           <TextInput
//             style={styles.input}
//             placeholder="Mật khẩu"
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555" />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={handleLogin}>
//           <Text style={styles.buttonText}>Đăng nhập</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', padding: 20 },
//     title: { fontSize: 24, textAlign: 'center', marginBottom: 30 },
//     inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 15 },
//     input: { flex: 1, fontSize: 16, color: '#000' },
//     button: { backgroundColor: '#1E90FF', padding: 12, borderRadius: 10, alignItems: 'center' },
//     buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
//   });
