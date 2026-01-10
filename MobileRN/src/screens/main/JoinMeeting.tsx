import { Button } from '@/components/Button';
import useAuth from '@/contexts/AuthContext';
import { backendService } from '@/services/backend.service';
import { colors, spacing, typography } from '@/utils/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useZoom } from '@zoom/meetingsdk-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function JoinMeetingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const zoom = useZoom();

  const params = route.params as
    | {
        meetingId?: string;
        password?: string;
        displayName?: string;
        isHost?: boolean;
        zakToken?: string | null;
        dbMeetingId?: string; // DB meeting ID for status updates
      }
    | undefined;

  const zakToken = params?.zakToken;
  const dbMeetingId = params?.dbMeetingId;

  const [meetingId, setMeetingId] = useState(params?.meetingId || '');
  const [password, setPassword] = useState(params?.password || '');
  const [displayName, setDisplayName] = useState(
    params?.displayName || user?.name || '',
  );
  const [isHost, setIsHost] = useState(params?.isHost || false);
  const [isJoining, setIsJoining] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<
    'meetingId' | 'password' | 'displayName' | null
  >(null);
  const [tempValue, setTempValue] = useState('');

  // Contract sending state (seller only)
  const [clientEmail, setClientEmail] = useState('');
  const [contractUrl, setContractUrl] = useState('');
  const [isSendingContract, setIsSendingContract] = useState(false);
  const [contractSent, setContractSent] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: NodeJS.Timeout;

    const checkStatus = async () => {
      if (!zoom || !alive) return;
      try {
        // Use a direct promise handle to ensure we catch everything
        const promise = zoom.isInitialized();
        if (promise && typeof promise.then === 'function') {
          const ok = await promise;
          if (!alive) return;
          setSdkReady(ok);
          if (ok) {
            clearInterval(timer);
          }
        }
      } catch (err: any) {
        if (!alive) return;
        setSdkReady(false);
        // Only log activity errors to avoid console noise
        if (err?.message?.includes('react native activity')) {
          console.log('[Zoom] Activity not ready, will retry...');
        } else {
          console.warn('[Zoom] Initialization check failed:', err);
        }
      }
    };

    timer = setInterval(checkStatus, 1500);
    // Also check immediately
    checkStatus();

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

  if (isHost) {
    console.log('Host', user?.name || '');
  }

  const openEditModal = (field: 'meetingId' | 'password' | 'displayName') => {
    setEditingField(field);
    if (field === 'meetingId') setTempValue(meetingId);
    else if (field === 'password') setTempValue(password);
    else if (field === 'displayName') setTempValue(displayName);
    setIsModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingField === 'meetingId') {
      setMeetingId(tempValue);
      // If meeting ID changes, user is no longer host of the original meeting
      if (tempValue !== params?.meetingId) {
        setIsHost(false);
      }
    } else if (editingField === 'password') {
      setPassword(tempValue);
    } else if (editingField === 'displayName') {
      setDisplayName(tempValue);
    }

    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
  };

  const getFieldLabel = () => {
    if (editingField === 'meetingId') return 'Meeting ID';
    if (editingField === 'password') return 'Password';
    if (editingField === 'displayName') return 'Display Name';
    return '';
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      return true; // iOS handles permissions via Info.plist prompts
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ];

      // Add Bluetooth permission for Android 12+ (API 31+)
      if (Platform.Version >= 31) {
        // @ts-ignore - newer permissions might not be in older type definitions
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }

      // Add Notification permission for Android 13+ (API 33+)
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
          'Camera and microphone permissions are required to join a meeting. Please grant them in your device settings.',
        );
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  const handleSendContract = async () => {
    if (!clientEmail.trim()) {
      Alert.alert('Error', 'Please enter the client email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setIsSendingContract(true);

    try {
      const response = await backendService.sendContract({
        clientEmail: clientEmail.trim(),
        sellerUserId: user.id,
        meetingId: dbMeetingId,
        contractUrl: contractUrl.trim() || undefined,
      });

      if (response.success) {
        setContractSent(true);
        Alert.alert(
          'Contract Sent!',
          `Contract has been sent to ${clientEmail}`,
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert('Error', response.error || 'Failed to send contract');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send contract');
    } finally {
      setIsSendingContract(false);
    }
  };

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

    // Request permissions before joining
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      return;
    }

    setIsJoining(true);

    // Update meeting status to 'started' when host starts
    const updateMeetingStarted = async () => {
      if (dbMeetingId && isHost) {
        try {
          await backendService.updateMeetingStatus(dbMeetingId, 'started');
          console.log('[Meeting] Status updated to started');
        } catch (err) {
          console.warn('[Meeting] Failed to update status:', err);
        }
      }
    };

    try {
      // If host with ZAK token, use startMeeting
      if (isHost && zakToken) {
        console.log('[Zoom] Starting meeting as host with ZAK token...');
        const startConfig = {
          userName: displayName.trim(),
          meetingNumber: meetingId.trim(),
          zoomAccessToken: zakToken,
        };
        console.log(
          '[Zoom] Start meeting config:',
          JSON.stringify({ ...startConfig, zoomAccessToken: '***' }, null, 2),
        );

        const result = await zoom.startMeeting(startConfig);
        console.log('[Zoom] Start meeting result:', result);
        await updateMeetingStarted();
        return;
      }

      // Otherwise join as participant
      const joinConfig = {
        userName: displayName.trim(),
        meetingNumber: meetingId.trim(),
        password: password.trim() || undefined,
        userType: 0, // Always join as participant if no ZAK token
      };

      console.log(
        '[Zoom] Joining meeting with config:',
        JSON.stringify(joinConfig, null, 2),
      );
      const result = await zoom.joinMeeting(joinConfig);
      console.log('[Zoom] Join meeting result:', result);
    } catch (error: any) {
      console.error('[Zoom] Meeting error:', error);
      Alert.alert('Failed to Join', error?.message || 'Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <View style={styles.container}>
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
              <View style={styles.labelRow}>
                <Text style={styles.label}>Meeting ID</Text>
                <TouchableOpacity
                  onPress={() => openEditModal('meetingId')}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>
                  {meetingId || 'Not provided'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => openEditModal('password')}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputValue}>
                  {password ? '••••••••' : 'Not required'}
                </Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Display Name</Text>
                <TouchableOpacity
                  onPress={() => openEditModal('displayName')}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
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
                Waiting for Zoom SDK to initialize...
              </Text>
            </View>
          )}

          {/* Send Contract Section - Seller Only */}
          {isHost && user?.role === 'seller' && (
            <View style={styles.contractSection}>
              <View style={styles.contractHeader}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.contractTitle}>Send Contract</Text>
              </View>
              <Text style={styles.contractDescription}>
                Send a contract to your client via email
              </Text>
              <TextInput
                style={styles.contractInput}
                placeholder="Contract URL (optional - uses default if empty)"
                placeholderTextColor={colors.textSecondary}
                value={contractUrl}
                onChangeText={setContractUrl}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSendingContract && !contractSent}
              />
              <TextInput
                style={styles.contractInput}
                placeholder="Client email address"
                placeholderTextColor={colors.textSecondary}
                value={clientEmail}
                onChangeText={setClientEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isSendingContract && !contractSent}
              />
              <Button
                title={
                  contractSent
                    ? 'CONTRACT SENT'
                    : isSendingContract
                    ? 'SENDING...'
                    : 'SEND CONTRACT'
                }
                variant={contractSent ? 'secondary' : 'outline'}
                size="medium"
                fullWidth
                onPress={handleSendContract}
                disabled={
                  isSendingContract || contractSent || !clientEmail.trim()
                }
              />
              {contractSent && (
                <Text style={styles.contractSentText}>
                  Contract sent to {clientEmail}
                </Text>
              )}
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

      {/* Edit Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelEdit}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancelEdit}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit {getFieldLabel()}</Text>
              <TouchableOpacity onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                value={tempValue}
                onChangeText={setTempValue}
                placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
                autoFocus
                keyboardType={
                  editingField === 'meetingId' ? 'numeric' : 'default'
                }
                secureTextEntry={editingField === 'password'}
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.h3,
    color: colors.primary,
  },
  editButton: {
    padding: spacing.xs,
  },
  inputContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    ...typography.body,
    color: colors.text,
    padding: 0,
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

  contractSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  contractTitle: {
    ...typography.h3,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  contractDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  contractInput: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  contractSentText: {
    ...typography.bodySmall,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.primary,
  },
  modalBody: {
    padding: spacing.md,
  },
  modalInput: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.sm,
    minHeight: 44,
    backgroundColor: colors.background,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
});
