import { Button } from '@/components/Button';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { borderRadius, spacing } from '@/utils/theme';
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
  const { colors } = useThemedStyles();
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Ionicons
          name="document-text-outline"
          size={24}
          color={colors.primary}
        />
        <Text style={[styles.title, { color: colors.primary }]}>
          Send Meeting and Contract
        </Text>
      </View>

      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Contract URL (Optional)
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: colors.border,
            backgroundColor: colors.backgroundSecondary,
            color: colors.text,
          },
        ]}
        placeholder="Uses default if empty"
        placeholderTextColor={colors.textSecondary}
        value={contractUrl}
        onChangeText={setContractUrl}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!isDisabled}
      />

      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
        Client Emails
      </Text>
      <View
        style={[
          styles.emailContainer,
          {
            borderColor: colors.border,
            backgroundColor: colors.backgroundSecondary,
          },
          isDisabled && { backgroundColor: colors.surfaceLight },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {clientEmails.map(email => (
            <View
              key={email}
              style={[styles.chip, { backgroundColor: colors.primary + '20' }]}
            >
              <Text style={[styles.chipText, { color: colors.primary }]}>
                {email}
              </Text>
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
              style={[styles.emailInput, { color: colors.text }]}
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
      <Text style={[styles.hintText, { color: colors.textSecondary }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  emailContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.xs,
    minHeight: 48,
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
    borderRadius: 16,
    paddingVertical: 4,
    paddingLeft: 12,
    paddingRight: 6,
  },
  chipText: {
    fontSize: 14,
    marginRight: 4,
  },
  chipRemove: {
    padding: 2,
  },
  emailInput: {
    fontSize: 16,
    minWidth: 150,
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  hintText: {
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
});
