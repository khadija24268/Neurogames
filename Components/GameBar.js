// Components/GameBar.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../Styles';

function GameBar({ text, timer, navigate }) {
  const handleBackPress = () => {
    navigate('Home');
  };

  return (
    <View style={styles.gameBar}>
      <TouchableOpacity onPress={handleBackPress}>
        <Text style={styles.gameBarIcon}>🏠</Text>
      </TouchableOpacity>
      <Text style={styles.gameBarTitle}>{text}</Text>
      <Text style={styles.gameBarTimer}>{timer}</Text>
    </View>
  );
}

export default GameBar;
