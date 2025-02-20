// Components/Box.js
import React from 'react';
import { View, Text } from 'react-native';
import styles from '../Styles';

function Box({ clr = '#FFFFFF', text, style = {} }) {
  return (
    <View
      style={[
        styles.box,
        { backgroundColor: clr },
        style,
      ]}
    >
      <Text style={styles.boxText}>{text}</Text>
    </View>
  );
}

export default Box;
