import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
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
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function CreateMeetingScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [meetingData, setMeetingData] = useState<{
    meetingId: string;
    password: string;
    deeplink: string;
  } | null>(null);

  const handleJoinMeeting = () => {
    if (meetingData) {
      (navigation.navigate as any)('JoinMeeting', {
        meetingId: meetingData.meetingId,
        password: meetingData.password,
        displayName: user?.name,
      });
    }
  };

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      const response = await backendService.createMeeting({
        title: `Meeting ${new Date().toLocaleDateString()}`,
      });

      console.log('response', response);

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
      //   await Clipboard.setString(text);
      Alert.alert('Copied', `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy');
    }
  };

  const handleShareLink = () => {
    if (meetingData) {
      // You can implement sharing functionality here
      Alert.alert('Share', 'Share meeting link with your client');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Create New Meeting</Text>
        <Text style={styles.subtitle}>
          Create a meeting and share the link with your client
        </Text>

        {!meetingData ? (
          <View style={styles.createSection}>
            <Button
              title={isCreating ? 'Creating...' : 'CREATE MEETING'}
              variant="primary"
              size="large"
              fullWidth
              onPress={handleCreateMeeting}
              disabled={isCreating}
              style={styles.createButton}
            />
            {isCreating && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loader}
              />
            )}
          </View>
        ) : (
          <View style={styles.meetingInfoSection}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark-circle"
                size={64}
                color={colors.primary}
              />
            </View>

            <Text style={styles.successText}>Meeting Created!</Text>

            {/* Meeting ID */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Meeting ID</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{meetingData.meetingId}</Text>
                <TouchableOpacity
                  onPress={() =>
                    handleCopy(meetingData.meetingId, 'Meeting ID')
                  }
                  style={styles.copyButton}
                >
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Password</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoValue}>{meetingData.password}</Text>
                <TouchableOpacity
                  onPress={() => handleCopy(meetingData.password, 'Password')}
                  style={styles.copyButton}
                >
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Deeplink */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Share Link</Text>
              <View style={styles.infoRow}>
                <Text style={styles.deeplinkText} numberOfLines={1}>
                  {meetingData.deeplink}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCopy(meetingData.deeplink, 'Share Link')}
                  style={styles.copyButton}
                >
                  <Ionicons
                    name="copy-outline"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="SHARE LINK"
              variant="secondary"
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
              onPress={() => setMeetingData(null)}
              style={styles.anotherButton}
            />
          </View>
        )}
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
  title: {
    ...typography.h1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  createSection: {
    marginTop: spacing.xl,
  },
  createButton: {
    marginTop: spacing.lg,
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
    marginBottom: spacing.xl,
    color: colors.primary,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoValue: {
    ...typography.body,
    flex: 1,
    fontWeight: '600',
  },
  deeplinkText: {
    ...typography.bodySmall,
    flex: 1,
    color: colors.textSecondary,
  },
  copyButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  shareButton: {
    marginTop: spacing.xl,
  },
  joinButton: {
    marginTop: spacing.xl,
  },
  anotherButton: {
    marginTop: spacing.md,
  },
});
