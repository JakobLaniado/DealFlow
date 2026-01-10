import { Button } from '@/components/Button';
import useAuth from '@/contexts/AuthContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { borderRadius, spacing } from '@/utils/theme';
import React from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, typography, isDark, toggleTheme } = useThemedStyles();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.avatarText, { color: colors.white }]}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.role, { color: colors.textSecondary }]}>
          {user?.role === 'seller' ? 'Seller' : 'Client'}
        </Text>

        {/* Theme Toggle Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.themeRow}>
            <View style={styles.themeInfo}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.themeLabel, { color: colors.text }]}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* User Info Card */}
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Email
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.email}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Account Type
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {user?.role === 'seller' ? 'Seller' : 'Client'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              User ID
            </Text>
            <Text style={[styles.infoValueSmall, { color: colors.textLight }]}>
              {user?.id}
            </Text>
          </View>
        </View>

        <Button
          title="LOGOUT"
          variant="outline"
          size="large"
          fullWidth
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  role: {
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    width: '100%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  infoRow: {
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
  },
  infoValueSmall: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  logoutButton: {
    maxWidth: 300,
    marginTop: spacing.md,
  },
});
