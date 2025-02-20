//Screens/PatientLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/logo.svg'; // Import SVG as a component
import { loginPatient } from '../auth';  // Add this import
import BackButton from '../Components/BackButton';

export default function PatientLogin({ navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Add authentication check
      await loginPatient(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
      // Clear form fields if needed
      setEmail('');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      <Logo width={120} height={120} style={styles.logo} />
      <Text style={styles.loginHeading}>Login</Text>

      <Text style={styles.fieldLabel}>Enter Your Email</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputText}
          placeholder="email@example.com"
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

      <TouchableOpacity style={styles.loginButtonContainer} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.signUpLink}>
        <Text style={styles.signUpText}>Do not have an account?</Text>
        <TouchableOpacity onPress={() => navigate('PatientSignUp')}>
          <Text style={styles.signUpLinkText}>Create a new one</Text>
        </TouchableOpacity>
      </View>

      <BackButton onPress={() => navigate('UserTypeSelection')} />
    </View>
  );
}
