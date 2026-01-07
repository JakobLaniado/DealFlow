import React from 'react';
import { Image, StyleSheet, View, ImageSourcePropType } from 'react-native';

interface DealFlowLogoProps {
  size?: number;
  style?: any;
}

export const DealFlowLogo: React.FC<DealFlowLogoProps> = ({
  size = 120,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('@/assets/images/logo.png') as ImageSourcePropType}
        style={[styles.logo, { width: size, height: size * 0.4 }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Logo will maintain aspect ratio
  },
});



