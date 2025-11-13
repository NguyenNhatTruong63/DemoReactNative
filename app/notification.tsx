// import { SearchParams } from 'expo-router';
// import { View, Text, FlatList } from 'react-native';

// export default function NotificationScreen({ params }: { params: { notifications?: string } }) {
//   // Nếu params được truyền từ router.push
//   const notifications = params?.notifications ? JSON.parse(params.notifications) : [];

//   return (
//     <View style={{ flex: 1, paddingTop: 50 }}>
//       <FlatList
//         data={notifications}
//         keyExtractor={(_, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
//             <Text style={{ fontWeight: 'bold' }}>{item.request?.content?.title || 'Thông báo'}</Text>
//             <Text>{item.request?.content?.body || ''}</Text>
//           </View>
//         )}
//         ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Chưa có thông báo nào</Text>}
//       />
//     </View>
//   );
// }

// import { View, Text, FlatList } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// type NotificationScreenParams = {
//   notifications?: string;
// };

// export default function NotificationScreen() {
//   const { notifications } = useLocalSearchParams<NotificationScreenParams>();
//   const notifList = notifications ? JSON.parse(notifications) : [];

//   return (
//     <View style={{ flex: 1, padding: 12 }}>
//       <FlatList
//         data={notifList}
//         keyExtractor={(_, i) => i.toString()}
//         renderItem={({ item }) => (
//           <View style={{ padding: 10, marginBottom: 8, backgroundColor: '#eee', borderRadius: 8 }}>
//             <Text style={{ fontWeight: 'bold' }}>{item.request?.content?.title}</Text>
//             <Text>{item.request?.content?.body}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }


// import { View, Text, FlatList } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';

// export default function NotificationScreen() {
//   const params = useLocalSearchParams();
//   const notifications = params.notifications
//     ? JSON.parse(params.notifications as string)
//     : [];

//   return (
//     <View style={{ flex: 1, padding: 12 }}>
//       <FlatList
//         data={notifications}
//         keyExtractor={(_, i) => i.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               padding: 10,
//               marginBottom: 8,
//               backgroundColor: '#eee',
//               borderRadius: 8,
//             }}
//           >
//             <Text style={{ fontWeight: 'bold' }}>
//               {item.request?.content?.title ?? 'Không có tiêu đề'}
//             </Text>
//             <Text>{item.request?.content?.body ?? 'Không có nội dung'}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
