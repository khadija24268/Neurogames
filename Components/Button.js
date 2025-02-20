// Components/Button.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../Styles';

function Button({ text, onPress, customStyles = {}, textStyle = {} }) {
  return (
    <TouchableOpacity
      style={[styles.button, customStyles]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
