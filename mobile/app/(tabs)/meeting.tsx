import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/utils/theme';

export default function MeetingScreen() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [contractSent, setContractSent] = useState(false);

  const handleSendContract = () => {
    setContractSent(true);
    // TODO: Implement contract sending logic
    setTimeout(() => setContractSent(false), 3000);
  };

  // Mock participants
  const participants = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `Participant ${i + 1}`,
    label: ['OGGE', 'COON', 'STTUM', 'USER1', 'USER2', 'USER3'][i],
  }));

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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.videoGrid}>
          {participants.map((participant) => (
            <View key={participant.id} style={styles.videoTile}>
              <View style={styles.videoPlaceholder}>
                <Ionicons name="person" size={40} color={colors.textLight} />
              </View>
              <View style={styles.participantLabel}>
                <Text style={styles.labelText}>{participant.label}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color={isMuted ? colors.white : colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, !isVideoOn && styles.controlButtonActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Ionicons
                name={isVideoOn ? 'videocam' : 'videocam-off'}
                size={24}
                color={isVideoOn ? colors.primary : colors.white}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="people-outline" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <Button
            title="SEND CONTRACT"
            variant="primary"
            size="medium"
            onPress={handleSendContract}
            style={styles.sendButton}
          />
        </View>

        {contractSent && (
          <View style={styles.statusMessage}>
            <Text style={styles.statusText}>
              Contract sent to Chet, Eniell, and Pech
            </Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  videoTile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.border,
  },
  participantLabel: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  labelText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  controlsContainer: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flex: 1,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  controlButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButton: {
    flex: 1,
  },
  statusMessage: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  statusText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});



