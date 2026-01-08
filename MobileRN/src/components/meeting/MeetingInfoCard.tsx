import { colors, spacing, typography } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MeetingInfoCardProps {
  icon: string;
  label: string;
  value: string;
  onCopy: () => void;
  valueStyle?: 'default' | 'link';
}

export function MeetingInfoCard({
  icon,
  label,
  value,
  onCopy,
  valueStyle = 'default',
}: MeetingInfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[
            valueStyle === 'link' ? styles.linkValue : styles.value,
          ]}
          numberOfLines={valueStyle === 'link' ? 1 : undefined}
        >
          {value}
        </Text>
        <TouchableOpacity onPress={onCopy} style={styles.copyButton}>
          <Ionicons name="copy-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    ...typography.body,
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
  },
  linkValue: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.primary,
    fontWeight: '500',
  },
  copyButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
});
