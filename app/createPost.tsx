import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

export default function CreatePostScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!title.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thông báo',
                text2: 'Vui lòng nhập đầy đủ tiêu đề',
                visibilityTime: 2000
            })
            return;
        }
        if (!content.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Thông báo',
                text2: 'Vui lòng nhập đầy đủ nội dung',
                visibilityTime: 2000
            })
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Vui lòng đăng nhập lại',
                    visibilityTime: 2000
                })
                router.replace('/login');
                return;
            }

            const payload = {
                content,
                medias: [],
                title,
                type: 1,
                user_tags: [],
            };

            const res = await axios.post(
                'https://beta.api.gateway.overate-vntech.com/api/v1/kaizen/create-post',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'x-svc-id': 1153,
                    },
                }
            );

            console.log('Kết quả đăng bài:', res.data);

            if (res.data?.success || res.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Bài viết của bạn đã được đăng',
                    visibilityTime: 2000

                })
                router.push({
                    pathname: '/',
                    params: { newPost: JSON.stringify(res.data?.data || payload) },
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: res.data?.message || 'Không thể đăng bài.',
                    visibilityTime: 2000
                })
            }
        } catch (err: any) {
            console.error('Lỗi đăng bài:', err.response?.data || err.message);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Đăng bài thất bại, vui lòng thử lại',
                visibilityTime: 2000
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập tiêu đề bài viết"
                placeholderTextColor="#aaa"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Nội dung</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập nội dung bài viết..."
                placeholderTextColor="#aaa"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={handlePost}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Đăng bài</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 15,
        color: '#333',
        marginBottom: 16,
    },
    textArea: {
        height: 150,
        textAlignVertical: 'top'
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
});
