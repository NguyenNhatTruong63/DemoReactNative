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

export default function LoginScreen() {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const router = useRouter()
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false)
  const isUserValidate = user.trim().length >0;
  const isPassValidate = password.trim().length >=6;

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

  if(!isUserValidate){
    Toast.show({
    type: 'error',
    text1: 'Thông báo',
    text2: 'Vui lòng nhập tài khoản',
    position: 'top',
    visibilityTime: 4000,
  });
    return;
  }
  if(!isPassValidate){
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
        // Alert.alert('Đăng nhập thành công', `Xin chào ${trimUser}!`, [
        //   {
        //     text: 'OK',
        //     onPress: () =>
        //       router.push({
        //         pathname: '/otp',
        //         params: {
        //           user: trimUser,
        //           password: base64.encode(password),
        //         },
        //       }),
        //   },
        // ]);
      }

    else{
        const msg = res.data?.message || 'Đăng nhập thất bại';
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'Đăng nhập thất bại',
          position: 'top',
          visibilityTime: 4000,
        })
        // Alert.alert('Lỗi', msg);
    }
    console.log("res",res.data)
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
      <ThemedText type="title" style={styles.title}>Đăng nhập</ThemedText>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#aaa"
          value={user}
          onChangeText={setuser}
          autoCapitalize="none"
        />
      </View>
      {!isUserValidate && user.length > 0 && (
        <Text style={styles.errorText}>Tài khoản không được để trống</Text>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu ít nhất 6 ký tự"
          placeholderTextColor="#aaa"
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

      {/* <TouchableOpacity
        style={[styles.button, { backgroundColor: isUserValidate && isPassValidate ? '#1E90FF' : '#ccc' }]}
        onPress={handleLogin}
        disabled={!(isUserValidate && isPassValidate)}
      > */}
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
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
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
    color: '#fff',
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
