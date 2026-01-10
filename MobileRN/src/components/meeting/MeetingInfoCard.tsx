import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
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
  const { colors } = useThemedStyles();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.row}>
        <Text
          style={[
            valueStyle === 'link'
              ? [styles.linkValue, { color: colors.primary }]
              : [styles.value, { color: colors.text }],
          ]}
          numberOfLines={valueStyle === 'link' ? 1 : undefined}
        >
          {value}
        </Text>
        <TouchableOpacity
          onPress={onCopy}
          style={[styles.copyButton, { backgroundColor: colors.backgroundSecondary }]}
        >
          <Ionicons name="copy-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    flex: 1,
    fontWeight: '600',
    fontSize: 16,
  },
  linkValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  copyButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
    borderRadius: 6,
  },
});
