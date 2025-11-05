import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data: Product = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!');
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </ThemedView>
    );
  }

  if (!product) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Không tìm thấy sản phẩm</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <ThemedView style={styles.detailContainer}>
        <ThemedText type="title" style={styles.name}>
          {product.title}
        </ThemedText>

        <ThemedText style={styles.price}>
          {new Intl.NumberFormat('vi-VN').format(product.price)}₫
        </ThemedText>

        <ThemedText style={styles.desc}>{product.description}</ThemedText>

        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <ThemedText style={styles.buttonText}>Thêm vào giỏ hàng</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#888', marginTop: 10 }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.buttonText}>← Quay lại</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 500,
  },
  detailContainer: {
    padding: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E90FF',
    marginBottom: 12,
  },
  desc: {
    color: '#555',
    lineHeight: 20,
    marginBottom: 20,
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
});

