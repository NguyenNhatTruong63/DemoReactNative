// // PushNotificationConfig.ts
// import * as Notifications from 'expo-notifications';
// import { Platform } from 'react-native';
// import Constants from 'expo-constants';

// let notificationListener: (notif: any) => void = () => {};
// export const setNotificationListener = (listener: (notif: any) => void) => {
//   notificationListener = listener;
// };

// // Chỉ cấu hình khi không phải Android + Expo Go
// export const configureNotifications = async () => {
//   if (Platform.OS === 'android' && Constants.appOwnership === 'expo') {
//     console.log("Android Expo Go không hỗ trợ notifications");
//     return;
//   }

//   // Request permission
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== 'granted') {
//     console.log('Permission not granted!');
//     return;
//   }

//   // Listener khi notification tới foreground
//   Notifications.addNotificationReceivedListener((notif) => {
//     notificationListener(notif);
//   });

//   // Listener khi notification được tương tác
//   Notifications.addNotificationResponseReceivedListener((response) => {
//     notificationListener(response.notification);
//   });
// };
