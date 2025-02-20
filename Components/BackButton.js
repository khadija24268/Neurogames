import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline, Line } from 'react-native-svg';

export default function BackButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Svg width="30" height="30" viewBox="0 0 512 512">
        <Polyline
          points="244 400 100 256 244 112"
          fill="none"
          stroke="#264E70"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="48"
        />
        <Line
          x1="120"
          y1="256"
          x2="412"
          y2="256"
          fill="none"
          stroke="#264E70"
          strokeLinecap="square"
          strokeMiterlimit="10"
          strokeWidth="48"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 30,
    padding: 10,
    backgroundColor: '#BBD4CE',
    borderRadius: 5,
  },
});
