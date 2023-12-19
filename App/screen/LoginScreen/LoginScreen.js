import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {API} from '../../Helper/HttpService';
import PrefManager from '../../Helper/PrefManager';
import Utils from '../../Helper/Utils';
import commonStyle from '../../Styles/commonStyle';
import Button from '../../components/Button';
import ProgressLoader from '../../components/ProgressLoader';
import ScrollableAvoidKeyboard from '../../components/ScrollableAvoidKeyboard';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';

const LoginScreen = props => {
  const {navigation} = props;
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlelogin = async () => {
    var isValid = true;

    if (Utils.isStringNull(username)) {
      isValid = false;
      setUsernameError(Strings.blank_validation_username);
    } else {
      setUsernameError(null);
    }

    if (Utils.isStringNull(password)) {
      isValid = false;
      setPasswordError(Strings.blank_validation_password);
    } else {
      setPasswordError(null);
    }

    if (isValid) {
      const isConnected = await Utils.isNetworkAvailable();
      setLoading(true);

      if (isConnected == true) {
        var data = new FormData();
        data.append('username', username);
        data.append('password', password);
        data.append('checkonly', 0);

        const config = {
          method: 'post',
          url: API.LOGIN_USER, //`https://schooltrunk.librisdev.com/sys/scanit/login`,
          headers: {
            'Content-Type': 'multipart/form-data', //<----- Add this line in your axios header
          },
          data: data,
        };

        axios(config).then(res => {
          setLoading(false);
          console.log(res['data']);
          let data = res['data'];
          if (res['data'] && data['status'] === 'ok') {
            PrefManager.setValue('@userId', data['user']);
            navigation.replace('DashboardScreen');
          }
        });
      } else {
        setLoading(false);
        Utils.DialogBox(
          '',
          Strings.no_internet_connection_please_check_your_internetconnection,
        );
      }
    }
  };

  return (
    // <SafeAreaView style={commonStyle.container}>
    // </SafeAreaView>
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <View style={{flex: 1, backgroundColor: Colors.white}}>
        <ProgressLoader loading={loading} />
        <ScrollableAvoidKeyboard
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}
          contentInset={{bottom: 50}}
          contentContainerStyle={{
            justifyContent: 'center',
          }}>
          <Image
            source={require('../../assets/schooltrunklogo.png')}
            style={{
              height: ScaleSizeUtils.hp('18%'),
              width: ScaleSizeUtils.wp('60%'),
              alignSelf: 'center',
              marginTop: 55,
              resizeMode: 'stretch',
            }}
          />
          <Text style={styles.letStartText}>{Strings.let_start}</Text>

          <Text style={styles.makeTheSchoolApp}>
            {Strings.make_the_school_app}
          </Text>

          <View style={{padding: ScaleSizeUtils.hp(2)}}>
            <View>
              <Text style={styles.userName}>{Strings.usrName}</Text>
              <View style={commonStyle.textInputMainView}>
                <TextInput
                  value={username}
                  style={commonStyle.textInputstyle}
                  onChangeText={text => {
                    setUsername(text);
                    setUsernameError(null);
                  }}
                  placeholderTextColor={Colors.placeHolderColor}
                  placeholder="Enter your name"
                />
              </View>

              {!!usernameError && (
                <Text style={commonStyle.error_message}>{usernameError}</Text>
              )}
            </View>
            <View>
              <Text style={styles.userName}>{Strings.password}</Text>
              <View style={commonStyle.textInputMainView}>
                <TextInput
                  value={password}
                  style={commonStyle.textInputstyle}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError(null);
                  }}
                  placeholderTextColor={Colors.placeHolderColor}
                  placeholder="Enter your password"
                />
              </View>
              {!!passwordError && (
                <Text style={commonStyle.error_message}>{passwordError}</Text>
              )}
            </View>
          </View>
        </ScrollableAvoidKeyboard>
        <Button
          title={Strings.login}
          buttonStyle={{
            marginTop: ScaleSizeUtils.hp(2),
            marginBottom: Platform.OS === 'ios' ? 0 : ScaleSizeUtils.hp(2),
          }}
          onPress={() => {
            handlelogin();
          }}
        />
        <Image
          source={require('../../assets/buttonScale.png')}
          style={styles.bottonImage}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  letStartText: {
    color: Colors.lightPinkColor,
    fontSize: TextFontSize.TEXT_SIZE_LARGE * 1.3,
    fontFamily: AppFonts.Inter_Bold,
    alignSelf: 'center',
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT,
  },
  makeTheSchoolApp: {
    color: Colors.black,
    width: '60%',
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 2,
    fontFamily: AppFonts.Inter_Regular,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT,
  },
  bottonImage: {
    width: '100%',
    bottom: 0,
  },
  bottonMainView: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
  },
  userName: {
    color: Colors.lightPinkColor,
    width: '60%',
    textTransform: 'uppercase',
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    fontFamily: AppFonts.Inter_SemiBold,
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT,
  },
});

export default LoginScreen;
