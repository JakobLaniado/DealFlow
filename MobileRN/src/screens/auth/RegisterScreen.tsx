import { useAuth } from '@/contexts/AuthContext';
import { RegisterCredentials } from '@/types/auth';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={credentials.name}
          onChangeText={text => setCredentials({ ...credentials, name: text })}
          autoCapitalize="words"
          autoComplete="name"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={credentials.email}
          onChangeText={text => setCredentials({ ...credentials, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={credentials.password}
          onChangeText={text =>
            setCredentials({ ...credentials, password: text })
          }
          secureTextEntry
          autoComplete="password-new"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={credentials.confirmPassword}
          onChangeText={text =>
            setCredentials({ ...credentials, confirmPassword: text })
          }
          secureTextEntry
          autoComplete="password-new"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});
