import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Button } from './Button';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';

interface ContractModalProps {
  visible: boolean;
  onReview: () => void;
  onDismiss: () => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  visible,
  onReview,
  onDismiss,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>New Contract Received</Text>
          <Text style={styles.description}>
            The seller has sent for contract for your review.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="REVIEW & SIGN"
              variant="primary"
              size="large"
              fullWidth
              onPress={onReview}
              style={styles.reviewButton}
            />
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
            >
              <Text style={styles.dismissText}>Dismiss</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    gap: spacing.md,
  },
  reviewButton: {
    marginBottom: spacing.sm,
  },
  dismissButton: {
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  dismissText: {
    ...typography.button,
    color: colors.primary,
  },
});
