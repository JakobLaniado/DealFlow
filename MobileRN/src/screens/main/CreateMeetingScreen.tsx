import { Button } from '@/components/Button';
import {
  CollapsibleSection,
  DurationSelector,
  FormInput,
  MeetingInfoCard,
  MeetingSettings,
  MeetingTypeSelector,
} from '@/components/meeting';
import useAuth from '@/contexts/AuthContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { backendService } from '@/services/backend.service';
import { spacing } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface MeetingData {
  id: string;
  zoomMeetingId: string;
  password: string;
  joinUrl: string;
  host: boolean;
  zakToken?: string;
}

export function CreateMeetingScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useThemedStyles();

  // State
  const [isCreating, setIsCreating] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [meetingType, setMeetingType] = useState<'instant' | 'scheduled'>(
    'instant',
  );
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [joinBeforeHost, setJoinBeforeHost] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCreateMeeting = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsCreating(true);
    try {
      const response = await backendService.createMeeting({
        hostUserId: user.id,
        title: meetingTitle.trim() || `Contract Call`,
        type: meetingType,
        startTime: meetingType === 'scheduled' ? startTime : undefined,
        duration: duration,
      });

      if (response.success && response.data) {
        setMeetingData({
          id: response.data.id,
          zoomMeetingId: response.data.zoom_meeting_id,
          password: response.data.password || '',
          joinUrl: response.data.join_url || '',
          host: true,
          zakToken: response.data.zak_token || undefined,
        });
        Alert.alert('Success', 'Meeting created successfully!');
      } else {
        Alert.alert('Error', response.error || 'Failed to create meeting');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create meeting');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      Alert.alert('Copied', `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy');
    }
  };

  const handleJoinMeeting = () => {
    if (meetingData) {
      (navigation.navigate as any)('JoinMeeting', {
        meetingId: meetingData.zoomMeetingId,
        password: meetingData.password,
        displayName: user?.name,
        isHost: true,
        zakToken: meetingData.zakToken,
        dbMeetingId: meetingData.id,
      });
    }
  };

  const handleShareLink = () => {
    if (meetingData) {
      Alert.alert('Share', 'Share meeting link with your client');
    }
  };

  const resetForm = () => {
    setMeetingData(null);
    setMeetingType('instant');
    setMeetingTitle('');
    setStartTime('');
    setDuration(60);
    setWaitingRoom(false);
    setJoinBeforeHost(true);
    setShowAdvanced(false);
  };

  const renderCreateForm = () => (
    <>
      <View style={styles.headerSection}>
        <Ionicons name="videocam" size={48} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Create New Meeting
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Set up your meeting preferences and share with clients
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Meeting Details
        </Text>

        <MeetingTypeSelector value={meetingType} onChange={setMeetingType} />

        <FormInput
          label="Meeting Title (Optional)"
          value={meetingTitle}
          onChangeText={setMeetingTitle}
          placeholder="e.g., Client Consultation"
        />

        {meetingType === 'scheduled' && (
          <>
            <FormInput
              label="Start Time"
              value={startTime}
              onChangeText={setStartTime}
              placeholder="e.g., 2026-01-09T14:00:00Z"
              helperText="ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)"
            />

            <DurationSelector value={duration} onChange={setDuration} />
          </>
        )}

        <CollapsibleSection
          title="Advanced Settings"
          isExpanded={showAdvanced}
          onToggle={() => setShowAdvanced(!showAdvanced)}
        >
          <MeetingSettings
            waitingRoom={waitingRoom}
            onWaitingRoomChange={setWaitingRoom}
            joinBeforeHost={joinBeforeHost}
            onJoinBeforeHostChange={setJoinBeforeHost}
          />
        </CollapsibleSection>
      </View>

      <View style={styles.createSection}>
        <Button
          title={isCreating ? 'Creating Meeting...' : 'CREATE MEETING'}
          variant="primary"
          size="large"
          fullWidth
          onPress={handleCreateMeeting}
          disabled={isCreating}
        />
        {isCreating && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={styles.loader}
          />
        )}
      </View>
    </>
  );

  const renderMeetingInfo = () => (
    <View style={styles.meetingInfoSection}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
      </View>

      <Text style={[styles.successText, { color: colors.primary }]}>
        Meeting Created!
      </Text>
      <Text style={[styles.successSubtext, { color: colors.textSecondary }]}>
        Share the details below with your client
      </Text>

      <MeetingInfoCard
        icon="key-outline"
        label="Meeting ID"
        value={meetingData!.zoomMeetingId}
        onCopy={() => handleCopy(meetingData!.zoomMeetingId, 'Meeting ID')}
      />

      <MeetingInfoCard
        icon="lock-closed-outline"
        label="Password"
        value={meetingData!.password}
        onCopy={() => handleCopy(meetingData!.password, 'Password')}
      />

      <MeetingInfoCard
        icon="link-outline"
        label="Join URL"
        value={meetingData!.joinUrl}
        onCopy={() => handleCopy(meetingData!.joinUrl, 'Join URL')}
        valueStyle="link"
      />

      <Button
        title="SHARE LINK"
        variant="primary"
        size="large"
        fullWidth
        onPress={handleShareLink}
        style={styles.shareButton}
      />

      <Button
        title="JOIN MEETING"
        variant="secondary"
        size="large"
        fullWidth
        onPress={handleJoinMeeting}
        style={styles.joinButton}
      />

      <Button
        title="CREATE ANOTHER MEETING"
        variant="outline"
        size="medium"
        fullWidth
        onPress={resetForm}
        style={styles.anotherButton}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {!meetingData ? renderCreateForm() : renderMeetingInfo()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  createSection: {
    marginTop: spacing.md,
  },
  loader: {
    marginTop: spacing.md,
  },
  meetingInfoSection: {
    marginTop: spacing.lg,
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  successSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shareButton: {
    marginTop: spacing.lg,
  },
  joinButton: {
    marginTop: spacing.md,
  },
  anotherButton: {
    marginTop: spacing.md,
  },
});
