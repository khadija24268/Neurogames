import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import { logout } from '../auth';
import styles from '../Styles';

export default function DoctorHome({ navigate }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const patientsRef = collection(firestore, 'patients');
      const snapshot = await getDocs(patientsRef);

      const patientList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPatients(patientList);
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert('Error', `Failed to fetch patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('UserTypeSelection');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handlePatientPress = (patient) => {
    navigate('PatientDetails', { patient });
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity style={styles.patientCard} onPress={() => handlePatientPress(item)}>
      <Text style={styles.patientCardText}>Name: {item.name}</Text>
      <Text style={styles.patientCardText}>Email: {item.email}</Text>
      <Text style={styles.patientCardText}>Diagnosis: {item.diagnosis}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Home</Text>
      <Text style={styles.subtitle}>Patient List:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#679186" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={renderPatient}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.noDataText}>No patients available.</Text>}
        />
      )}
      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
