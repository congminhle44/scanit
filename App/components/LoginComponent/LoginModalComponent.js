import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import commonStyle from '../../Styles/commonStyle';
import Colors from '../../constants/Colors';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import Button from '../Button';
// const screenWidth = Math.round(Dimensions.get('window').width);
// const screenHeight = Math.round(Dimensions.get('window').height);

export default function LoginModalComponent(props) {
  const [remember, setRemember] = useState(false);
  const [username, setUsername] = useState('anthony@schooltrunk.org');
  const [password, setPassword] = useState('1Sheeplands');

  // const handlelogin = () => {
  //   console.log(data);
  // };

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
            <View style={commonStyle.textInputMainView}>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  name="Username"
                  placeholder="Username"
                  onChangeText={text => {
                    setUsername(text);
                  }}
                  value={username}
                  style={commonStyle.textInputstyle}
                  // onEndEditing={() => {
                  //   checkValidation();
                  // }}
                  returnKeyType="done"
                  keyboardType="default"
                  placeholderTextColor={Colors.blacklight}
                />
                {username.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setUsername('');
                    }}
                    style={{justifyContent: 'center'}}>
                    <Image
                      source={require('../../assets/close.png')}
                      style={{height: 20, width: 20, alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.blacklight,
                }}
              />

              <View style={{flexDirection: 'row'}}>
                <TextInput
                  name="Password"
                  placeholder="Password"
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  value={password}
                  style={commonStyle.textInputstyle}
                  // onEndEditing={() => {
                  //   checkValidation();
                  // }}
                  returnKeyType="done"
                  keyboardType="default"
                  placeholderTextColor={Colors.blacklight}
                />
                {password.length > 0 ? (
                  <TouchableOpacity
                    onPress={() => {
                      setPassword('');
                    }}
                    style={{justifyContent: 'center'}}>
                    <Image
                      source={require('../../assets/close.png')}
                      style={{height: 20, width: 20, alignSelf: 'center'}}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.blacklight,
                }}
              />
              <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '60%', backgroundColor: '#f5f5f5'}}>
                  <Text style={styles.rememberText}>{Strings.remember}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setRemember(!remember);
                  }}
                  style={{width: '40%', alignItems: 'flex-end'}}>
                  <Image
                    source={require('../../assets/check.png')}
                    style={{
                      height: 20,
                      width: 20,
                      right: ScaleSizeUtils.hp(2),
                      marginTop: ScaleSizeUtils.hp(1),
                      tintColor: remember ? Colors.primary : '#DEDEDE',
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  height: 1,
                  width: '100%',
                  backgroundColor: Colors.blacklight,
                }}
              />

              <Text style={styles.notLoggedInText}>{Strings.notLoggedIn}</Text>
            </View>

            {/* Log in Button Component Start*/}
            <View style={{marginTop: ScaleSizeUtils.hp(2)}}>
              <Button title={Strings.logIn} onPress={() => Alert.alert('hh')} />
            </View>

            {/* Log in Button Component End */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  popup: {
    backgroundColor: Colors.lightWhite,
    alignSelf: 'center',
    height: ScaleSizeUtils.DIMEN_MEDIUM * 1.5,
    borderRadius: ScaleSizeUtils.MARGIN_DEFAULT,
    width: '80%',
    borderWidth: ScaleSizeUtils.MARGIN_TEN,
    shadowOffset: {width: 1, height: 2},
    shadowColor: Colors.blacklight,
    shadowOpacity: 0.5,
    elevation: Platform.OS === 'ios' ? 1 : 5,
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    color: Colors.black,
    padding: ScaleSizeUtils.hp(1),
    fontWeight: 'bold',
  },
  notLoggedInText: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.black,
    padding: ScaleSizeUtils.hp(1),
  },
});
