import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import base64 from 'react-native-base64';

export default function RegisterScreen(){
  const [user, setuser] = useState('')
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleRegister = async() =>{
    if(!user || !password){
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin')
    }
    try {
     const response = await axios.post('https://beta.api.gateway.overate-vntech.com/api/v1/auth/register', {
        username: user,
        password: password,
      });

      if (response.status === 200 || response.data.success) {
        Alert.alert('Thành công', 'Tạo tài khoản thành công!', [
          { text: 'OK', onPress: () => router.push('/') }, 
        ]);
      } else {
        Alert.alert('Thất bại', 'Không thể tạo tài khoản. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ!');
    }

  }
    return(
        <ThemedView style={styles.container}>
            <ThemedText type='title' style={styles.title}>Đăng ký</ThemedText>
            <ThemedView style={styles.inputContainer}>
              <Ionicons name="person-outline" size={24} color="#555" />
              <TextInput
                style={styles.input}
                placeholder="Tên người dùng"
                placeholderTextColor="#aaa"
                value={user}
                onChangeText={setuser}
              />
            </ThemedView>

            <ThemedView style={styles.inputContainer}>
             <Ionicons name="lock-closed-outline" size={24} color="#555" />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#aaa"
                value={password}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#555"
                />
              </TouchableOpacity>
            </ThemedView>
             <ThemedView style={styles.inputContainer}>
             <Ionicons name="call-outline" size={24} color="#555" />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                placeholderTextColor="#aaa"
                value={phone}
                onChangeText={setPhone}
              />
            </ThemedView>
            <TouchableOpacity style={styles.button} onPress={handleRegister} >
                <ThemedText style={styles.buttonText}>Tạo tài khoản</ThemedText>
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