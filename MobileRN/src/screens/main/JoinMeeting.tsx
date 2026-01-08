import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import useAuth from '@/contexts/AuthContext';
import { colors, spacing, typography } from '@/utils/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useZoom } from '@zoom/meetingsdk-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function JoinMeetingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const zoom = useZoom();

  const params = route.params as
    | { meetingId?: string; password?: string; displayName?: string }
    | undefined;

  const [meetingId, setMeetingId] = useState(params?.meetingId || '');
  const [password, setPassword] = useState(params?.password || '');
  const [displayName, setDisplayName] = useState(
    params?.displayName || user?.name || '',
  );
  const [isJoining, setIsJoining] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const timer = setInterval(async () => {
      try {
        const ok = await zoom.isInitialized();
        if (!alive) return;
        setSdkReady(ok);
        if (ok) clearInterval(timer);
      } catch {
        if (!alive) return;
        setSdkReady(false);
      }
    }, 500);

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [zoom]);

  // Auto-populate from route params
  useEffect(() => {
    if (params?.meetingId) setMeetingId(params.meetingId);
    if (params?.password) setPassword(params.password);
    if (params?.displayName || user?.name) {
      setDisplayName(params?.displayName || user?.name || '');
    }
  }, [params, user]);

  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      Alert.alert('Error', 'Please enter a meeting ID');
      return;
    }

    if (!displayName.trim()) {
      Alert.alert('Error', 'Please enter your display name');
      return;
    }

    if (!sdkReady) {
      Alert.alert('Error', 'Zoom SDK is not ready yet. Please wait.');
      return;
    }

    setIsJoining(true);
    try {
      await zoom.joinMeeting({
        userName: displayName.trim(),
        meetingNumber: meetingId.trim(),
        password: password.trim() || undefined,
        userType: 0,
      });
    } catch (error: any) {
      Alert.alert('Failed to Join', error?.message || 'Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header showProfile={false} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Ionicons
              name="videocam-outline"
              size={48}
              color={colors.primary}
              style={styles.icon}
            />
            <Text style={styles.title}>Join Zoom Meeting</Text>
            <Text style={styles.subtitle}>
              {sdkReady ? 'Ready to join' : 'Initializing...'}
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Meeting ID</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>
                  {meetingId || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password (Optional)</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>
                  {password ? '••••••••' : 'Not required'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Display Name</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>
                  {displayName || 'Not provided'}
                </Text>
              </View>
            </View>
          </View>

          {!sdkReady && (
            <View style={styles.warningSection}>
              <Text style={styles.warningText}>
                ⚠️ Waiting for Zoom SDK to initialize...
              </Text>
            </View>
          )}

          <View style={styles.buttonSection}>
            <Button
              title={isJoining ? 'Joining...' : 'JOIN MEETING'}
              variant="primary"
              size="large"
              fullWidth
              onPress={handleJoinMeeting}
              disabled={isJoining || !meetingId || !displayName || !sdkReady}
            />
          </View>
        </View>
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
  scrollContent: {
    padding: spacing.md,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputValue: {
    ...typography.body,
    color: colors.text,
  },
  warningSection: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  warningText: {
    ...typography.body,
    color: '#856404',
    textAlign: 'center',
  },
  buttonSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
