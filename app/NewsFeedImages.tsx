
import React, { useState } from "react";
import {View,TouchableOpacity,Modal,FlatList,Pressable,Text,StyleSheet,Dimensions} from "react-native";
import ImageWithFallback from "./ImageWithFallback"; 

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const gap = 4;
const resourceBase = "https://beta.api.gateway.overate-vntech.com";

type MediaItem = {
  url: string;
  type?: number;
};

type Props = {
  medias: (string | MediaItem)[];
  onPressImage?: (uri: string) => void;
};

export default function NewsFeedImages({ medias, onPressImage }: Props) {
  const normalized = medias
    .map((m) => {
      if (!m) return null;

      if (typeof m === "string") {
        return m.startsWith("http") ? m : `${resourceBase}${m}`;
      }

      if (typeof m === "object" && m.url) {
        return m.url.startsWith("http") ? m.url : `${resourceBase}${m.url}`;
      }

      return null;
    })
    .filter(Boolean) as string[];

  const count = normalized.length;
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const closeViewer = () => setVisible(false);

  if (count === 0) return null; // Không hiển thị gì nếu không có ảnh

  const renderGrid = () => {
    if (count === 1) {
      return (
        <TouchableOpacity onPress={() => openViewer(0)}>
          <ImageWithFallback
            uri={normalized[0]}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    if (count === 2) {
      return (
        <View style={styles.row}>
          {normalized.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => openViewer(i)}>
              <ImageWithFallback
                uri={uri}
                style={styles.twoImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    if (count === 3) {
      return (
        <View style={styles.row}>
          <TouchableOpacity onPress={() => openViewer(0)}>
            <ImageWithFallback
              uri={normalized[0]}
              style={styles.leftLarge}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.column}>
            {normalized.slice(1, 3).map((uri, i) => (
              <TouchableOpacity key={i + 1} onPress={() => openViewer(i + 1)}>
                <ImageWithFallback
                  uri={uri}
                  style={styles.rightSmall}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (count >= 4) {
      return (
        <View style={styles.wrap}>
          {normalized.slice(0, 4).map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => openViewer(i)}>
              <ImageWithFallback
                uri={uri}
                style={styles.gridImage}
                resizeMode="cover"
              />
              {i === 3 && count > 4 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{count - 4}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }
  };
  return (
    <>
      {renderGrid()}

      {/* Modal hiển thị ảnh lớn */}
      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <FlatList
            data={normalized}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentIndex}
            keyExtractor={(_, i) => i.toString()}
            getItemLayout={(_, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <ImageWithFallback
                  uri={item}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            )}
          />
          <Pressable style={styles.closeButton} onPress={closeViewer}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap },
  column: { flexDirection: "column", gap },
  wrap: { flexDirection: "row", flexWrap: "wrap", gap },

  singleImage: { width: screenWidth - 24, height: 200, borderRadius: 8 },
  twoImage: { width: (screenWidth - 28) / 2, height: 150, borderRadius: 8 },
  leftLarge: { width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 },
  rightSmall: { width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 },
  gridImage: { width: (screenWidth - 36) / 2, height: 120, borderRadius: 8 },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  overlayText: { color: "#fff", fontSize: 20, fontWeight: "bold" },

  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: screenWidth, height: screenHeight * 0.8 },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  closeText: { color: "#fff", fontSize: 18 },
});

