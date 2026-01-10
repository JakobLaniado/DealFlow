import { Button } from '@/components/Button';
import useAuth from '@/contexts/AuthContext';
import { backendService, Meeting } from '@/services/backend.service';
import { borderRadius, colors, spacing, typography } from '@/utils/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusColor(status: Meeting['status']): string {
  switch (status) {
    case 'created':
      return colors.primary;
    case 'started':
      return colors.secondary;
    case 'ended':
      return colors.textSecondary;
    case 'cancelled':
      return '#E53935';
    default:
      return colors.textSecondary;
  }
}

function MeetingCard({
  meeting,
  onJoin,
}: {
  meeting: Meeting;
  onJoin: (meeting: Meeting) => void;
}) {
  const canJoin = meeting.status === 'created' || meeting.status === 'started';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {meeting.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(meeting.status) },
          ]}
        >
          <Text style={styles.statusText}>{meeting.status}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="key-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>ID: {meeting.zoom_meeting_id}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{formatDate(meeting.created_at)}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="hourglass-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.detailText}>{meeting.duration} min</Text>
        </View>
      </View>

      {canJoin && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => onJoin(meeting)}
        >
          <Ionicons name="videocam" size={18} color={colors.white} />
          <Text style={styles.joinButtonText}>Join Meeting</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function MyMeetingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    if (!user?.id) return;

    try {
      setError(null);
      const response = await backendService.getMeetings(user.id);

      if (response.success && response.data) {
        setMeetings(response.data);
      } else {
        setError(response.error || 'Failed to fetch meetings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  // Fetch on mount
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Refetch when screen comes into focus (e.g., after leaving a meeting)
  useFocusEffect(
    useCallback(() => {
      fetchMeetings();
    }, [fetchMeetings])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
  };

  const handleJoinMeeting = async (meeting: Meeting) => {
    // Fetch ZAK token for host
    const zakResponse = await backendService.getZakToken();
    const zakToken = zakResponse.success ? zakResponse.data?.zakToken : undefined;

    (navigation.navigate as any)('JoinMeeting', {
      meetingId: meeting.zoom_meeting_id,
      password: meeting.password,
      displayName: user?.name,
      isHost: true,
      dbMeetingId: meeting.id,
      zakToken,
    });
  };

  const handleCreateMeeting = () => {
    (navigation.navigate as any)('CreateMeeting');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading meetings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title="Retry"
          variant="primary"
          size="medium"
          onPress={fetchMeetings}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meetings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MeetingCard meeting={item} onJoin={handleJoinMeeting} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No Meetings Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first meeting to get started
            </Text>
            <Button
              title="Create Meeting"
              variant="primary"
              size="large"
              onPress={handleCreateMeeting}
              style={styles.createButton}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: '#E53935',
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardDetails: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    marginLeft: spacing.sm,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  joinButtonText: {
    ...typography.button,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
  },
});
