import Toast from "react-native-toast-message";

let isShowingToast = false;

const showToast = (options: any) => {
  if (isShowingToast) return;

  isShowingToast = true;
  Toast.show(options);

  setTimeout(() => {
    isShowingToast = false;
  }, 1200); // tránh spam Toast
};

export const ToastHelper = {
  success: (message: string, title = "Thông báo") => {
    showToast({
      type: "success",
      text1: title,
      text2: message,
      position: "top",
    });
  },

  error: (message: string, title = "Lỗi") => {
    showToast({
      type: "error",
      text1: title,
      text2: message,
      position: "top",
    });
  },

  info: (message: string, title = "Thông báo") => {
    showToast({
      type: "info",
      text1: title,
      text2: message,
      position: "top",
    });
  },

  // Cho phép custom toàn bộ options
  custom: (options: any) => showToast(options),
};
