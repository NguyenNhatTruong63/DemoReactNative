
import React, { useRef, useState, useLayoutEffect } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const navigation = useNavigation();


    useLayoutEffect(() => {
      navigation.setOptions({ title: "Chụp ảnh" });
    }, [navigation]);

  if (!permission) return null;

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
    try {
      if (!cameraRef.current) return;
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setPhotoUri(photo.uri);
      console.log("Đường dẫn ảnh vừa chụp:", photo?.uri)
    } catch (e) {
      console.error(e);
    }
  };



  // const takePicture = async () => {
  //   const photo = await cameraRef.current?.takePictureAsync({ quality: 0.8 })
  //   if (photo) setPhotoUri(photo.uri);
  //   console.log("Đường dẫn ảnh vừa chụp:", photo?.uri)
  // }

  // chup lai
  const handleRetake = () => {
    setPhotoUri(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {!photoUri && (
        <CameraView style={{ flex: 1 }} facing="front" ref={cameraRef} mirror={true} />
      )}

      {!photoUri && (
        <TouchableOpacity
          onPress={takePicture}
          style={styles.captureButton}
        >
          <Ionicons name="camera" size={50}></Ionicons>
        </TouchableOpacity>
      )}

      {photoUri && (
        <View style={styles.previewContainer}>

          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#4caf50" }]}
              onPress={() =>
                router.push({
                  pathname: "/timekeeping/Check-In",
                  params: { photoUri: photoUri },
                })
              }
            >
              <Text style={styles.actionText}>Tiếp tục</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#ff9800" }]}
              onPress={handleRetake}
            >
              <Text style={styles.actionText}>Chụp lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#2196f3" }]}
              onPress={() => router.push("/timekeeping/Attendance-Detail")}
            >
              <Text style={styles.actionText}>Quay lại</Text>
            </TouchableOpacity>
          </View>

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
  retakeButton: {},
  retakeText: { color: "#dc3545", fontSize: 16 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    width: "100%",
  },

  actionButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  previewContainer: {
    alignItems: "center",
    padding: 10,
  },

  previewImage: {
    marginTop: 20,
    width: 300,
    height: 500,
    borderRadius: 10,
    marginBottom: 20,
  },

});
