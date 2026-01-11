import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from './Button';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { spacing, borderRadius } from '@/utils/theme';

interface ContractModalProps {
  visible: boolean;
  sellerName?: string;
  onReview: () => void;
  onJoinMeeting?: () => void;
  onDismiss: () => void;
  hasMeetingLink?: boolean;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  visible,
  sellerName,
  onReview,
  onJoinMeeting,
  onDismiss,
  hasMeetingLink = false,
}) => {
  const { colors } = useThemedStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="document-text" size={40} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            New Contract Received
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {sellerName ? `${sellerName} has` : 'The seller has'} sent a contract for your review.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="REVIEW & SIGN"
              variant="primary"
              size="large"
              fullWidth
              onPress={onReview}
            />

            {hasMeetingLink && onJoinMeeting && (
              <Button
                title="JOIN MEETING"
                variant="outline"
                size="large"
                fullWidth
                onPress={onJoinMeeting}
              />
            )}

            <TouchableOpacity
              style={[styles.dismissButton, { borderColor: colors.border }]}
              onPress={onDismiss}
            >
              <Text style={[styles.dismissText, { color: colors.textSecondary }]}>
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modal: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
  },
  dismissButton: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
