// app/(auth)/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { useAuth } from './AuthContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async (role: 'attendant' | 'patient') => {
    if (!email || !password) return Alert.alert('Enter credentials');
    // TODO: call backend to validate credentials
    await signIn(role, email.split('@')[0]);
    // route to role root
    if (role === 'attendant') router.replace('./(attendant)');
    else router.replace('./(patient)');
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Button title="Login as Attendant" onPress={() => doLogin('attendant')} />
      <View style={{ height: 8 }} />
      <Button title="Login as Patient" color="#34c759" onPress={() => doLogin('patient')} />
    </View>
  );
}
