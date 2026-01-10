import { Button } from '@/components/Button';
import { EditableField } from '@/components/meeting/EditableField';
import {
  EditFieldModal,
  EditableFieldType,
} from '@/components/meeting/EditFieldModal';
import { SendContractSection } from '@/components/meeting/SendContractSection';
import useAuth from '@/contexts/AuthContext';
import { backendService } from '@/services/backend.service';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import { useRoute } from '@react-navigation/native';
import { useZoom } from '@zoom/meetingsdk-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RouteParams {
  meetingId?: string;
  password?: string;
  displayName?: string;
  isHost?: boolean;
  zakToken?: string | null;
  dbMeetingId?: string;
}

function useZoomSdkStatus() {
  const zoom = useZoom();
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!zoom || !alive) return;
      try {
        const promise = zoom.isInitialized();
        if (promise && typeof promise.then === 'function') {
          const ok = await promise;
          if (!alive) return;
          setSdkReady(ok);
          if (ok) clearInterval(timer);
        }
      } catch {
        if (!alive) return;
        setSdkReady(false);
      }
    };

    timer = setInterval(checkStatus, 1500);
    checkStatus();

    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [zoom]);

  return { zoom, sdkReady };
}

async function requestAndroidPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ];

    if (Platform.Version >= 31) {
      // @ts-ignore
      permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
    }
    if (Platform.Version >= 33) {
      // @ts-ignore
      permissions.push(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const grants = await PermissionsAndroid.requestMultiple(permissions);
    const cameraGranted =
      grants[PermissionsAndroid.PERMISSIONS.CAMERA] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const micGranted =
      grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
      PermissionsAndroid.RESULTS.GRANTED;

    if (!cameraGranted || !micGranted) {
      Alert.alert(
        'Permissions Required',
        'Camera and microphone permissions are required to join a meeting.',
      );
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function JoinMeetingScreen() {
  const route = useRoute();
  const { user } = useAuth();
  const { zoom, sdkReady } = useZoomSdkStatus();

  const params = route.params as RouteParams | undefined;
  const zakToken = params?.zakToken;
  const dbMeetingId = params?.dbMeetingId;

  const [meetingId, setMeetingId] = useState(params?.meetingId || '');
  const [password, setPassword] = useState(params?.password || '');
  const [displayName, setDisplayName] = useState(
    params?.displayName || user?.name || '',
  );
  const [isHost, setIsHost] = useState(params?.isHost || false);
  const [isJoining, setIsJoining] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<EditableFieldType | null>(
    null,
  );
  const [tempValue, setTempValue] = useState('');

  const [clientEmails, setClientEmails] = useState<string[]>([]);
  const [contractUrl, setContractUrl] = useState('');
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [contractSent, setContractSent] = useState(false);

  useEffect(() => {
    if (params?.meetingId) setMeetingId(params.meetingId);
    if (params?.password) setPassword(params.password);
    if (params?.displayName || user?.name) {
      setDisplayName(params?.displayName || user?.name || '');
    }
  }, [params, user]);

  const openEditModal = useCallback(
    (field: EditableFieldType) => {
      setEditingField(field);
      const values = { meetingId, password, displayName };
      setTempValue(values[field]);
      setIsModalVisible(true);
    },
    [meetingId, password, displayName],
  );

  const handleSaveEdit = useCallback(() => {
    if (editingField === 'meetingId') {
      setMeetingId(tempValue);
      if (tempValue !== params?.meetingId) setIsHost(false);
    } else if (editingField === 'password') {
      setPassword(tempValue);
    } else if (editingField === 'displayName') {
      setDisplayName(tempValue);
    }
    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
  }, [editingField, tempValue, params?.meetingId]);

  const handleCancelEdit = useCallback(() => {
    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
  }, []);

  const handleSendContract = useCallback(async () => {
    if (clientEmails.length === 0) {
      Alert.alert('Error', 'Please enter at least one client email address');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsSendingContract(true);
    try {
      // Send to all emails
      const results = await Promise.all(
        clientEmails.map(email =>
          backendService.sendContract({
            clientEmail: email,
            sellerUserId: user.id,
            meetingId: dbMeetingId,
            contractUrl: contractUrl.trim() || undefined,
          }),
        ),
      );

      const allSucceeded = results.every(r => r.success);
      const failedCount = results.filter(r => !r.success).length;

      if (allSucceeded) {
        setContractSent(true);
        Alert.alert(
          'Contract Sent!',
          `Contract has been sent to ${clientEmails.length} recipient${clientEmails.length > 1 ? 's' : ''}`,
        );
      } else if (failedCount === results.length) {
        Alert.alert('Error', 'Failed to send contract to all recipients');
      } else {
        setContractSent(true);
        Alert.alert(
          'Partial Success',
          `Contract sent to ${results.length - failedCount} of ${results.length} recipients`,
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send contract');
    } finally {
      setIsSendingContract(false);
    }
  }, [clientEmails, contractUrl, user?.id, dbMeetingId]);

  const handleJoinMeeting = useCallback(async () => {
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

    const permissionsGranted = await requestAndroidPermissions();
    if (!permissionsGranted) return;

    setIsJoining(true);

    try {
      if (isHost && zakToken) {
        await zoom.startMeeting({
          userName: displayName.trim(),
          meetingNumber: meetingId.trim(),
          zoomAccessToken: zakToken,
        });

        if (dbMeetingId) {
          try {
            await backendService.updateMeetingStatus(dbMeetingId, 'started');
          } catch {}
        }
        return;
      }

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
  }, [
    meetingId,
    displayName,
    password,
    sdkReady,
    isHost,
    zakToken,
    dbMeetingId,
    zoom,
  ]);

  const showContractSection = isHost && user?.role === 'seller';
  const canJoin = meetingId && displayName && sdkReady && !isJoining;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Ionicons name="videocam" size={48} color={colors.primary} />
          <Text style={styles.title}>Join Meeting</Text>
          <Text style={styles.subtitle}>
            {sdkReady
              ? 'Ready to join your meeting'
              : 'Initializing Zoom SDK...'}
          </Text>
        </View>

        {/* Meeting Details */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Meeting Details</Text>

          <EditableField
            label="Meeting ID"
            displayValue={meetingId || 'Not provided'}
            onEdit={() => openEditModal('meetingId')}
          />
          <EditableField
            label="Password"
            displayValue={password ? '••••••••' : 'Not required'}
            onEdit={() => openEditModal('password')}
          />
          <EditableField
            label="Display Name"
            displayValue={displayName || 'Not provided'}
            onEdit={() => openEditModal('displayName')}
          />
        </View>

        {/* SDK Warning */}
        {!sdkReady && (
          <View style={styles.warningSection}>
            <Ionicons name="time-outline" size={20} color="#856404" />
            <Text style={styles.warningText}>
              Waiting for Zoom SDK to initialize...
            </Text>
          </View>
        )}

        {/* Contract Section */}
        {showContractSection && (
          <View style={styles.contractWrapper}>
            <SendContractSection
              clientEmails={clientEmails}
              setClientEmails={setClientEmails}
              contractUrl={contractUrl}
              setContractUrl={setContractUrl}
              isSending={isSendingContract}
              contractSent={contractSent}
              onSend={handleSendContract}
            />
          </View>
        )}

        {/* Join Button */}
        <View style={styles.buttonSection}>
          <Button
            title={isJoining ? 'Joining...' : 'JOIN MEETING'}
            variant="primary"
            size="medium"
            fullWidth
            onPress={handleJoinMeeting}
            disabled={!canJoin}
          />
        </View>
      </ScrollView>

      <EditFieldModal
        visible={isModalVisible}
        field={editingField}
        value={tempValue}
        onChangeText={setTempValue}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
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
    padding: spacing.md,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingTop: spacing.xs,
  },
  title: {
    ...typography.h1,
    marginTop: spacing.xs,
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
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  warningText: {
    ...typography.body,
    color: '#856404',
  },
  contractWrapper: {
    marginBottom: spacing.md,
  },
  buttonSection: {
    marginTop: spacing.xs,
  },
});
