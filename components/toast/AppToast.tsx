import React from 'react';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const AppToast = () => {
  return (
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
  );
};
