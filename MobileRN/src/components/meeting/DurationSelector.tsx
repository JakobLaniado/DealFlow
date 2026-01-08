import { colors, spacing, typography } from '@/utils/theme';
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
  options = [30, 60, 90, 120] 
}: DurationSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration (minutes)</Text>
      <View style={styles.selector}>
        {options.map((mins) => (
          <TouchableOpacity
            key={mins}
            style={[styles.button, value === mins && styles.buttonActive]}
            onPress={() => onChange(mins)}
          >
            <Text style={[styles.buttonText, value === mins && styles.buttonTextActive]}>
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
    ...typography.bodySmall,
    color: colors.textSecondary,
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
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  buttonTextActive: {
    color: colors.white,
  },
});
