import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import {
  CollapsibleSection,
  DurationSelector,
  FormInput,
  MeetingInfoCard,
  MeetingSettings,
  MeetingTypeSelector,
} from '@/components/meeting';
import useAuth from '@/contexts/AuthContext';
import { backendService } from '@/services/backend.service';
import { colors, spacing, typography } from '@/utils/theme';
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
  meetingId: string;
  password: string;
  deeplink: string;
}

export function CreateMeetingScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  // State
  const [isCreating, setIsCreating] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [meetingType, setMeetingType] = useState<'instant' | 'scheduled'>('instant');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [waitingRoom, setWaitingRoom] = useState(true);
  const [joinBeforeHost, setJoinBeforeHost] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      const response = await backendService.createMeeting({
        title: meetingTitle.trim() || `Meeting ${new Date().toLocaleDateString()}`,
        startTime: meetingType === 'scheduled' ? startTime : undefined,
        duration: meetingType === 'scheduled' ? duration : undefined,
        settings: {
          waiting_room: waitingRoom,
          join_before_host: joinBeforeHost,
        },
      });

      if (response.success && response.data) {
        setMeetingData({
          meetingId: response.data.meetingId,
          password: response.data.password,
          deeplink: response.data.deeplink,
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
      // await Clipboard.setString(text);
      Alert.alert('Copied', `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy');
    }
  };

  const handleJoinMeeting = () => {
    if (meetingData) {
      (navigation.navigate as any)('JoinMeeting', {
        meetingId: meetingData.meetingId,
        password: meetingData.password,
        displayName: user?.name,
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
    setWaitingRoom(true);
    setJoinBeforeHost(false);
    setShowAdvanced(false);
  };

  const renderCreateForm = () => (
    <>
      <View style={styles.headerSection}>
        <Ionicons name="videocam" size={48} color={colors.primary} />
        <Text style={styles.title}>Create New Meeting</Text>
        <Text style={styles.subtitle}>
          Set up your meeting preferences and share with clients
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Meeting Details</Text>

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

      <Text style={styles.successText}>Meeting Created!</Text>
      <Text style={styles.successSubtext}>
        Share the details below with your client
      </Text>

      <MeetingInfoCard
        icon="key-outline"
        label="Meeting ID"
        value={meetingData!.meetingId}
        onCopy={() => handleCopy(meetingData!.meetingId, 'Meeting ID')}
      />

      <MeetingInfoCard
        icon="lock-closed-outline"
        label="Password"
        value={meetingData!.password}
        onCopy={() => handleCopy(meetingData!.password, 'Password')}
      />

      <MeetingInfoCard
        icon="link-outline"
        label="Share Link"
        value={meetingData!.deeplink}
        onCopy={() => handleCopy(meetingData!.deeplink, 'Share Link')}
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
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {!meetingData ? renderCreateForm() : renderMeetingInfo()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    ...typography.h1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  formSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    fontWeight: '600',
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
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.primary,
  },
  successSubtext: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
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
