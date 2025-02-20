// Screens/Home.js
import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from '../Styles';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Home({ navigate }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('UserTypeSelection');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigate('SDMT')}>
        <Text style={styles.buttonText}>Start SDMT Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigate('TwoFlash')}>
        <Text style={styles.buttonText}>Start Two Flash-Staircase</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigate('TwoFlashStandard')}>
        <Text style={styles.buttonText}>Start Two Flash-Standard</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
