import React from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("id", id)
  const product = {
    id,
    name: 'Áo thun nam cotton 100%',
    price: 199000,
    image: 'https://product.hstatic.net/200000404243/product/a2mn438r2-cnma159-2410-n__1__e07e89fa83224938a77506f0816374e5.jpg',
    description:
      'Áo thun nam chất liệu cotton mềm mại, co giãn tốt, thấm hút mồ hôi. Phù hợp cho cả đi chơi và tập thể thao.',
  };

  const handleAddToCart = () => {
    Alert.alert('Thành công', 'Đã thêm sản phẩm vào giỏ hàng!');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <ThemedView style={styles.detailContainer}>
        <ThemedText type="title" style={styles.name}>
          {product.name}
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
