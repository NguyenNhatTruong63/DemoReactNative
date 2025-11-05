import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';


type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function ProductScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </ThemedView>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: '/productDetail',
        params: {id: item.id}
      })}
      // onPress={() => router.push(`/product/${item.id}`)} 
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <ThemedText type="defaultSemiBold" style={styles.name}>
        {item.title}
      </ThemedText>
      {/* <ThemedText style={styles.price}>
        {item.price.toLocaleString('vi-VN')}₫
      </ThemedText> */}
      <View>
        <ThemedText style={styles.price}>
          {item.price.toLocaleString('vi-VN')}₫
        </ThemedText>

        <TouchableOpacity
          onPress={() => alert('Thành công')}
        >
          <TouchableOpacity
            onPress={() => router.push('/cart')}
            style={{
              padding: 6,
              borderRadius: 6,
              backgroundColor: '#1E90FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="cart-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Danh sách sản phẩm
      </ThemedText>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

  
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => router.push('/search')}
      >
        <Ionicons name="search-outline" size={28} color="#fff" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    top: 15,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    width: '47%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E90FF',
  },
  searchButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
});
