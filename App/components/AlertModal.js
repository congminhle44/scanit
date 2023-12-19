import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../constants/Colors';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import commonStyle from '../Styles/commonStyle';

const AlertModal = ({
  modalVisible,
  CloseModal,
  header,
  title,
  buttonText,
  Textinput,
  setTextField,
  textValue,
  cancelButton,
}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          CloseModal();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={[styles.modalText, {fontWeight: 'bold', fontSize: 18}]}>
              {header}
            </Text>
            <Text
              style={[
                styles.modalText,
                {color: '#abcbe1', fontSize: 18, marginBottom: 20},
              ]}>
              {title}
            </Text>
            {Textinput == true && (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: Colors.white,
                  width: ScaleSizeUtils.wp('70%'),
                  height: 35,
                }}>
                <TextInput
                  name="text"
                  onChangeText={text => {
                    setTextField(text);
                  }}
                  value={textValue}
                  // onEndEditing={() => {
                  //   checkValidation();
                  // }}
                  style={{
                    width: '90%',
                    color: Colors.blacklight,
                    alignSelf: 'center',
                  }}
                  returnKeyType="done"
                  keyboardType="default"
                  placeholderTextColor={Colors.blacklight}
                />
                {textValue.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setTextField('');
                    }}
                    style={{justifyContent: 'center'}}>
                    <Image
                      source={require('../assets/close.png')}
                      style={{height: 20, width: 20, alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            {cancelButton == true ? (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Pressable
                  style={[styles.cancelbutton, styles.buttonClose]}
                  onPress={() => CloseModal()}>
                  <Text style={[styles.textStyle, {fontSize: 14}]}>
                    {'Cancel'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.cancelbutton,
                    styles.buttonClose,
                    {marginLeft: 20},
                  ]}
                  onPress={() => CloseModal()}>
                  <Text style={[styles.textStyle, {fontSize: 14}]}>
                    {buttonText}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => CloseModal()}>
                <Text style={styles.textStyle}>{buttonText}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#03111a',
    borderWidth: 5,
    borderColor: Colors.blue,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    opacity: 50,
    shadowOpacity: 50,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    width: ScaleSizeUtils.wp('25%'),
    height: ScaleSizeUtils.hp('5%'),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelbutton: {
    borderRadius: 10,
    width: ScaleSizeUtils.wp('20%'),
    height: ScaleSizeUtils.hp('4%'),
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#006fbe',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    color: Colors.white,
    textAlign: 'center',
  },
});
