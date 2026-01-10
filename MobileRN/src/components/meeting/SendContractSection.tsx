import { Button } from '@/components/Button';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SendContractSectionProps {
  clientEmails: string[];
  setClientEmails: (emails: string[]) => void;
  contractUrl: string;
  setContractUrl: (url: string) => void;
  isSending: boolean;
  contractSent: boolean;
  onSend: () => void;
}

export function SendContractSection({
  clientEmails,
  setClientEmails,
  contractUrl,
  setContractUrl,
  isSending,
  contractSent,
  onSend,
}: SendContractSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const buttonTitle = contractSent
    ? 'CONTRACT SENT'
    : isSending
    ? 'SENDING...'
    : 'SEND CONTRACT';

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && isValidEmail(trimmed) && !clientEmails.includes(trimmed)) {
      setClientEmails([...clientEmails, trimmed]);
      setInputValue('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setClientEmails(clientEmails.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      inputValue === '' &&
      clientEmails.length > 0
    ) {
      removeEmail(clientEmails[clientEmails.length - 1]);
    }
  };

  const handleSubmitEditing = () => {
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
  };

  const handleChangeText = (text: string) => {
    // Check for comma, space, or semicolon to add email
    if (text.endsWith(',') || text.endsWith(';') || text.endsWith(' ')) {
      const email = text.slice(0, -1);
      if (email.trim()) {
        addEmail(email);
      }
    } else {
      setInputValue(text);
    }
  };

  const isDisabled = isSending || contractSent;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={colors.primary}
        />
        <Text style={styles.title}>Send Meeting and Contract</Text>
      </View>
      {/* <Text style={styles.description}>
        Send a contract to your clients via email
      </Text> */}

      <Text style={styles.inputLabel}>Contract URL (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Uses default if empty"
        placeholderTextColor={colors.textSecondary}
        value={contractUrl}
        onChangeText={setContractUrl}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isDisabled}
      />

      <Text style={styles.inputLabel}>Client Emails</Text>
      <View
        style={[
          styles.emailContainer,
          isDisabled && styles.emailContainerDisabled,
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {clientEmails.map(email => (
            <View key={email} style={styles.chip}>
              <Text style={styles.chipText}>{email}</Text>
              {!isDisabled && (
                <Pressable
                  onPress={() => removeEmail(email)}
                  hitSlop={8}
                  style={styles.chipRemove}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              )}
            </View>
          ))}
          {!isDisabled && (
            <TextInput
              style={styles.emailInput}
              placeholder={
                clientEmails.length === 0
                  ? 'Enter email addresses'
                  : 'Add more...'
              }
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={handleChangeText}
              onSubmitEditing={handleSubmitEditing}
              onKeyPress={handleKeyPress}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
            />
          )}
        </ScrollView>
      </View>
      <Text style={styles.hintText}>
        Press space, comma, or enter to add email
      </Text>

      <Button
        title={buttonTitle}
        variant={contractSent ? 'secondary' : 'outline'}
        size="small"
        fullWidth
        onPress={onSend}
        disabled={isSending || contractSent || clientEmails.length === 0}
      />
      {/* {contractSent && (
        <Text style={styles.sentText}>
          Contract sent to {clientEmails.length} recipient
          {clientEmails.length > 1 ? 's' : ''}
        </Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.primary,
    marginLeft: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...typography.body,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
  },
  emailContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    minHeight: 48,
    backgroundColor: colors.white,
  },
  emailContainerDisabled: {
    backgroundColor: colors.background,
  },
  chipsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 6,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.primary,
    marginRight: 4,
  },
  chipRemove: {
    padding: 2,
  },
  emailInput: {
    ...typography.body,
    minWidth: 150,
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  sentText: {
    ...typography.body,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
