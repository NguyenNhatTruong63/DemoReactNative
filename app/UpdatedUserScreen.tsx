// import React from 'react';
// import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import AvatarPicker from './AvatarPicker'

// type Params = {
//   userData: string;
// };

// export default function UpdatedUserScreen() {
//   const { userData } = useLocalSearchParams() as Params;
//   const user = JSON.parse(userData);

//   const avatarUrl = user.avatar.startsWith('http')
//     ? user.avatar
//     : user.resourceUrl
//     ? `${user.resourceUrl}/${user.avatar}`
//     : '';

//   return (
//     <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#edf0f4ff' }}>
//       <AvatarPicker></AvatarPicker>
//       <View style={{ alignItems: 'center', marginBottom: 20 }}>
//         <Image source={{ uri: avatarUrl }} style={styles.avatar} />
//         <Text style={styles.name}>{user.name}</Text>
//         <Text style={styles.department}>{user.department_id || user.department_name || 'Không có bộ phận'}</Text>
//       </View>

//       <View style={styles.infoBlock}>
//         <Text>Ngày sinh: {user.birthday}</Text>
//         <Text>Giới tính: {user.gender === 1 ? 'Nam' : 'Nữ'}</Text>
//         <Text>Số điện thoại: {user.phone}</Text>
//         <Text>Email: {user.email}</Text>
//         <Text>CCCD: {user.id_card_number}</Text>
//         <Text>Địa chỉ: {user.address}</Text>
//       </View>

//       {user.branches?.length > 0 && (
//         <View style={{ marginTop: 20 }}>
//           <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Chi nhánh</Text>
//           {user.branches.map((b: any) => (
//             <View key={b.id} style={styles.branch}>
//               <Text style={{ fontWeight: '600' }}>{b.name}</Text>
//               <Text>Địa chỉ: {b.address}</Text>
//               <Text>Điện thoại: {b.phone}</Text>
//               <Text>Số lượng nhân viên: {b.user_count}</Text>
//             </View>
//           ))}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
//   name: { fontSize: 20, fontWeight: '700' },
//   department: { fontSize: 16, color: '#555' },
//   infoBlock: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
//   branch: { padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
// });



import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AvatarPicker from './AvatarPicker';

type Params = {
  userData?: string; // Có thể undefined nếu quên truyền
};

export default function UpdatedUserScreen() {
  const { userData } = useLocalSearchParams<Params>();
  let user: any = null;

  if (userData) {
    try {
      user = JSON.parse(decodeURIComponent(userData));
    } catch (err) {
      console.log('Lỗi parse userData:', err, userData);
    }
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Không có dữ liệu người dùng</Text>
      </View>
    );
  }

  const avatarUrl = user.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : user.resourceUrl
      ? `${user.resourceUrl}/${user.avatar}`
      : ''
    : 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

  return (
    <ScrollView style={styles.container}>
      <AvatarPicker avatar={user.avatar} />

      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.department}>
          {user.department_name || user.department_id || 'Không có bộ phận'}
        </Text>
      </View>

      <View style={styles.infoBlock}>
        <Text>Ngày sinh: {user.birthday || '-'}</Text>
        <Text>Ngày tham gia: {user.joining_date || '-'}</Text>
        <Text>Giới tính: {user.gender === 1 ? 'Nam' : user.gender === 0 ? 'Nữ' : '-'}</Text>
        <Text>Số điện thoại: {user.phone || '-'}</Text>
        <Text>Email: {user.email || '-'}</Text>
        <Text>CCCD: {user.id_card_number || '-'}</Text>
        <Text>Địa chỉ: {user.address || '-'}</Text>
      </View>

      {user.branches?.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Chi nhánh</Text>
          {user.branches.map((b: any) => (
            <View key={b.id} style={styles.branch}>
              <Text style={{ fontWeight: '600' }}>{b.name}</Text>
              <Text>Địa chỉ: {b.address}</Text>
              <Text>Điện thoại: {b.phone}</Text>
              <Text>Số lượng nhân viên: {b.user_count}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#edf0f4ff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: '700' },
  department: { fontSize: 16, color: '#555' },
  infoBlock: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  branch: { padding: 12, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 },
});
