import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helperText?: string;
}

export function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  helperText,
}: FormInputProps) {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
      {helperText && (
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {helperText}
        </Text>
      )}
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
  input: {
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
