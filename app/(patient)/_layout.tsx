// app/(patient)/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';


export default function PatientLayout() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authState.isSignedIn) router.replace('/(auth)/login');
    else if (authState.role !== 'patient') router.replace('/');
  }, [authState, router]);

  return <Slot />;
}
