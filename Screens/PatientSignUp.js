import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import styles from '../Styles';
import Logo from '../assets/logo.svg'; // Import the SVG logo as a component
import { registerPatient } from '../auth';
import BackButton from '../Components/BackButton';

export default function PatientSignUp({ navigate }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [email, setEmail] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await registerPatient(email, password, name, age, diagnosis, contactMobile);
      Alert.alert('Success', 'Account created successfully!');
      navigate('Home');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View style={styles.container}>
          {/* Logo at the top */}
          <Logo width={120} height={120} style={styles.logo} />
          
          <Text style={styles.loginHeading}>Patient Sign Up</Text>

          {/* Input for Name */}
          <Text style={styles.fieldLabel}>Enter Your Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="John Doe"
              placeholderTextColor="#949494"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Input for Age */}
          <Text style={styles.fieldLabel}>Enter Your Age</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="25"
              placeholderTextColor="#949494"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* Input for Diagnosis */}
          <Text style={styles.fieldLabel}>Enter Your Diagnosis</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="e.g., Diabetes"
              placeholderTextColor="#949494"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
          </View>

          {/* Input for Contact Number */}
          <Text style={styles.fieldLabel}>Enter Your Contact Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputText}
              placeholder="+1234567890"
              placeholderTextColor="#949494"
              value={contactMobile}
              onChangeText={setContactMobile}
              keyboardType="phone-pad"
            />
          </View>

          {/* Input for Email */}
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

          {/* Input for Password */}
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

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.loginButtonContainer} onPress={handleSignUp}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Link to Log In Page */}
          <View style={styles.signUpLink}>
            <Text style={styles.signUpText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigate('PatientLogin')}>
              <Text style={styles.signUpLinkText}>Log In</Text>
            </TouchableOpacity>
          </View>

          <BackButton onPress={() => navigate('UserTypeSelection')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
