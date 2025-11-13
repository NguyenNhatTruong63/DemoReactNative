import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const gap = 4;

type Props = {
  medias: string[];
  onPressImage?: (uri: string) => void; 
};

export default function NewsFeedImages({ medias, onPressImage }: Props) {
  const count = medias.length;
    const handlePress = (uri: string) => {
    if (onPressImage) onPressImage(uri);
  };

  if (count === 0) return null;

  if (count === 1) {
    return (
      <TouchableOpacity  onPress={() => handlePress(medias[0])}>
         <Image
        source={{ uri: medias[0] }}
        style={{ width: screenWidth - 24, height: 200, borderRadius: 8 }}
        resizeMode="cover"
      />
      </TouchableOpacity>
     
    );
  }

  if (count === 2) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
        {medias.map((uri, i) => (
       <TouchableOpacity key={i} onPress={() => handlePress(uri)}>
          <Image
            key={i}
            source={{ uri }}
            style={{ width: (screenWidth - 28) / 2, height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          </TouchableOpacity>
          
        ))}
      </View>
    );
  }

  if (count === 3) {
    return (
      <View style={{ flexDirection: 'row', gap }}>
       
           <Image
          source={{ uri: medias[0] }}
          style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
          resizeMode="cover"
        />
   
       
        <View style={{ flexDirection: 'column', gap }}>
          <Image
            source={{ uri: medias[1] }}
            style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Image
            source={{ uri: medias[2] }}
            style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  if (count === 4) {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {medias.map((uri, i) => (
          <Image
            key={i}
            source={{ uri }}
            style={{ width: (screenWidth - 36) / 2, height: 120, borderRadius: 8 }}
            resizeMode="cover"
          />
        ))}
      </View>
    );
  }

  if (count === 5) {
    return (
      <View style={{ gap }}>
        <View style={{ flexDirection: 'row', gap }}>
          <Image
            source={{ uri: medias[0] }}
            style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={{ flexDirection: 'column', gap }}>
            <Image
              source={{ uri: medias[1] }}
              style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Image
              source={{ uri: medias[2] }}
              style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
          <Image
            source={{ uri: medias[3] }}
            style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
            resizeMode="cover"
          />
          <Image
            source={{ uri: medias[4] }}
            style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
            resizeMode="cover"
          />
        </View>
      </View>
    );
  }

  if (count > 5) {
    const extra = count - 5;
    return (
      <View style={{ gap }}>
        <View style={{ flexDirection: 'row', gap }}>
          <Image
            source={{ uri: medias[0] }}
            style={{ width: (screenWidth - 28) / 2 + 10, height: 150, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={{ flexDirection: 'column', gap }}>
            <Image
              source={{ uri: medias[1] }}
              style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
              resizeMode="cover"
            />
            <Image
              source={{ uri: medias[2] }}
              style={{ width: (screenWidth - 28) / 2 - 10, height: 70, borderRadius: 8 }}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
          <Image
            source={{ uri: medias[3] }}
            style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
            resizeMode="cover"
          />
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: medias[4] }}
              style={{ width: (screenWidth - 28) / 2 - 2, height: 100, borderRadius: 8 }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8
            }}>
              <Text style={{ color: '#fff', fontSize: 20 }}>+{extra}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
}


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
