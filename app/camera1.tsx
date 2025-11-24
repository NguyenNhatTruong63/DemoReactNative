
// import React, { useState, useEffect, useRef } from "react";
// import { View, TouchableOpacity, Text, Image } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import Toast from "react-native-toast-message";
// import axios from "axios";
// import * as Location from "expo-location";
// import * as Device from "expo-device";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// type LocationType = { latitude: number; longitude: number };

// export default function CameraScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [photoUri, setPhotoUri] = useState<string | null>(null);
//   const [photoBase64, setPhotoBase64] = useState<string | null>(null);
//   const [location, setLocation] = useState<LocationType | null>(null);
//   const [address, setAddress] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   const cameraRef = useRef<CameraView>(null);

//   const [resourceUrl, setResourceUrl] = useState<string>('');

//   // Load resource URL
//   const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem('resource_url');
//       if (storedResource) {
//         setResourceUrl(storedResource);
//         return storedResource;
//       }

//       const publicRes = await axios.get(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//         { headers: { 'x-svc-id': 1153 } }
//       );

//       const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) {
//         await AsyncStorage.setItem('resource_url', url);
//         setResourceUrl(url);
//         return url;
//       }
//       return '';
//     } catch (err) {
//       console.log('Lỗi lấy resource URL:', err);
//       return '';
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Toast.show({ type: "error", text1: "Không có quyền truy cập vị trí" });
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation({
//         latitude: loc.coords.latitude,
//         longitude: loc.coords.longitude,
//       });

//       // Lấy địa chỉ
//       const addr = await Location.reverseGeocodeAsync(loc.coords);
//       if (addr.length > 0) {
//         const item = addr[0];
//         setAddress(`${item.name}, ${item.street}, ${item.city}`);
//       }
//     })();
//   }, []);

//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View>
//         <Text>Yêu cầu quyền sử dụng camera</Text>
//         <TouchableOpacity onPress={requestPermission}>
//           <Text>Cho phép</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }


//   const takePicture = async () => {
//     const photo = await cameraRef.current?.takePictureAsync({
//       base64: true,
//       quality: 0.7,
//     });

//     if (photo) {
//       setPhotoUri(photo.uri);
//       setPhotoBase64(photo.base64 || null);
//     }
//   };


//   // const handleCheckIn = async () => {
//   //   if (!location) {
//   //     Toast.show({ type: "error", text1: "Không lấy được vị trí" });
//   //     return;
//   //   }

//   //   if (!photoBase64) {
//   //     Toast.show({ type: "error", text1: "Chưa có ảnh để check-in" });
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const token = await AsyncStorage.getItem("access_token");

//   //     if (!token) {
//   //       Toast.show({ type: "error", text1: "Không tìm thấy token đăng nhập" });
//   //       return;
//   //     }

//   //     let ip = "unknown";
//   //     try {
//   //       const resIp = await axios.get("https://api.ipify.org?format=json");
//   //       ip = resIp.data.ip;
//   //     } catch { }

//   //     const device_id = Device.osInternalBuildId || Device.deviceName || "unknown";

//   //     await axios.post(
//   //       "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in",
//   //       {
//   //         latitude: String(location.latitude),
//   //         longitude: String(location.longitude),
//   //         ip,
//   //         device_id,
//   //         avatar: photoBase64, // BASE64
//   //         address,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "x-svc-id": 1153,
//   //         },
//   //       }
//   //     );

//   //     Toast.show({
//   //       type: "success",
//   //       text1: "Check-in thành công",
//   //       position: "top",
//   //       visibilityTime: 1500,
//   //       onHide: () => {
//   //         router.push("/attendanceDetail");
//   //       },
//   //     });

//   //   } catch (err) {
//   //     console.log("Check-in error:", err);
//   //     Toast.show({ type: "error", text1: "Check-in thất bại!" });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleCheckIn = async () => {
//   //   const resourceUrl = await loadResourceUrl(); // gọi API trước khi upload
//   //   console.log('Resource URL:', resourceUrl);
//   //   if (!photoUri) {
//   //     Toast.show({ type: "error", text1: "Chưa có ảnh để check-in" });
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const token = await AsyncStorage.getItem("access_token");
//   //     if (!token) {
//   //       Toast.show({ type: "error", text1: "Không tìm thấy token đăng nhập" });
//   //       return;
//   //     }

//   //     // Chuẩn bị file ảnh
//   //     const formData = new FormData();
//   //     formData.append("avatar", {
//   //       uri: photoUri,
//   //       name: "checkin.jpg",
//   //       type: "image/jpeg",
//   //     } as any);

//   //     // Gọi API check-in (KHÔNG gửi base64, không gửi location)
//   //     await axios.post(
//   //       "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in",
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //           "x-svc-id": 1153,
//   //         },
//   //       }
//   //     );

//   //     Toast.show({
//   //       type: "success",
//   //       text1: "Check-in thành công",
//   //       onHide: () => router.push("/attendanceDetail"),
//   //     });

//   //   } catch (err) {
//   //     console.log("Check-in error:", err);
//   //     Toast.show({ type: "error", text1: "Check-in thất bại!" });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleCheckIn = async () => {
//   //   const resourceUrl = await loadResourceUrl(); // load trước resource URL
//   //   if (!photoUri) {
//   //     Toast.show({ type: "error", text1: "Chưa có ảnh để check-in" });
//   //     return;
//   //   }

//   //   try {
//   //     setLoading(true);

//   //     const token = await AsyncStorage.getItem("access_token");
//   //     if (!token) {
//   //       Toast.show({ type: "error", text1: "Không tìm thấy token đăng nhập" });
//   //       return;
//   //     }

//   //     // Lấy tọa độ
//   //     let latitude = "0";
//   //     let longitude = "0";
//   //     try {
//   //       const { status } = await Location.requestForegroundPermissionsAsync();
//   //       if (status === "granted") {
//   //         const loc = await Location.getCurrentPositionAsync({});
//   //         latitude = loc.coords.latitude.toString();
//   //         longitude = loc.coords.longitude.toString();
//   //       }
//   //     } catch (e) {
//   //       console.log("Lỗi lấy vị trí:", e);
//   //     }

//   //     // Lấy IP
//   //     let ip = "unknown";
//   //     try {
//   //       const resIp = await axios.get("https://api.ipify.org?format=json");
//   //       ip = resIp.data.ip;
//   //     } catch { }

//   //     // Device
//   //     const device_id = Device.osInternalBuildId || Device.deviceName || "unknown";

//   //     // Địa chỉ (optional, nếu muốn)
//   //     let address = "";
//   //     try {
//   //       if (latitude && longitude !== "0") {
//   //         const addrObj = await Location.reverseGeocodeAsync({
//   //           latitude: parseFloat(latitude),
//   //           longitude: parseFloat(longitude),
//   //         });
//   //         if (addrObj.length > 0) {
//   //           const a = addrObj[0];
//   //           address = `${a.name || ""}, ${a.street || ""}, ${a.city || ""}, ${a.region || ""}, ${a.postalCode || ""}, ${a.country || ""}`;
//   //         }
//   //       }
//   //     } catch { }

//   //     // Upload ảnh bằng FormData
//   //     const formData = new FormData();
//   //     formData.append("avatar", {
//   //       uri: photoUri,
//   //       name: "checkin.jpg",
//   //       type: "image/jpeg",
//   //     } as any);

//   //     // Gọi API check-in
//   //     const res = await axios.post(
//   //       "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-in",
//   //       formData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //           "x-svc-id": 1153,
//   //         },
//   //         params: {
//   //           latitude,
//   //           longitude,
//   //           ip,
//   //           device_id,
//   //           address,
//   //         },
//   //       }
//   //     );

//   //     console.log("Check-in success:", res.data);
//   //     Toast.show({
//   //       type: "success",
//   //       text1: "Check-in thành công",
//   //       onHide: () => router.push("/attendanceDetail"),
//   //     });
//   //   } catch (err) {
//   //     console.log("Check-in error:", err);
//   //     Toast.show({ type: "error", text1: "Check-in thất bại!" });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };








//   return (
//     <View style={{ flex: 1 }}>

//       {!photoUri && (
//         <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
//       )}

//       {!photoUri && (
//         <TouchableOpacity
//           onPress={takePicture}
//           style={{ position: "absolute", bottom: 40, alignSelf: "center" }}
//         >
//           <Ionicons name="camera" size={60} color="#fff" />
//         </TouchableOpacity>
//       )}

//       {/* PREVIEW ẢNH */}
//       {photoUri && (
//         <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//           <Image
//             source={{ uri: photoUri }}
//             style={{ width: 400, height: 400, borderRadius: 10 }}
//           />

//           <TouchableOpacity
//             onPress={handleCheckIn}
//             style={{
//               marginTop: 20,
//               backgroundColor: "#007AFF",
//               padding: 15,
//               borderRadius: 10,
//             }}
//           >
//             <Text style={{ color: "white", fontSize: 18 }}>Gửi Check-in</Text>
//           </TouchableOpacity>


//           <TouchableOpacity
//             onPress={() => setPhotoUri(null)}
//             style={{
//               marginTop: 15,
//             }}
//           >
//             <Text style={{ color: "red" }}>Chụp lại</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

import React, { useRef, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text>Yêu cầu quyền camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={{ color: "#fff" }}>Cho phép</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
    if (photo) setPhotoUri(photo.uri);
    console.log("Đường dẫn ảnh vừa chụp:", photo?.uri);
  };

  // const handleNext = () => {
  //   // Chuyển trang, có thể truyền photoUri nếu cần
  //   router.push({ pathname: "/NextScreen", params: { photoUri } });
  // };

  const handleRetake = () => {
    setPhotoUri(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {!photoUri && (
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
      )}

      {!photoUri && (
        <TouchableOpacity
          onPress={takePicture}
          style={styles.captureButton}
        >
          <Text style={{ fontSize: 30 }}>📸</Text>
        </TouchableOpacity>
      )}

      {photoUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/attendanceDetail')}>
            <Text style={styles.actionText}>Tiếp tục</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeText}>Chụp lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#00000080",
    padding: 15,
    borderRadius: 50,
  },
  previewContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  previewImage: { width: 300, height: 400, borderRadius: 10, marginBottom: 20 },
  actionButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionText: { color: "#fff", fontSize: 18 },
  retakeButton: {},
  retakeText: { color: "#dc3545", fontSize: 16 },
});




// import React, { useState, useEffect, useLayoutEffect } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import Toast from 'react-native-toast-message';
// import DateTimePicker from "@react-native-community/datetimepicker";
// import AvatarPicker from "./AvatarPicker";
// import CheckInScreen from "./checkIn";
// import { router } from "expo-router";
// import * as Location from 'expo-location';
// import * as Device from 'expo-device';
// import { Ionicons } from "@expo/vector-icons";





// type AttendanceItemDetail = {
//     id: string;
//     date: string;
//     check_in_at: string;
//     check_out_at: string;
//     location_in_status: string,
//     address_check_in: string,
//     avatar_check_in: string
//     employee: {
//         id: number;
//         name: string;
//         avatar: string;
//     };
//     working_schedule: {
//         weekday: number,
//         start_time: string,
//         end_time: string,
//         is_active: number
//     }
// };



// export default function AttendanceDetailScreen() {
//     const navigation = useNavigation();
//     const [loading, setLoading] = useState(false)
//     const [showPicker, setShowPicker] = useState(false)
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [attendanceList, setAttendanceList] = useState<AttendanceItemDetail[]>([]);
//     const [checkedOutToday, setCheckedOutToday] = useState(false);
//     const [photoUri, setPhotoUri] = useState<string | null>(null);
    
//     const [resourceUrl, setResourceUrl] = useState<string>('');


//     // const [customDate, setCustomDate] = useState<Date | null>(null);

//     const loadResourceUrl = async () => {
//     try {
//       const storedResource = await AsyncStorage.getItem('resource_url');
//       if (storedResource) {
//         setResourceUrl(storedResource);
//         return storedResource;
//       }

//       const publicRes = await axios.get(
//         'https://beta.api.gateway.overate-vntech.com/api/v1/settings/public',
//         { headers: { 'x-svc-id': 1153 } }
//       );

//       const url = publicRes.data?.data?.CONFIG_RESOURCE_URL ?? '';
//       if (url) {
//         await AsyncStorage.setItem('resource_url', url);
//         setResourceUrl(url);
//         return url;
//       }
//       return '';
//     } catch (err) {
//       console.log('Lỗi lấy resource URL:', err);
//       return '';
//     }
//   };




//     useLayoutEffect(() => {
//         navigation.setOptions({ title: "Chi tiết chấm công" });
//     }, [navigation]);

//     const formatDate = (d: Date) => {
//         const day = d.getDate();
//         const month = d.getMonth() + 1;
//         const year = d.getFullYear();
//         return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
//     };



//     const onChangeDate = (event: any, date?: Date) => {
//         setShowPicker(false);

//         if (date) {
//             setSelectedDate(date);
//             fetchAttendanceList(date);
//         }
//     };



//     const fetchAttendanceList = async (dateObj?: Date) => {
//         const token = await AsyncStorage.getItem('access_token');
//         const userId = await AsyncStorage.getItem('user_id');

//         if (!token || !userId) {
//             Toast.show({ type: "error", text1: "Token hoặc userId không tồn tại" });
//             return;
//         }


//         try {
//             // const today = new Date();
//             //  const dateObj = customDate || new Date();
//             //  const dateObj = customDate || new Date();
//             // const date = formatDate(selectedDate);
//             const dateToSend = formatDate(dateObj || selectedDate);
//             //  const date = formatDate(dateObj);
//             // const date = [
//             //     String(today.getDate()).padStart(2, "0"),        // dd
//             //     String(today.getMonth() + 1).padStart(2, "0"),   // mm
//             //     today.getFullYear()                              // yyyy
//             // ].join("/");
//             // console.log(month);
//             setLoading(true);
//             const res = await axios.get(
//                 "https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/detail",
//                 {
//                     headers:
//                     {
//                         Authorization: `Bearer ${token}`,
//                         "x-svc-id": 1153
//                     },
//                     params:
//                     {
//                         date: dateToSend,
//                         user_id: userId
//                     },
//                 }

//             );

//             // const dataObject = res.data?.data;
//             // const dataArray = dataObject ? [dataObject] : [];
//             // setAttendanceList(dataArray);
//             const detail = res.data?.data;
//             const list = detail ? [detail] : [];

//             setAttendanceList(list);


//             // const data: AttendanceItemDetail[] = res.data?.data || [];
//             // setAttendanceList(data);
//         } catch (err) {
//             console.log("FETCH ATTENDANCE ERROR", err);
//             Toast.show({
//                 type: "error",
//                 text1: "Không tải được danh sách chấm công"
//             });
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         fetchAttendanceList();
//     }, []);


//     const handleCheckOut = async () => {
//         try {
//             const token = await AsyncStorage.getItem('access_token');
//             const userId = await AsyncStorage.getItem('user_id');
//             const avatar = (await AsyncStorage.getItem('user_avatar')) || '';

//             if (!token || !userId) {
//                 Toast.show({ type: 'error', text1: 'Token hoặc userId không tồn tại' });
//                 return;
//             }

//             //Lấy tọa độ
//             const { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 Toast.show({ type: 'error', text1: 'Cần quyền truy cập vị trí' });
//                 return;
//             }
//             const location = await Location.getCurrentPositionAsync({});
//             const latitude = location.coords.latitude.toString();
//             const longitude = location.coords.longitude.toString();

//             // Lấy địa chỉ từ tọa độ (reverse geocode)
//             const [addrObj] = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude });
//             const address = `${addrObj.street || ''}, ${addrObj.city || ''}`.trim();

//             // Lấy device ID
//             const device_id = Device.osInternalBuildId || Device.deviceName || 'unknown';

//             // Lấy IP public
//             let ip = 'unknown';
//             try {
//                 const resIp = await axios.get('https://api.ipify.org?format=json');
//                 ip = resIp.data.ip;
//             } catch (e) {
//                 console.log('Lỗi lấy IP:', e);
//             }

//             // Gọi API check-in
//             const res = await axios.post(
//                 'https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records/check-out',
//                 {
//                     latitude,
//                     longitude,
//                     ip,
//                     device_id,
//                     avatar,
//                     address,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'x-svc-id': 1153,
//                     },
//                 }
//             );

//             console.log('Check-out success:', res.data);
//             Toast.show({ type: 'success', text1: 'Check out thành công!' });
//         } catch (err) {
//             console.log('Check-out error:', err);
//             Toast.show({ type: 'error', text1: 'check out thất bại' });
//         }
//     };

//     useEffect(() => {
//         const checkToday = async () => {
//             const token = await AsyncStorage.getItem('access_token');
//             const userId = await AsyncStorage.getItem('user_id');
//             if (!token || !userId) return;

//             try {
//                 const now = new Date();
//                 const month = `${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`;
//                 const res = await axios.get(
//                     'https://beta.api.gateway.overate-vntech.com/api/v1/attendance-records',
//                     {
//                         headers: { Authorization: `Bearer ${token}`, 'x-svc-id': 1153 },
//                         params: { month, user_id: userId }
//                     }
//                 );

//                 const records: AttendanceItemDetail[] = res.data?.data || [];
//                 const today = new Date();
//                 const hasCheckIn = records.some(r => {
//                     const d = new Date(r.check_in_at || r.date);
//                     return (
//                         d.getDate() === today.getDate() &&
//                         d.getMonth() === today.getMonth() &&
//                         d.getFullYear() === today.getFullYear()
//                     );
//                 });

//                 const hasCheckOut = records.some(r => {
//                     const d = new Date(r.check_out_at || r.date);
//                     return (
//                         d.getDate() === today.getDate() &&
//                         d.getMonth() === today.getMonth() &&
//                         d.getFullYear() === today.getFullYear()
//                     );
//                 });

//                 setCheckedOutToday(hasCheckOut);
//             } catch (err) {
//                 console.log('Error fetching attendance:', err);
//             }
//         };

//         checkToday();
//     }, []);



//     const renderItem = ({ item }: { item: AttendanceItemDetail }) => (
        

//         <View style={styles.itemContainer}>
//             <View>
//                 <Image source={{ uri: resourceUrl + "/" + item.employee.avatar   }} style={styles.imageAvata} />
// {/* 
//                 <Image
//                     source={{ uri: `data:image/jpeg;base64,${item.employee.avatar}` }}
//                     style={styles.imageAvata}
//                 /> */}
//                 {/* <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }}>
//                     <Image
//                         source={{ uri: item.employee.avatar }}
//                         // source={photoUri ? { uri: photoUri } : require("../assets/images/icon.png")}
//                         style={styles.imageAvata}
//                     />
//                     <Ionicons name="camera" size={25} color="#007AFF" style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 }} />
//                 </TouchableOpacity> */}
//             </View>
//             <View>
//                 <Text>{item.employee.avatar}</Text>
//             </View>
//             <TouchableOpacity>
//                 <Text style={styles.itemText}>Ngày: {item.date}</Text>
//                 <Text style={styles.itemText}>Tên: {item.employee.name}</Text>
//                 <Text style={styles.itemText}>Check-in: {item.check_in_at}</Text>
//                 <Text style={styles.itemText}>Check-out: {item.check_out_at}</Text>
//                 <Text style={styles.itemText}>Địa chỉ check-in: {item.address_check_in}</Text>
//             </TouchableOpacity>

//         </View>
//     );

//     return (

//         <View style={styles.container}>
//             {/* <View>
//                 <TouchableOpacity style={{ alignSelf: "center", marginBottom: 20 }}>
//                     <Image
//                         source={photoUri ? { uri: photoUri } : require("../assets/images/icon.png")}
//                         style={styles.imageAvata}
//                     />
//                     <Ionicons name="camera" size={25} color="#007AFF" style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 2 }} />
//                 </TouchableOpacity>
//             </View> */}
//             {/* <View>

//                 <AvatarPicker></AvatarPicker>
//             </View> */}
//             <TouchableOpacity
//                 style={styles.dateButton}
//                 onPress={() => setShowPicker(true)}
//             >
//                 <Text style={styles.dateButtonText}>
//                     Ngày: {formatDate(selectedDate)}
//                 </Text>
//             </TouchableOpacity>

//             {showPicker && (
//                 <DateTimePicker
//                     value={selectedDate}
//                     mode="date"
//                     display="default"
//                     onChange={onChangeDate}
//                 />
//             )}


//             {loading ? (
//                 <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
//             ) : (
//                 <FlatList
//                     data={attendanceList}
//                     keyExtractor={(item) => item.id}
//                     renderItem={renderItem}
//                     contentContainerStyle={{ paddingBottom: 20 }}
//                 />

//             )}


//             {/* <View>
                
//                 <TouchableOpacity style={styles.button} onPress={() => router.push('/checkIn')}>
//                     <Text style={styles.buttonText}>Check In</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button} onPress={handleCheckOut}>
//                     <Text style={styles.buttonText}>Check Out</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button} onPress={() => router.push('/attendance')}>
//                     <Text style={styles.buttonText}>Xem lịch sử</Text>
//                 </TouchableOpacity>
//             </View> */}

//             <View style={styles.fabContainer}>
//                 <View style={styles.fabItem}>
//                     <TouchableOpacity style={[styles.fabButton, { backgroundColor: '#28a745' }]} onPress={() => router.push('/CameraScreen')}>
//                         <Ionicons name="log-in-outline" size={28} color="#fff" />
//                     </TouchableOpacity>
//                     <Text style={styles.fabText}>Check In</Text>
//                 </View>

//                 <View style={styles.fabItem}>
//                     <TouchableOpacity style={[styles.fabButton, { backgroundColor: '#dc3545' }]} onPress={handleCheckOut}>
//                         <Ionicons name="log-out-outline" size={28} color="#fff" />
//                     </TouchableOpacity>
//                     <Text style={styles.fabText}>Check Out</Text>
//                 </View>

//                 <View style={styles.fabItem}>
//                     <TouchableOpacity style={[styles.fabButton, { backgroundColor: '#007bff' }]} onPress={() => router.push('/attendance')}>
//                         <Ionicons name="time-outline" size={28} color="#fff" />
//                     </TouchableOpacity>
//                     <Text style={styles.fabText}>Lịch sử</Text>
//                 </View>
//             </View>



//         </View>
//     )

// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         padding: 16
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginVertical: 10
//     },
//     button: {
//         backgroundColor: '#007AFF',
//         paddingVertical: 14,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginBottom: 12
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: '600'
//     },
//     itemContainer: {
//         backgroundColor: '#f5f5f5',
//         padding: 12,
//         borderRadius: 8,
//         marginBottom: 10
//     },
//     itemText: {
//         fontSize: 14,
//         marginBottom: 2
//     },
//     dateButton: {
//         padding: 12,
//         backgroundColor: "#007AFF",
//         borderRadius: 8,
//         marginBottom: 12,
//     },
//     dateButtonText: {
//         color: "#fff",
//         fontSize: 16,
//         textAlign: "center",
//         fontWeight: "600",
//     },

//     fabContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginTop: 20,
//     },
//     fabItem: {
//         alignItems: 'center', // căn giữa icon + text
//     },
//     fabButton: {
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4.65,
//         elevation: 8,
//         marginBottom: 4, // khoảng cách giữa icon và text
//     },
//     fabText: {
//         marginTop: 4,
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#333',
//         textAlign: 'center',
//     },
//     imageAvata: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: "#ccc"
//     }



// });

