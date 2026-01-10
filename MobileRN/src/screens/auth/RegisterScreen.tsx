import { useAuth } from '@/contexts/AuthContext';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import { RegisterCredentials } from '@/types/auth';
import { borderRadius, spacing } from '@/utils/theme';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation();
  const { colors } = useThemedStyles();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword ||
      !credentials.name
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (credentials.password !== credentials.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (credentials.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(credentials);
    setLoading(false);

    if (result.success) {
      navigation.navigate('Home' as never);
    } else {
      Alert.alert(
        'Registration Failed',
        result.error || 'Could not create account',
      );
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.backgroundSecondary,
      borderColor: colors.border,
      color: colors.text,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Sign up to get started
      </Text>

      <View
        style={[
          styles.form,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          style={inputStyle}
          placeholder="Name"
          placeholderTextColor={colors.textMuted}
          value={credentials.name}
          onChangeText={text => setCredentials({ ...credentials, name: text })}
          autoCapitalize="words"
          autoComplete="name"
        />

        <TextInput
          style={inputStyle}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          value={credentials.email}
          onChangeText={text => setCredentials({ ...credentials, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={inputStyle}
          placeholder="Password"
          placeholderTextColor={colors.textMuted}
          value={credentials.password}
          onChangeText={text =>
            setCredentials({ ...credentials, password: text })
          }
          secureTextEntry
          autoComplete="password-new"
        />

        <TextInput
          style={inputStyle}
          placeholder="Confirm Password"
          placeholderTextColor={colors.textMuted}
          value={credentials.confirmPassword}
          onChangeText={text =>
            setCredentials({ ...credentials, confirmPassword: text })
          }
          secureTextEntry
          autoComplete="password-new"
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            loading && { backgroundColor: colors.surfaceLight, opacity: 0.6 },
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.white }]}>
              Register
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={[styles.linkText, { color: colors.primaryLight }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 16,
  },
  button: {
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
  },
});
