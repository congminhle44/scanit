import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import TextFontSize from '../constants/TextFontSize';
import LinearGradient from 'react-native-linear-gradient';
import AppFonts from '../constants/Fonts';

export default function Button(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      style={props.buttonStyle}
      activeOpacity={0.9}>
      <LinearGradient
        colors={['#E4002B', '#FF94A8']}
        style={[styles.linearGradient, props.linearViewPropsStyle]}>
        <Text style={[styles.buttonText, props.textStyle]}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    width: '80%',
    alignSelf: 'center',
    height: ScaleSizeUtils.hp(6),
    marginBottom: ScaleSizeUtils.hp(1),
    justifyContent: 'center',
    borderRadius: ScaleSizeUtils.hp(1.5),
  },
  buttonText: {
    fontSize: TextFontSize.TEXT_SIZE_LARGE - 2,
    fontFamily: AppFonts.Inter_SemiBold,
    textAlign: 'center',
    color: Colors.white,
  },
});
