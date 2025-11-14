// import React from 'react';
// import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
// const gap = 4;

// type Props = {
//   medias: string[];
//   onPressImage?: (uri: string) => void; 
// };

// export default function NewsFeedImages({ medias, onPressImage }: Props) {
//   const count = medias.length;
//     const handlePress = (uri: string) => {
//     if (onPressImage) onPressImage(uri);
//   };

//   if (count === 0) return null;

//   if (count === 1) {
//     return (
//       <TouchableOpacity  onPress={() => handlePress(medias[0])}>
//          <Image
//         source={{ uri: medias[0] }}
//         style={{ width: screenWidth - 24, height: 200, borderRadius: 8 }}
//         resizeMode="cover"
//       />
//       </TouchableOpacity>
     
//     );
//   }

//   if (count === 2) {
//     return (
//       <View style={{ flexDirection: 'row', gap }}>
//         {medias.map((uri, i) => (
//        <TouchableOpacity key={i} onPress={() => handlePress(uri)}>
//           <Image
//             key={i}
//             source={{ uri }}
//             style={{ width: (screenWidth - 28) / 2, height: 150, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           </TouchableOpacity>
          
//         ))}
//       </View>
//     );
//   }

//   if (count === 3) {
//     return (
//       <View style={{ flexDirection: 'row', gap }}>
       
//            <Image
//           source={{ uri: medias[0] }}
//           style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
//           resizeMode="cover"
//         />
   
       
//         <View style={{ flexDirection: 'column', gap }}>
//           <Image
//             source={{ uri: medias[1] }}
//             style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           <Image
//             source={{ uri: medias[2] }}
//             style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   }

//   if (count === 4) {
//     return (
//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
//         {medias.map((uri, i) => (
//           <Image
//             key={i}
//             source={{ uri }}
//             style={{ width: (screenWidth - 36) / 2, height: 120, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//         ))}
//       </View>
//     );
//   }

//   if (count === 5) {
//     return (
//       <View style={{ gap }}>
//         <View style={{ flexDirection: 'row', gap }}>
//           <Image
//             source={{ uri: medias[0] }}
//             style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           <View style={{ flexDirection: 'column', gap }}>
//             <Image
//               source={{ uri: medias[1] }}
//               style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//             <Image
//               source={{ uri: medias[2] }}
//               style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//           </View>
//         </View>
//         <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
//           <Image
//             source={{ uri: medias[3] }}
//             style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           <Image
//             source={{ uri: medias[4] }}
//             style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//         </View>
//       </View>
//     );
//   }

//   if (count > 5) {
//     const extra = count - 5;
//     return (
//       <View style={{ gap }}>
//         <View style={{ flexDirection: 'row', gap }}>
//           <Image
//             source={{ uri: medias[0] }}
//             style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           <View style={{ flexDirection: 'column', gap }}>
//             <Image
//               source={{ uri: medias[1] }}
//               style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//             <Image
//               source={{ uri: medias[2] }}
//               style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//           </View>
//         </View>
//         <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
//           <Image
//             source={{ uri: medias[3] }}
//             style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//           <View style={{ position: 'relative' }}>
//             <Image
//               source={{ uri: medias[4] }}
//               style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//             <View style={{
//               position: 'absolute',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               backgroundColor: 'rgba(0,0,0,0.5)',
//               justifyContent: 'center',
//               alignItems: 'center',
//               borderRadius: 8
//             }}>
//               <Text style={{ color: '#fff', fontSize: 20 }}>+{extra}</Text>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return null;
// }


import React, { useState } from "react";
import {View,Image,StyleSheet,Text,Dimensions,TouchableOpacity,Modal,FlatList,Pressable,} from "react-native";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const gap = 4;

type Props = {
  medias: string[];
   onPressImage?: (uri: string) => void;
};

