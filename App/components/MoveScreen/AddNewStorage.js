import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import commonStyle from '../../Styles/commonStyle';
import Button from '../Button';

export default function AddNewStorage(props) {
  const [stragename, setStoragename] = useState('anthony@schooltrunk.org');
  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={props.isOpenPicker}
      statusBarTranslucent={true}
      onRequestClose={() => {
        props.closeDialog();
      }}>
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <Text style={styles.addStorage}>{Strings.addStrg}</Text>
            <View
              style={[
                commonStyle.textInputMainView,
                {marginTop: ScaleSizeUtils.hp(2), width: '90%'},
              ]}>
              <TextInput
                value={setStoragename}
                style={commonStyle.textInputstyle}
                onChangeText={text => {
                  setStoragename(text);
                }}
                placeholderTextColor={Colors.placeHolderColor}
                placeholder="Please enter storage name"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: ScaleSizeUtils.hp(3),
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                style={styles.leftButtonView}
                onPress={() => {
                  props.closeDialog();
                }}>
                <Text style={styles.cancelButton}>{'Cancel'}</Text>
              </TouchableOpacity>
              <Button
                title={'OK'}
                linearViewPropsStyle={{
                  width: '100%',
                  height: ScaleSizeUtils.hp(5),
                }}
                buttonStyle={{width: '40%'}}
                onPress={() => {
                  props.onOKPress(stragename);
                }}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 1}}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popup: {
    backgroundColor: Colors.detailsBgColor,
    alignSelf: 'center',
    height: ScaleSizeUtils.DIMEN_MEDIUM * 1.2,
    borderRadius: ScaleSizeUtils.MARGIN_DEFAULT,
    width: '90%',
  },
  popupOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
  addStorage: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    fontFamily: AppFonts.Inter_SemiBold,
    marginTop: ScaleSizeUtils.hp(2),
  },
  leftButtonView: {
    height: ScaleSizeUtils.hp(5),
    width: '40%',
    backgroundColor: Colors.white,
    borderRadius: ScaleSizeUtils.hp(2),
    borderWidth: 1,
    justifyContent: 'center',
  },
  rightButtonView: {
    height: ScaleSizeUtils.hp(5),
    width: '40%',
    backgroundColor: Colors.white,
    borderRadius: ScaleSizeUtils.hp(2),
    justifyContent: 'center',
  },
  cancelButton: {
    color: Colors.black,
    textAlign: 'center',
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    fontFamily: AppFonts.Inter_SemiBold,
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    fontFamily: AppFonts.Inter_SemiBold,
  },
});
