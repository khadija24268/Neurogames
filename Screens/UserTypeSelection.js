// Screens/UserTypeSelection.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/logo.svg';

export default function UserTypeSelection({ navigate }) {
  return (
    <View style={styles.container}>
      <Logo width={120} height={120} style={styles.logo} />
      <Text style={styles.loginHeading}>Select User Type</Text>
      <TouchableOpacity
        style={styles.loginButtonContainer}
        onPress={() => navigate('PatientLogin')}
      >
        <Text style={styles.loginButtonText}>Patient</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginButtonContainer, { backgroundColor: '#264E70' }]}
        onPress={() => navigate('DoctorLogin')}
      >
        <Text style={styles.loginButtonText}>Doctor</Text>
      </TouchableOpacity>
    </View>
  );
}
