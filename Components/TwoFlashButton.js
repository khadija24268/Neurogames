// Components/TwoFlashButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../Styles';

function TwoFlashButton({ text, onPress, customStyles = {}, textStyle = {} }) {
  return (
    <TouchableOpacity
      style={[styles.twoFlashButton, customStyles]}
      onPress={onPress}
    >
      <Text style={[styles.twoFlashButtonText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default TwoFlashButton;
