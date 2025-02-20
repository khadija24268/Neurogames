// Screens/TwoFlashScore.js
import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from '../Styles';

export default function TwoFlashScore({ navigate, route }) {
  const { correct, incorrect, perRoundData } = route.params;

  const sumCorrect = correct.reduce((a, b) => a + b, 0);
  const sumIncorrect = incorrect.reduce((a, b) => a + b, 0);

  const breakdownLabels = [
    '1 Flash',
    '2 Flashes with 1 Frame Gap',
    '2 Flashes with 2 Frame Gaps',
    '2 Flashes with 3 Frame Gaps',
    '2 Flashes with 4 Frame Gaps',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RESULTS</Text>
      <View style={styles.resultsContainer}>
        <View style={styles.resultsRow}>
          <Text style={styles.resultsLabel}>Correct:</Text>
          <Text style={styles.resultsValue}>{sumCorrect}</Text>
        </View>
        <View style={styles.resultsRow}>
          <Text style={styles.resultsLabel}>Incorrect:</Text>
          <Text style={styles.resultsValue}>{sumIncorrect}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.breakdownTitle}>Breakdown:</Text>
        {breakdownLabels.map((label, index) => (
          <View key={index} style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{label}:</Text>
            <Text style={styles.breakdownValue}>
              {correct[index]}/{correct[index] + incorrect[index]}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.subtitle}>Per-Round Results:</Text>
      <FlatList
        data={perRoundData}
        keyExtractor={(item) => item.round.toString()}
        renderItem={({ item }) => (
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Round {item.round}:</Text>
            <Text style={styles.breakdownValue}>
              {item.correct ? 'Correct' : 'Incorrect'} - Time: {item.timeTaken.toFixed(1)} s - {breakdownLabels[item.trialType]}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.button, styles.returnButton]}
        onPress={() => navigate('Home')}
      >
        <Text style={[styles.buttonText, styles.returnButtonText]}>Return to Home</Text>
      </TouchableOpacity>
    </View>
  );
}
