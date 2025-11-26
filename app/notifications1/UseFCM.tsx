import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function useFCM() {
  useEffect(() => {
    const getToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
      }
    };

    getToken();

    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Foreground Message:', remoteMessage);
    });

    return unsubscribe;
  }, []);
}
