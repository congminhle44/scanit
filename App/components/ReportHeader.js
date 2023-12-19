import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import AppFonts from '../constants/Fonts';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import TextFontSize from '../constants/TextFontSize';

const ReportHeader = props => {
  return (
    <>
      <LinearGradient
        colors={['#E4002B', '#FF94A8']}
        style={[
          styles.linearGradient,
          props.linearViewPropsStyle,
          {
            marginTop: 30,
          },
        ]}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            marginLeft: ScaleSizeUtils.hp(2),
          }}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            source={require('../assets/backArrow.png')}
            style={styles.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.headertitle}>{props.title}</Text>
      </LinearGradient>
    </>
  );
};

export default ReportHeader;

var styles = StyleSheet.create({
  headertitle: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE - 3,
    fontFamily: AppFonts.Inter_Bold,
    alignSelf: 'center',
  },
  linearGradient: {
    width: '100%',
    alignSelf: 'center',
    height: ScaleSizeUtils.hp(6),
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 30,
  },
  backArrow: {
    height: ScaleSizeUtils.MARGIN_DEFAULT + 5,
    width: ScaleSizeUtils.MARGIN_DEFAULT + 5,
    resizeMode: 'contain',
    alignSelf: 'center',
    tintColor: Colors.white,
  },
});
