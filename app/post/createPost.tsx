import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadImg from '../UploadImg';
import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { apiPostCreatePost } from '@/api/postNewsFeed/postCreatePost';
import { ToastHelper } from '@/components/toast/ToastShow';
import { CreatePost } from '@/api/postNewsFeed/type';

export default function CreatePostScreen() {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [loading, setLoading] = useState(false);

    const [medias, setMedias] = useState<string[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [resource, setResource] = useState<string>('');
    const [showUpload, setShowUpload] = useState(false);
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Đăng bài",
        });
    }, [navigation]);

    useEffect(() => {
        (async () => {
            const url = await AsyncStorage.getItem("resource_url");
            if (url) setResource(url);
        })();
    }, []);

    useEffect(() => {
        if (resource) {
            const full = medias.map(m => `${resource}/${m}`);
            setPreviewUrls(full);
        }
    }, [medias, resource]);

    const handlePost = async () => {
        if (!title.trim()) {
            ToastHelper.error('Vui lòng nhập tiêu đề')
            // Toast.show({
            //     type: 'error',
            //     text1: 'Thông báo',
            //     text2: 'Vui lòng nhập tiêu đề',
            //     visibilityTime: 2000
            // })
            return;
        }
        if (!content.trim()) {
            ToastHelper.error('Vui lòng nhập nội dung')
            // Toast.show({
            //     type: 'error',
            //     text1: 'Thông báo',
            //     text2: 'Vui lòng nhập nội dung',
            //     visibilityTime: 2000
            // })
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('access_token');

            const payload: CreatePost = {
                title,
                content,
                medias: [],
                type: 1,
                user_tags: [],
            };
            const res = await apiPostCreatePost(payload)
  
            const newPost = {
                id: res.data.data?.id || 'temp-id',
                title,
                content,
                medias: previewUrls,
            };
            ToastHelper.success('Đăng bài thành công')
            router.push({
                pathname: '/',
                params: { newPost: JSON.stringify({ title, content, medias: previewUrls }) }
            });
        } catch (err) {
            console.log("POST ERROR:", err);
            ToastHelper.error('Đăng bài không thành công')
            // Toast.show({ type: 'error', text1: 'Đăng bài thất bại' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tiêu đề</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập tiêu đề"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Nội dung</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Nhập nội dung"
                value={content}
                onChangeText={setContent}
                multiline
            />

            <View style={{ padding: 20 }}>
                <Button title="Thêm ảnh" onPress={() => setShowUpload(true)} />

                {showUpload && (
                    <UploadImg
                        onUploadComplete={(paths) => {
                            setMedias(prev => [...prev, ...paths]);
                            setShowUpload(false);
                        }}
                    />
                )}

                <ScrollView horizontal style={{ marginTop: 20 }}>
                    {previewUrls.length > 0 ? (
                        previewUrls.map((uri, i) => (
                            <Image
                                key={i}
                                source={{ uri }}
                                style={{ width: 120, height: 120, borderRadius: 8, marginRight: 10 }}
                            />
                        ))
                    ) : (
                        <Text>Chưa có ảnh nào</Text>
                    )}
                </ScrollView>
            </View>

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
        marginBottom: 6
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        fontSize: 15,
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


