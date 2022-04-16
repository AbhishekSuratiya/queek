import {StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View} from "react-native";
import * as React from "react";
import Color from "../Theme/Color";
import Fonts from "../Theme/Fonts";
import FontSizes from "../Theme/FontSizes";

function PseudoInput({placeholder, containerStyle, onPress, textColor}) {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <Text style={[styles.text, {color: textColor}]}>{placeholder}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.FontAwesome,
    color: 'black'
  },
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 18,
    marginTop: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Color.LightGrey3
  }
});

export default PseudoInput