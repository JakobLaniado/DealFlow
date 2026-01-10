import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  icon = 'settings-outline',
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const { colors } = useThemedStyles();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.toggle,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={onToggle}
      >
        <View style={styles.toggleLeft}>
          <Ionicons name={icon} size={20} color={colors.primary} />
          <Text style={[styles.toggleText, { color: colors.text }]}>{title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && children}
    </>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