export default function NewsFeedImages({ medias,  onPressImage }: Props) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = medias.length;

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const closeViewer = () => setVisible(false);

  if (count === 0) return null;

  // Hiển thị lưới ảnh nhỏ trong bài viết
  const renderGrid = () => {
    if (count === 1) {
      return (
        <TouchableOpacity onPress={() => openViewer(0)}>
          <Image
            source={{ uri: medias[0] }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    if (count === 2) {
      return (
        <View style={styles.row}>
          {medias.map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => openViewer(i)}>
              <Image
                source={{ uri }}
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
            <Image
              source={{ uri: medias[0] }}
              style={styles.leftLarge}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <View style={styles.column}>
            {medias.slice(1, 3).map((uri, i) => (
              <TouchableOpacity
                key={i + 1}
                onPress={() => openViewer(i + 1)}
              >
                <Image
                  source={{ uri }}
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
          {medias.slice(0, 4).map((uri, i) => (
            <TouchableOpacity key={i} onPress={() => openViewer(i)}>
              <Image
                source={{ uri }}
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

  //Modal hiển thị ảnh lớn, có thể kéo qua lại
  return (
    <>
      {renderGrid()}

      <Modal visible={visible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <FlatList
            data={medias}
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
                <Image
                  source={{ uri: item }}
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
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap,
  },
  column: {
    flexDirection: "column",
    gap,
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap,
  },
  singleImage: {
    width: screenWidth - 24,
    height: 200,
    borderRadius: 8,
  },
  twoImage: {
    width: (screenWidth - 28) / 2,
    height: 150,
    borderRadius: 8,
  },
  leftLarge: {
    width: (screenWidth - 28) / 2 + 10,
    height: 150,
    borderRadius: 8,
  },
  rightSmall: {
    width: (screenWidth - 28) / 2 - 10,
    height: 70,
    borderRadius: 8,
  },
  gridImage: {
    width: (screenWidth - 36) / 2,
    height: 120,
    borderRadius: 8,
  },
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
  overlayText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
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
  fullImage: {
    width: screenWidth,
    height: screenHeight * 0.8,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
  },
});







// import React from 'react';
// import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

// const screenWidth = Dimensions.get('window').width;
// const gap = 4;

// type Props = {
//   medias: string[];
//   onPressImage?: (uri: string) => void; 
// };

// export default function NewsFeedImages({ medias, onPressImage }: Props) {
//   const count = medias.length;

//   const handlePress = (uri: string) => {
//     if (onPressImage) onPressImage(uri);
//   };

//   if (count === 0) return null;

//   // 1 ảnh
//   if (count === 1) {
//     return (
//       <TouchableOpacity onPress={() => handlePress(medias[0])}>
//         <Image
//           source={{ uri: medias[0] }}
//           style={{ width: screenWidth - 24, height: 200, borderRadius: 8 }}
//           resizeMode="cover"
//         />
//       </TouchableOpacity>
//     );
//   }

//   // 2 ảnh
//   if (count === 2) {
//     return (
//       <View style={{ flexDirection: 'row', gap }}>
//         {medias.map((uri, i) => (
//           <TouchableOpacity key={i} onPress={() => handlePress(uri)}>
//             <Image
//               source={{ uri }}
//               style={{ width: (screenWidth - 28) / 2, height: 150, borderRadius: 8 }}
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   }

//   // 3 ảnh
//   if (count === 3) {
//     return (
//       <View style={{ flexDirection: 'row', gap }}>
//         <TouchableOpacity onPress={() => handlePress(medias[0])}>
//           <Image
//             source={{ uri: medias[0] }}
//             style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//         <View style={{ flexDirection: 'column', gap }}>
//           {[1, 2].map(i => (
//             <TouchableOpacity key={i} onPress={() => handlePress(medias[i])}>
//               <Image
//                 source={{ uri: medias[i] }}
//                 style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
//                 resizeMode="cover"
//               />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     );
//   }

//   // 4 ảnh trở lên (tương tự)
//   return (
//     <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
//       {medias.map((uri, i) => (
//         <TouchableOpacity key={i} onPress={() => handlePress(uri)}>
//           <Image
//             source={{ uri }}
//             style={{ width: (screenWidth - 36) / 2, height: 120, borderRadius: 8, marginBottom: 4 }}
//             resizeMode="cover"
//           />
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }
