import { borderRadius, colors, spacing, typography } from '@/utils/theme';
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
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{displayValue}</Text>
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
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  editButton: {
    padding: spacing.xs,
  },
  valueContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xs,
    minHeight: 30,
    justifyContent: 'center',
  },
  value: {
    ...typography.body,
    color: colors.text,
  },
});
