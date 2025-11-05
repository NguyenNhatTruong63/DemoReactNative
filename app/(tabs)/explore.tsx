// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { useRouter } from 'expo-router';
// import React from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import { FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

// type Product = {
//   id: string;      
//   name: string;
//   price: number;  
//   image: string;
// };

// export default function ProductScreen() {
//   const router = useRouter();

//   // Dữ liệu demo
//   const products: Product[] = [
//     {
//       id: '1',
//       name: 'Áo thun nam',
//       price: 199000,
//       image: 'https://product.hstatic.net/200000404243/product/a2mn438r2-cnma159-2410-n__1__e07e89fa83224938a77506f0816374e5.jpg',
//     },
//     {
//       id: '2',
//       name: 'Áo thun nam màu xanh',
//       price: 499000,
//       image: 'https://product.hstatic.net/200000404243/product/a2mn438r2-cnma159-2410-n__1__e07e89fa83224938a77506f0816374e5.jpg',
//     },
//     {
//       id: '3',
//       name: 'Áo thun nam',
//       price: 259000,
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieYHXVzhr19ILuYnaYOe-oSJUwGgtLc9sWg&s',
//     },
//     {
//       id: '4',
//       name: 'Áo thun nam',
//       price: 259000,
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieYHXVzhr19ILuYnaYOe-oSJUwGgtLc9sWg&s',
//     },
//     {
//       id: '5',
//       name: 'Áo thun nam',
//       price: 259000,
//       image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSieYHXVzhr19ILuYnaYOe-oSJUwGgtLc9sWg&s',
//     },
//   ];

//   const renderItem = ({ item }: { item: Product }) => (
//     <TouchableOpacity
//       style={styles.card}
//       // onPress={() => router.push(`/productDetail/${item.id}`)} 
//       onPress={() => router.push(`/productDetail/${item.id}` as any)}

//     >
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <ThemedText type="defaultSemiBold" style={styles.name}>
//         {item.name}
//       </ThemedText>
//       <ThemedText style={styles.price}>
//         {item.price.toLocaleString('vi-VN')}₫
//       </ThemedText>
//     </TouchableOpacity>
//   );

//   return (

    
//     <ThemedView style={styles.container}>
//       <ThemedText type="title" style={styles.header}>
//         Sản phẩm nổi bật
//       </ThemedText>
//       <FlatList
//         data={products}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={{ justifyContent: 'space-between' }}
//         contentContainerStyle={{ paddingBottom: 50 }}
//       />
//        <TouchableOpacity
//     style={styles.searchButton}
//     onPress={() => router.push('/search')}
//   >
//     <Ionicons name="search-outline" size={28} color="#fff" />
//   </TouchableOpacity>

//   <TouchableOpacity style={styles.button} onPress={() => router.push('/productDetail')}>
//     <ThemedText style={styles.buttonText}>Xem chi tiết</ThemedText>
//   </TouchableOpacity>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#f9f9f9',
//     borderRadius: 12,
//     padding: 10,
//     width: '45%', 
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 14,
//     marginBottom: 4,
//     color: '#333',
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1E90FF',
//   },
//    button: {
//     backgroundColor: '#1E90FF',
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   searchButton: {
//     position: 'absolute',
//     top: 50,       
//     right: 20,       
//     backgroundColor: '#1E90FF',
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 5,     
//   },
  

// });
