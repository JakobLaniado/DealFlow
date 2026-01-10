import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type MeetingType = 'instant' | 'scheduled';

interface MeetingTypeSelectorProps {
  value: MeetingType;
  onChange: (type: MeetingType) => void;
}

export function MeetingTypeSelector({ value, onChange }: MeetingTypeSelectorProps) {
  const { colors } = useThemedStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Meeting Type</Text>
      <View style={styles.selector}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
            value === 'instant' && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onChange('instant')}
        >
          <Ionicons
            name="flash"
            size={20}
            color={value === 'instant' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.buttonText,
              { color: colors.textSecondary },
              value === 'instant' && { color: colors.white },
            ]}
          >
            Instant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
            value === 'scheduled' && {
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => onChange('scheduled')}
        >
          <Ionicons
            name="calendar"
            size={20}
            color={value === 'scheduled' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.buttonText,
              { color: colors.textSecondary },
              value === 'scheduled' && { color: colors.white },
            ]}
          >
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
