// Screens/SDMTScore.js
import React, { useEffect } from 'react';
import { View, Text, BackHandler, TouchableOpacity, FlatList } from 'react-native';
import styles from '../Styles';

export default function SDMTScore({ navigate, route }) {
  const { round, errors, times, perRoundResults } = route.params;

  // Handle cases where times might be undefined
  const hasTimes = Array.isArray(times) && times.length > 0;
  const bestT = hasTimes ? Math.min(...times) : 60;
  const avgT = hasTimes ? Math.ceil(times.reduce((a, b) => a + b, 0) / times.length) : 60;

  useEffect(() => {
    // Disable back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      backHandler.remove();
    };
  }, []);

  const handleReturnHome = () => {
    navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RESULTS</Text>
      
      {/* Results Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Metric</Text>
          <Text style={styles.tableHeader}>Value</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Average Time</Text>
          <Text style={styles.tableCell}>{avgT} s</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Best Time</Text>
          <Text style={styles.tableCell}>{bestT} s</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Total Errors</Text>
          <Text style={styles.tableCell}>{errors}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>Total Rounds</Text>
          <Text style={styles.tableCell}>{round}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Per-Round Results:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Round</Text>
          <Text style={styles.tableHeader}>Time</Text>
          <Text style={styles.tableHeader}>Correct</Text>
          <Text style={styles.tableHeader}>Incorrect</Text>
        </View>
        <FlatList
          data={perRoundResults}
          keyExtractor={(item) => item.round.toString()}
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.round}</Text>
              <Text style={styles.tableCell}>{item.timeTaken.toFixed(2)} s</Text>
              <Text style={styles.tableCell}>{item.correct}</Text>
              <Text style={styles.tableCell}>{item.incorrect}</Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleReturnHome}
      >
        <Text style={styles.buttonText}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
