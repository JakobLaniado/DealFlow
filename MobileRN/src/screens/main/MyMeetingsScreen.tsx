import { Button } from '@/components/Button';
import useAuth from '@/contexts/AuthContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { backendService, Meeting } from '@/services/backend.service';
import { borderRadius, spacing, ThemeColors } from '@/utils/theme';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

function getStatusColor(status: Meeting['status'], colors: ThemeColors): string {
  switch (status) {
    case 'created':
      return colors.primary;
    case 'started':
      return colors.secondary;
    case 'ended':
      return colors.textMuted;
    case 'cancelled':
      return colors.error;
    default:
      return colors.textMuted;
  }
}

function MeetingCard({
  meeting,
  onJoin,
  colors,
}: {
  meeting: Meeting;
  onJoin: (meeting: Meeting) => void;
  colors: ThemeColors;
}) {
  const canJoin = meeting.status === 'created' || meeting.status === 'started';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
          {meeting.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(meeting.status, colors) },
          ]}
        >
          <Text style={[styles.statusText, { color: colors.white }]}>
            {meeting.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="key-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            ID: {meeting.zoom_meeting_id}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {formatDate(meeting.created_at)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="hourglass-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            {meeting.duration} min
          </Text>
        </View>
      </View>

      {canJoin && (
        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: colors.primary }]}
          onPress={() => onJoin(meeting)}
        >
          <Ionicons name="videocam" size={18} color={colors.white} />
          <Text style={[styles.joinButtonText, { color: colors.white }]}>
            Join Meeting
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function MyMeetingsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useThemedStyles();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [zakToken, setZakToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    if (!user?.id) return;

    try {
      setError(null);
      const response = await backendService.getMeetings(user.id);

      if (response.success && response.data) {
        setMeetings(response.data.meetings);
        setZakToken(response.data.zakToken || null);
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

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useFocusEffect(
    useCallback(() => {
      fetchMeetings();
    }, [fetchMeetings]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMeetings();
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (!zakToken) {
      Alert.alert(
        'Host Token Unavailable',
        'Could not retrieve host credentials. You will join as a participant instead.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Join as Participant',
            onPress: () => {
              (navigation.navigate as any)('JoinMeeting', {
                meetingId: meeting.zoom_meeting_id,
                password: meeting.password,
                displayName: user?.name,
                isHost: false,
                dbMeetingId: meeting.id,
              });
            },
          },
        ],
      );
      return;
    }

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
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading meetings...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={meetings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MeetingCard meeting={item} onJoin={handleJoinMeeting} colors={colors} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Meetings Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
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
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    fontSize: 16,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  listContent: {
    padding: spacing.md,
    flexGrow: 1,
  },
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 14,
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
    fontSize: 14,
    marginLeft: spacing.sm,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  createButton: {
    marginTop: spacing.md,
  },
});
