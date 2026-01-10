import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing } from '@/utils/theme';
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
  const { colors } = useThemedStyles();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Waiting Room
          </Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
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

      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Join Before Host
          </Text>
          <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
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
    borderRadius: 8,
    padding: spacing.md,
    borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
  },
});
