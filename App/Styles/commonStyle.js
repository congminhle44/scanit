import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../constants/Colors';
import AppFonts from '../constants/Fonts';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import TextFontSize from '../constants/TextFontSize';
const {width, height} = Dimensions.get('window');

const commonStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  safeAreaViewContainer: {
    flex: 1,
  },
  textInputstyle: {
    height: ScaleSizeUtils.hp(6),
    fontFamily: AppFonts.Inter_SemiBold,
    width: '90%',
    color: Colors.black,
    alignSelf: 'center',
  },
  textInputMainView: {
    height: ScaleSizeUtils.hp(6),
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(61, 44, 166, 0.1)',
    borderRadius: ScaleSizeUtils.hp(2),
  },
  error_message: {
    fontFamily: AppFonts.Inter_Medium,
    color: Colors.red,
    marginLeft: ScaleSizeUtils.hp(1),
    marginBottom: ScaleSizeUtils.hp(0.5),
  },
  noRecordfound: {
    fontFamily: AppFonts.Inter_Medium,
    color: Colors.black,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM_LARGE,
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: height / 2.5,
  },
  errorBoxContainer: {
    justifyContent: 'center',
    padding: ScaleSizeUtils.hp(3),
    backgroundColor: Colors.light_gray,
    width: '90%',
    alignSelf: 'center',
    borderRadius: ScaleSizeUtils.hp(2),
    borderWidth: 1,
    borderColor: Colors.red,
    marginTop: ScaleSizeUtils.hp(2),
  },
});
export default commonStyle;
