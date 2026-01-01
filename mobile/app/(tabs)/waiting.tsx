import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors, spacing, typography, borderRadius } from '@/utils/theme';

export default function WaitingScreen() {
  const [meetingId, setMeetingId] = useState('');
  const [password, setPassword] = useState('');

  const handleJoin = () => {
    // TODO: Implement join meeting logic
    console.log('Joining meeting:', { meetingId, password });
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

        <Text style={styles.heading}>Waiting for Invite</Text>

        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            1. Receive link via chat or email.
          </Text>
          <Text style={styles.instructionText}>
            2. Click you link auto-join.
          </Text>
          <Text style={styles.instructionText}>
            3. If auto jein
          </Text>
          <Text style={styles.instructionText}>
            3. If needed, enter detalis marually here.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Meeting ID"
            value={meetingId}
            onChangeText={setMeetingId}
            placeholderTextColor={colors.textLight}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textLight}
          />
        </View>

        <Button
          title="Join"
          variant="secondary"
          size="large"
          fullWidth
          onPress={handleJoin}
          style={styles.joinButton}
        />
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
  heading: {
    ...typography.h1,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  instructions: {
    width: '100%',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  instructionText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    backgroundColor: colors.white,
  },
  joinButton: {
    marginTop: spacing.md,
  },
});

