import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';


type Product = {
  id: string;      
  title: string;
  price: number;  
  image: string;
};

export default function HomeScreen() {
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
      // onPress={() => router.push(`/productDetail/${item.id}`)} 
      // onPress={() => router.push(`/product/123` as any)}
      onPress={() => router.push({
        pathname: '/productDetail',
        params: {id: item.id}
      })}

    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <ThemedText type="defaultSemiBold" style={styles.name}>
        {item.title}
      </ThemedText>
      <ThemedText style={styles.price}>
        {item.price.toLocaleString('vi-VN')}₫
      </ThemedText>
    </TouchableOpacity>
  );

  return (

    
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Sản phẩm nổi bật
      </ThemedText>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
      {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/newFeed')}>
           <ThemedText style={styles.buttonText}>new feed</ThemedText>
      </TouchableOpacity> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    top:15,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    width: '45%', 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
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
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  

});
