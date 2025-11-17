import React, { useState } from "react";
import { Image, ImageProps } from "react-native";

const placeholder = "https://corvallisddc.org/wp-content/uploads/2021/10/placeholder-664.png";

type Props = ImageProps & {
  uri: string;
};

export default function ImageWithFallback({ uri, ...rest }: Props) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...rest}
      source={{ uri: error ? placeholder : uri }}
      onError={() => setError(true)}
    />
  );
}
