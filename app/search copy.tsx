import React, { useState, useEffect } from 'react';
import {View,TextInput,TouchableOpacity,FlatList,Image,StyleSheet,Keyboard, ActivityIndicator} from 'react-native';
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


export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

 const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
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
  const handleSearch = () => {
    Keyboard.dismiss();
    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/productDetail/${item.id}` as any)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <ThemedText style={styles.name}>{item.title}</ThemedText>
      <ThemedText style={styles.price}>
        {item.price.toLocaleString('vi-VN')}₫
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.input}
          placeholder="Tìm sản phẩm..."
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="arrow-forward-circle" size={26} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* Danh sách kết quả */}
      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <ThemedText style={{ textAlign: 'center', marginTop: 40 }}>
            {query ? 'Không tìm thấy sản phẩm nào.' : 'Nhập tên sản phẩm để tìm kiếm.'}
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 10,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E90FF',
  },
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
