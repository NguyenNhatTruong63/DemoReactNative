// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import Constants from 'expo-constants';

// // Cấu hình notification handler (hiển thị khi app foreground)
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//     shouldShowBanner: true, // thêm
//     shouldShowList: true,   // thêm
//   }),
// });

// export async function registerForPushNotificationsAsync(): Promise<string | null> {
//   let token: string | null = null;

//   if (!Device.isDevice) {
//     console.warn('Push notifications chỉ hoạt động trên thiết bị thật!');
//     return null;
//   }

//   // 1. Kiểm tra quyền notification
//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     console.warn('Không có quyền nhận notification!');
//     return null;
//   }

//   // 2. Lấy token Expo push
//   const projectId =
//     Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

//   const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
//   token = tokenData.data;

//   console.log('✅ Expo Push Token:', token);
//   return token;
// }



import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Cấu hình notification handler (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('Push notifications chỉ hoạt động trên thiết bị thật!');
    return null;
  }

  // 1. Kiểm tra quyền notification
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Không có quyền nhận notification!');
    return null;
  }

  // 2. Lấy projectId từ app.json
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

  if (!projectId) {
    throw new Error('ProjectId không được tìm thấy trong app.json hoặc eas.json!');
  }

  // 3. Lấy Expo Push Token
  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  const expoPushToken = tokenData.data;

  console.log('✅ Expo Push Token:', expoPushToken);
  return expoPushToken;

}


// notifications.ts
// import messaging from '@react-native-firebase/messaging';
// import { Alert } from 'react-native';

// export async function registerFirebasePush() {
//   // 1. Yêu cầu quyền (iOS)
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (!enabled) {
//     console.log('Permission not granted for notifications');
//     return null;
//   }

//   // 2. Lấy token FCM
//   const fcmToken = await messaging().getToken();
//   console.log('✅ FCM Token:', fcmToken);

//   // 3. Lắng nghe notification khi app foreground
//   messaging().onMessage(async remoteMessage => {
//     console.log('Foreground message:', remoteMessage);
//     Alert.alert('Notification', remoteMessage.notification?.title || 'New message');
//   });

//   // 4. Lắng nghe notification khi app background / killed
//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Background message:', remoteMessage);
//   });

//   return fcmToken;
// }
