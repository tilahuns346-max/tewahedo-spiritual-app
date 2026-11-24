import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface CrossLogoProps {
  size?: number;
}

export const CrossLogo: React.FC<CrossLogoProps> = ({ size = 48 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={require('../assets/images/app_logo_cross.png')}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
  },
});

export default CrossLogo;
