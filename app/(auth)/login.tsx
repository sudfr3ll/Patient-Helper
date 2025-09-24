// app/(auth)/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../services/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 4;

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validate = () => {
    let ok = true;
    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      ok = false;
    } else setEmailError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      ok = false;
    } else setPasswordError(null);

    return ok;
  };

  const handleLogin = async (role: 'attendant' | 'patient') => {
    if (!validate()) return;

    try {
      setLoading(true);

      // TODO: Replace this with your real auth API call.
      // Example:
      // const resp = await api.post('/auth/login', { email, password });
      // await signIn(role, resp.data.user.name);
      //
      // For now we use the AuthContext signIn mock:
      await signIn(role, email.split('@')[0]);

      // route to role-specific root (expo-router group)
      if (role === 'attendant') router.replace('/(attendant)');
      else router.replace('/(patient)');
    } catch (err: any) {
      // show friendly message
      Alert.alert('Login failed', err?.message ?? 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title} >Sign in</Text>
        <Text style={styles.subtitle}>Access your attendant or patient account</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => {
              // move focus to password — simple UX improvement
              // using ref would be ideal; kept simple here
            }}
            style={[styles.input, emailError ? styles.inputError : null]}
            editable={!loading}
            accessibilityLabel="Email"
            testID="emailInput"
            returnKeyType="next"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
          <TextInput
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            textContentType="password"
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={() => handleLogin('patient')} // convenience: sign in as patient on submit
            style={[styles.input, passwordError ? styles.inputError : null]}
            editable={!loading}
            accessibilityLabel="Password"
            testID="passwordInput"
            returnKeyType="go"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={{ height: 18 }} />

          <PrimaryButton
            label={loading ? 'Signing in...' : 'Sign in as Attendant'}
            onPress={() => handleLogin('attendant')}
            disabled={loading}
            testID="attendantLoginBtn"
          />

          <View style={{ height: 12 }} />

          <PrimaryButton
            label={loading ? 'Signing in...' : 'Sign in as Patient'}
            onPress={() => handleLogin('patient')}
            disabled={loading}
            variant="secondary"
            testID="patientLoginBtn"
          />
        </View>

        {loading ? (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------- Small shared button component ---------- */
function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary,
        disabled ? styles.buttonDisabled : null,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      testID={testID}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 48,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  title: { fontSize: 28, fontWeight: '700', marginTop: 34, marginBottom: 3, color: '#111', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24, textAlign: 'center' },

  form: { marginTop: 4 },

  label: { fontSize: 13, marginBottom: 6, color: '#333' },
  input: {
    height: 48,
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#D9534F',
  },
  errorText: { color: '#D9534F', marginTop: 6, fontSize: 12 },

  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#0066FF',
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
