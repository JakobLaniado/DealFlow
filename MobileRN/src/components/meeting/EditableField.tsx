import { useThemedStyles } from '@/hooks/useThemedStyles';
import { borderRadius, spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EditableFieldProps {
  label: string;
  displayValue: string;
  onEdit: () => void;
}

export function EditableField({
  label,
  displayValue,
  onEdit,
}: EditableFieldProps) {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.valueContainer,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.value, { color: colors.text }]}>{displayValue}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    padding: spacing.xs,
  },
  valueContainer: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    padding: spacing.xs,
    minHeight: 30,
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
  },
});
