import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';

export default function ShareLinkScreen() {
  const [meetingId, setMeetingId] = useState('XXX');
  const [password, setPassword] = useState('YYY');
  const meetingLink = `yourapp://join?meetingId=${meetingId}&password=${password}`;

  const handleCopy = (text: string, label: string) => {
    // TODO: Implement clipboard copy
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Header showProfile={false} logoSize={80} />
      </View>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="mail-open-outline" size={80} color={colors.primary} />
          <Ionicons
            name="search-outline"
            size={40}
            color={colors.secondary}
            style={styles.searchIcon}
          />
        </View>

        <Text style={styles.instruction}>
          Your seller will send you link a join tove meeting
        </Text>

        <View style={styles.linkContainer}>
          <TextInput
            style={styles.linkInput}
            value={meetingLink}
            editable={false}
            placeholder="yourapp://join?meetingId=XXX&password=YYY"
          />
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopy(meetingLink, 'Meeting link')}
          >
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.linkContainer}>
          <TextInput
            style={styles.linkInput}
            value={`Meeting ID: ${meetingId} | Password: ${password}`}
            editable={false}
            placeholder="Enter Meeting ID and Password manually"
          />
          <TouchableOpacity
            style={styles.copyButton}
            onPress={() => handleCopy(`${meetingId}/${password}`, 'Meeting details')}
          >
            <Ionicons name="copy-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sharePrompt}>Share this link with your client</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    top: 20,
    right: -10,
  },
  instruction: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  linkContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  linkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.bodySmall,
    backgroundColor: colors.white,
  },
  copyButton: {
    marginLeft: spacing.sm,
    padding: spacing.sm,
  },
  sharePrompt: {
    ...typography.body,
    color: colors.primary,
    marginTop: spacing.lg,
    fontWeight: '600',
  },
});



