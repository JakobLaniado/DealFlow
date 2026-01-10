import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
  options?: number[];
}

export function DurationSelector({
  value,
  onChange,
  options = [30, 60, 90, 120],
}: DurationSelectorProps) {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Duration (minutes)
      </Text>
      <View style={styles.selector}>
        {options.map(mins => (
          <TouchableOpacity
            key={mins}
            style={[
              styles.button,
              { backgroundColor: colors.surface, borderColor: colors.border },
              value === mins && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => onChange(mins)}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.textSecondary },
                value === mins && { color: colors.white },
              ]}
            >
              {mins}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
