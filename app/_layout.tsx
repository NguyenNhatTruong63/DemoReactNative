
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerForPushNotificationsAsync } from './notifications';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
      <Toast
        config={{
          error: (props) => (
            <ErrorToast
              {...props}
              text1Style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
              text2Style={{ fontSize: 16, color: 'white', flexWrap: 'wrap' }}
              text2NumberOfLines={0}
              style={{
                borderLeftColor: 'red',
                paddingVertical: 20,
                paddingHorizontal: 15,
                minHeight: 90,
                borderRadius: 10,
              }}
            />
          ),
          success: (props) => (
            <BaseToast
              {...props}
              text1Style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}
              text2Style={{ fontSize: 16, color: 'white' }}
              style={{ borderLeftColor: 'green', padding: 15 }}
            />
          ),
        }}
      />
    </ThemeProvider>
  );
}
