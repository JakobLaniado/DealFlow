import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  showProfile?: boolean;
  onProfilePress?: () => void;
  logoSize?: number;
}

export const Header: React.FC<HeaderProps> = ({
  showProfile = true,
  onProfilePress,
  logoSize = 100,
}) => {
  const { colors } = useThemedStyles();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      {showProfile && (
        <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png') as ImageSourcePropType}
          style={[styles.logo, { width: logoSize, height: logoSize * 0.4 }]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  profileButton: {
    padding: spacing.xs,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    // Logo will maintain aspect ratio
  },
});
