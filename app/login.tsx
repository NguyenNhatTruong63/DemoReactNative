import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import base64 from 'react-native-base64';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('');
   const [showOtp, setShowOtp] = useState(false);
  const router = useRouter()
   const navigation = useNavigation();
   const [showPassword, setShowPassword] = useState(false)

const handleLogin = async () => {
  if (!user || !password) {
    Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  try {
    const encodedPassword = base64.encode(password);
    console.log('encodedPassword', encodedPassword)
    const res = await axios.post(
      'https://beta.api.gateway.overate-vntech.com/api/v1/auth/login',
      {
        username: user,
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
        Alert.alert('Đăng nhập thành công', `Xin chào ${user}!`, [
          {
            text: 'OK',
            onPress: () =>
              router.push({
                pathname: '/otp',
                params: {
                  user,
                  password: base64.encode(password),
                },
              }),
          },
        ]);
      }

    else{
        const msg = res.data?.message || 'Đăng nhập thất bại';
        Alert.alert('Lỗi', msg);
    }
    console.log("res",res.data)
    // Alert.alert('Đăng nhập thành công', 'Vui lòng nhập mã OTP để tiếp tục');

  } catch (err: any) {
    const msg = err.response?.data?.message || 'Sai tài khoản hoặc mật khẩu';
    Alert.alert('Đăng nhập thất bại', msg);
    console.log('Login error:', err.response?.data || err.message);
  }
};

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Đăng nhập</ThemedText>

      <ThemedView style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="User"
          placeholderTextColor="#aaa"
          value={user}
          onChangeText={setuser}
    
        />
      </ThemedView>

      <ThemedView style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#aaa"
          value={password}
          // secureTextEntry = {!setShowPassword}
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
     
        
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#555"></Ionicons>
        </TouchableOpacity>
      </ThemedView>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <ThemedText style={styles.buttonText}>Đăng nhập</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerLink} onPress={() => Alert.alert('Đi đến trang đăng ký')}>
        <ThemedText type="link">Chưa có tài khoản? Đăng ký</ThemedText>
      </TouchableOpacity>

  
    </ThemedView>
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
});
