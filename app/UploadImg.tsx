import React, { useState } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

type UploadImgProps = {
  onUploadComplete: (paths: string[]) => void;
};

export default function UploadImg({ onUploadComplete }: UploadImgProps) {
  const [uploading, setUploading] = useState(false);

  const handlePickAndUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (result.canceled) return;

    setUploading(true);

    const formData = new FormData();
    result.assets.forEach((a, i) => {
      formData.append("files", {
        uri: a.uri,
        name: `image${i}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    formData.append("types", "1");

    try {
      const res = await axios.post(
        "https://beta.api.gateway.overate-vntech.com/api/v1/upload/files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-svc-id": 1167,
          },
        }
      );

      const fileObjs = res.data?.data || [];
      const paths = fileObjs.map((f: any) => f.path);

      console.log("UPLOAD DONE PATHS:", paths);

      onUploadComplete(paths);
    } catch (err) {
      console.log("ERR UPLOAD:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{top: 10}}>
      <Button title="Chọn và upload ảnh" onPress={handlePickAndUpload} />
      {uploading && <ActivityIndicator size="large" style={{ marginTop: 10,  }} />}
    </View>
  );
}

