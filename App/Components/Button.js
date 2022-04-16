import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import * as React from "react";
import Color from "../Theme/Color";
import Fonts from "../Theme/Fonts";
import FontSizes from "../Theme/FontSizes";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Button({onPress, text, textStyle, containerStyle, iconName, iconSize, iconColor}) {
  return (
    <TouchableOpacity onPress={onPress} style={{...styles.createOrderButton, ...containerStyle}}>
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      {iconName && <View style={{marginLeft: 16}}>
        <MaterialCommunityIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
      </View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: FontSizes.medium - 4,
    color: 'white',
    fontFamily: Fonts.FontAwesome,
    textAlign: 'center'
  },
  createOrderButton: {
    flexDirection: 'row',
    width: '100%',
    padding: 16,
    marginTop: 24,
    borderRadius: 6,
    backgroundColor: Color.ThemePurple,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Button