import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import styles from '../Styles';
import Logo from '../assets/logo.svg'; // Import SVG as a component
import Button from '../Components/Button'; // Import the reusable Button component
import BackButton from '../Components/BackButton';

export default function DoctorLogin({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDoctorLogin = async () => {
    try {
      // Check if the entered email matches the pre-defined doctor email
      if (email !== 'doctor@gmail.com') {
        Alert.alert(
          'Access Denied',
          'Only the pre-registered doctor account can access this dashboard.'
        );
        return;
      }

      // Authenticate the doctor with Firebase
      await signInWithEmailAndPassword(auth, email, password);

      Alert.alert('Success', 'Logged in successfully!');
      navigate('DoctorHome'); // Navigate to the DoctorHome screen after successful login
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigate('UserTypeSelection')} />
      <Logo width={120} height={120} style={styles.logo} />
      <Text style={styles.loginHeading}>Doctor Login</Text>

      <Text style={styles.fieldLabel}>Enter Your Email</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="doctor@example.com"
          placeholderTextColor="#949494"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.fieldLabel}>Enter Your Password</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="••••••••"
          placeholderTextColor="#949494"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Button text="Login" onPress={handleDoctorLogin} />
    </View>
  );
}
