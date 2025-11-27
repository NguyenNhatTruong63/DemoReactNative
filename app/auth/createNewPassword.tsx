import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import base64 from 'react-native-base64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { ToastHelper } from '@/components/toast/ToastShow';
import { apiPostCreateNewPassword } from '@/api/auth/postCreateNewPassword';

export default function CreatePasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const navigation = useNavigation()
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Tạo mật khẩu mới",
    });
  }, [navigation]);

  useEffect(() => {
    const loadData = async () => {
      const t = await AsyncStorage.getItem('forgot_password_token');
      const u = await AsyncStorage.getItem('forgot_password_username');
      setToken(t);
      setUsername(u);
    };
    loadData();
  }, []);

  const handleCreatePassword = async () => {
    if (!newPassword.trim() || !verifyPassword.trim()) {
      ToastHelper.error('Vui lòng nhập đầy đủ mật khẩu')
      return;
    }
    if (newPassword !== verifyPassword) {
      ToastHelper.error('Mật khẩu không khớp')
      return;
    }


    setLoading(true);
    try {
      const res = await apiPostCreateNewPassword(
        {
          username,
          new_password: base64.encode(newPassword),
          token,
        },
      );


      console.log('CHANGE PASSWORD success:', res.data);

      ToastHelper.custom({
        type: 'success',
        text1: 'Tạo mật khẩu thành công',
        visibilityTime: 1500,
        onHide: async () => {
          await AsyncStorage.removeItem('forgot_password_token');
          await AsyncStorage.removeItem('forgot_password_username');
          router.push('/auth/login');
        },
      });
    } catch (error: any) {
      console.log('ERROR change password:', error.response?.data);
      ToastHelper.custom({
        type: 'error',
        text1: 'Lỗi',
        text2: error.response?.data?.message || 'Tạo mật khẩu thất bại',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      {/* <Text style={style.title}>Tạo mật khẩu mới</Text> */}


      <View style={{ marginBottom: 15 }}>
        <Text style={style.label}>Mật khẩu mới</Text>
        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
            <Ionicons
              name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verify Password */}
      <View style={{ marginBottom: 15 }}>
        <Text style={style.label}>Xác nhận mật khẩu</Text>
        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Nhập lại mật khẩu"
            value={verifyPassword}
            onChangeText={setVerifyPassword}
            secureTextEntry={!showVerifyPassword}
          />
          <TouchableOpacity onPress={() => setShowVerifyPassword(!showVerifyPassword)}>
            <Ionicons
              name={showVerifyPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={style.button} onPress={handleCreatePassword} disabled={loading}>
        <Text style={style.buttonText}>{loading ? 'Đang xử lý...' : 'Tạo mật khẩu'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

  label: {
    fontSize: 15,
    marginBottom: 4,
  },

  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },

  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
