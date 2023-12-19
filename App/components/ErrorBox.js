import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import Colors from '../constants/Colors';
import AppFonts from '../constants/Fonts';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import TextFontSize from '../constants/TextFontSize';

const ErrorBox = props => {
  return (
    <Modal
      isVisible={props.errorModalOpen}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      animationInTiming={1000}
      animationOutTiming={1000}>
      <LinearGradient
        colors={['#E4002B', '#FF94A8']}
        style={{
          padding: ScaleSizeUtils.MARGIN_DEFAULT,
          width: '90%',
          alignSelf: 'center',
          borderRadius: ScaleSizeUtils.MARGIN_TEN,
        }}>
        <Text style={styles.clientNameText}>{props.message}</Text>

        <TouchableOpacity
          onPress={() => {
            props.closeModal(false);
            props.screenName
              ? props.navigation.navigate(props.screenName, {
                  bag_Name: props.bag_name,
                  navigation: props.navigation,
                })
              : null;
          }}
          style={styles.buttonView}>
          <Text style={styles.buttonText}>{'Ok'}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Modal>
  );
};

export default ErrorBox;

var styles = StyleSheet.create({
  clientNameText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 2,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  premiumText: {
    fontFamily: AppFonts.Inter_SemiBold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.hp(2),
  },
  buttonText: {
    padding: 10,
    borderRadius: 10,
    width: '30%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    fontFamily: AppFonts.Inter_Medium,
    color: Colors.primary,
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT * 2.5,
  },
  errorText: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 5,
    fontFamily: AppFonts.Inter_Medium,
    color: Colors.white,
    justifyContent: 'center',
  },
});
