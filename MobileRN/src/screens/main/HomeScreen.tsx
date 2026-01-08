import { Button } from '@/components/Button';
import { DealFlowLogo } from '@/components/DealFlowLogo';
import useAuth from '@/contexts/AuthContext';
import { colors, spacing, typography } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HomeScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const isSeller = user?.role === 'seller';

  const handleCreateMeeting = () => {
    navigation.navigate('CreateMeeting' as never);
  };

  const handleJoinMeeting = () => {
    // Do nothing for now
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <DealFlowLogo size={400} style={styles.logo} />
        {isSeller ? (
          <>
            <Button
              title="CREATE NEW MEETING"
              variant="primary"
              size="large"
              fullWidth
              onPress={handleCreateMeeting}
              style={styles.createButton}
            />
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name}! Create a meeting and share the link
              with your client.
            </Text>
          </>
        ) : (
          <>
            <Button
              title="JOIN MEETING"
              variant="secondary"
              size="large"
              fullWidth
              onPress={handleJoinMeeting}
              style={styles.joinButton}
            />
            <Text style={styles.welcomeText}>
              Hey, {user?.name}! You can connect to the meet by link or by id
              and password
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  logo: {
    marginBottom: spacing.xl,
  },
  joinButton: {
    maxWidth: 300,
  },
  welcomeText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  createButton: {
    maxWidth: 300,
  },
});
