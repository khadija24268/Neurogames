// Components/NumKey.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../Styles';

function NumKey({ text, onPress, clr = '#BBD4CE', clrtxt = '#264E70', style = {} }) {
  return (
    <TouchableOpacity
      style={[
        styles.numKey,
        { backgroundColor: clr, borderColor: '#679186' },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.numKeyText, { color: clrtxt }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default NumKey;
