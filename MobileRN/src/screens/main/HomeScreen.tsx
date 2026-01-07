import { Button } from '@/components/Button';
import { ContractModal } from '@/components/ContractModal';
import { Header } from '@/components/Header';
import { MeetingCard } from '@/components/MeetingCard';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, typography } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [showContractModal, setShowContractModal] = useState(false);

  const isSeller = user?.role === 'seller';
  const greeting = isSeller ? 'Welcome back, Seller' : 'Welcome back';

  const handleCreateMeeting = () => {
    navigation.navigate('ShareLink' as never);
  };

  const handleMeetingPress = (meetingId: string) => {
    navigation.navigate('Meeting' as never);
  };

  const handleJoinMeeting = () => {
    navigation.navigate('Waiting' as never);
  };

  const handleReviewContract = () => {
    setShowContractModal(false);
    // TODO: Navigate to contract review screen
    console.log('Review contract');
  };

  // Mock recent meetings data
  const recentMeetings = [
    {
      id: '1',
      title: 'Meeting with Acme Corp',
      date: '2023.10.26',
      icon: 'mail-outline' as const,
    },
    {
      id: '2',
      title: 'Project Alpha Review',
      date: '2023.10.26',
      icon: 'document-text-outline' as const,
    },
    {
      id: '3',
      title: 'Sales Q4 Planning',
      date: '2023.10.25',
      icon: 'arrow-down-outline' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <Text style={styles.greeting}>{greeting}</Text>

          {isSeller ? (
            <Button
              title="CREATE NEW MEETING"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleCreateMeeting}
              style={styles.createButton}
            />
          ) : (
            <Button
              title="JOIN MEETING"
              variant="secondary"
              size="large"
              fullWidth
              onPress={handleJoinMeeting}
              style={styles.createButton}
            />
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Meetings</Text>
            {recentMeetings.map(meeting => (
              <MeetingCard
                key={meeting.id}
                title={meeting.title}
                date={meeting.date}
                icon={meeting.icon}
                onPress={() => handleMeetingPress(meeting.id)}
              />
            ))}
          </View>

          {!isSeller && (
            <Button
              title="Demo: Show Contract Modal"
              variant="outline"
              size="medium"
              fullWidth
              onPress={() => setShowContractModal(true)}
              style={styles.demoButton}
            />
          )}
        </View>
      </ScrollView>

      <ContractModal
        visible={showContractModal}
        onReview={handleReviewContract}
        onDismiss={() => setShowContractModal(false)}
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  content: {
    padding: spacing.md,
  },
  greeting: {
    ...typography.h1,
    marginBottom: spacing.lg,
  },
  createButton: {
    marginBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  demoButton: {
    marginTop: spacing.lg,
  },
});
