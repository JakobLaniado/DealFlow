import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import useAuth from '@/contexts/AuthContext';
import { colors, spacing, typography } from '@/utils/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useZoom } from '@zoom/meetingsdk-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
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
  const [isDeeplink, setIsDeeplink] = useState(false);

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

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingField, setEditingField] = useState<
    'meetingId' | 'password' | 'displayName' | null
  >(null);
  const [tempValue, setTempValue] = useState('');

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

  const openEditModal = (field: 'meetingId' | 'password' | 'displayName') => {
    setEditingField(field);
    if (field === 'meetingId') setTempValue(meetingId);
    else if (field === 'password') setTempValue(password);
    else if (field === 'displayName') setTempValue(displayName);
    setIsModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingField === 'meetingId') setMeetingId(tempValue);
    else if (editingField === 'password') setPassword(tempValue);
    else if (editingField === 'displayName') setDisplayName(tempValue);

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
  // Modal styles
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
