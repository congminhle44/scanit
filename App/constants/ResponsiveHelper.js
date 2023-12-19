import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const {width} = Dimensions.get('window');
let isTablet = DeviceInfo.isTablet();

const aspectRatio = width / (Platform.OS === 'ios' ? 380 : 480);

const getLayoutSize = valueDimen => {
  var newScale =
    (aspectRatio * valueDimen - valueDimen) * (isTablet ? 0.3 : 0.6) +
    valueDimen;
  return newScale;
};

const getFontSize = valueFontSize => {
  var newScale =
    (aspectRatio * valueFontSize - valueFontSize) * (isTablet ? 0.2 : 0.4) +
    valueFontSize;
  return newScale;
};

export {getFontSize, getLayoutSize};
