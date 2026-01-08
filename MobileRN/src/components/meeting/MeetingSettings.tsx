import { colors, spacing, typography } from '@/utils/theme';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

interface MeetingSettingsProps {
  waitingRoom: boolean;
  onWaitingRoomChange: (value: boolean) => void;
  joinBeforeHost: boolean;
  onJoinBeforeHostChange: (value: boolean) => void;
}

export function MeetingSettings({
  waitingRoom,
  onWaitingRoomChange,
  joinBeforeHost,
  onJoinBeforeHostChange,
}: MeetingSettingsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Waiting Room</Text>
          <Text style={styles.settingDescription}>
            Participants wait until host admits them
          </Text>
        </View>
        <Switch
          value={waitingRoom}
          onValueChange={onWaitingRoomChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>Join Before Host</Text>
          <Text style={styles.settingDescription}>
            Allow participants to join before you
          </Text>
        </View>
        <Switch
          value={joinBeforeHost}
          onValueChange={onJoinBeforeHostChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
