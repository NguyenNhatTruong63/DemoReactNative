
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState, useLayoutEffect } from 'react';
import { Text } from '@react-navigation/elements';
import {StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import base64 from 'react-native-base64';
import { StatusBar } from 'expo-status-bar';
import {apiPostLogin } from '@/api/auth/postLogin'
import { ToastHelper } from '@/components/toast/ToastShow';

export default function LoginScreen() {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('');
  const router = useRouter()
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false)
  const isUserValidate = user.trim().length > 0;
  const isPassValidate = password.trim().length >= 6;




  useLayoutEffect(() => {
    navigation.setOptions({
       headerShown: false,
    });
  }, [navigation]);

  const handleLogin = async () => {
    const trimUser = user.trim()


    if (!isUserValidate && !isPassValidate) {
      ToastHelper.error('Vui lòng nhập tài khoản và mật khẩu ít nhất 6 ký tự')
      return;
    }

    if (!isUserValidate) {
      ToastHelper.error('Vui lòng nhập tài khoản')
      return;
    }
    if (!isPassValidate) {
      ToastHelper.error('Mật khẩu phải có ít nhất 6 ký tự')
      return;
    }
    try {
      const encodedPassword = base64.encode(password);
      console.log('encodedPassword', encodedPassword)
      const res = await apiPostLogin(
        {
          username: trimUser,
          password: encodedPassword,

        },
      );

      if (res.data?.status === 200) {
        const { is_2fa, temp_token } = res.data.data || {};
        router.push({
          pathname: '/auth/verifyOtpLogin',
          params: {
            user: trimUser,
            password: encodedPassword,
            temp_token: temp_token ?? "",
            is_2fa: is_2fa ?? 0,
          },
        });

      }
      else {
        const msg = res.data?.message || 'Đăng nhập thất bại';
        ToastHelper.custom({
          type: 'error',
          text1: 'Lỗi',
          text2: res.data?.message || 'Đăng nhập thất bại',
          position: 'top',
          visibilityTime: 4000,
        })
      }
      console.log("res", res.data)
    }
    catch (err: any) {
      ToastHelper.custom({
        type: 'error',
        text1: 'Đăng nhập thất bại',
        text2: err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu',
        position: 'top',
        visibilityTime: 2000,
      });
      console.log('Login error:', err.response?.data || err.message);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8f8f8" />
      <Text style={styles.title}>Đăng nhập</Text>

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
      <TouchableOpacity onPress={() => router.push("/auth/forgotPassword")}>
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


