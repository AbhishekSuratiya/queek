import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Platform,
} from 'react-native';
import * as React from 'react';
import Color from '../Theme/Color';
import Fonts from '../Theme/Fonts';
import FontSizes from '../Theme/FontSizes';

function Input({
  placeholder,
  containerStyle,
  onPress,
  onChange,
  multiline = false,
  numberOfLines = 1,
  ...props
}) {
  return (
    <TouchableHighlight
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      <TextInput
        spellCheck={false}
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={styles.text}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Color.LightGrey1}
        {...props}
      />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.FontAwesome,
    color: 'white',
  },
  container: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 18 : 2,
    marginTop: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3,
  },
});

export default Input;
