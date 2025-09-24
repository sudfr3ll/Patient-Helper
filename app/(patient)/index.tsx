// app/(patient)/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../services/AuthContext';

export default function PatientHome() {
  const { authState, signOut } = useAuth();
  const router = useRouter();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18 }}>Hello, {authState.name ?? 'Patient'}</Text>
      <Button title="Sign out" onPress={async () => { await signOut(); router.replace('/'); }} />
    </View>
  );
}
