import { colors, spacing, typography } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type MeetingType = 'instant' | 'scheduled';

interface MeetingTypeSelectorProps {
  value: MeetingType;
  onChange: (type: MeetingType) => void;
}

export function MeetingTypeSelector({ value, onChange }: MeetingTypeSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meeting Type</Text>
      <View style={styles.selector}>
        <TouchableOpacity
          style={[styles.button, value === 'instant' && styles.buttonActive]}
          onPress={() => onChange('instant')}
        >
          <Ionicons
            name="flash"
            size={20}
            color={value === 'instant' ? colors.white : colors.textSecondary}
          />
          <Text style={[styles.buttonText, value === 'instant' && styles.buttonTextActive]}>
            Instant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, value === 'scheduled' && styles.buttonActive]}
          onPress={() => onChange('scheduled')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={value === 'scheduled' ? colors.white : colors.textSecondary}
          />
          <Text style={[styles.buttonText, value === 'scheduled' && styles.buttonTextActive]}>
            Scheduled
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
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
