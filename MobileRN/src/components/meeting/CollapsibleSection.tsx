import { colors, spacing, typography } from '@/utils/theme';
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
  return (
    <>
      <TouchableOpacity style={styles.toggle} onPress={onToggle}>
        <View style={styles.toggleLeft}>
          <Ionicons name={icon} size={20} color={colors.primary} />
          <Text style={styles.toggleText}>{title}</Text>
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
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
  },
});
