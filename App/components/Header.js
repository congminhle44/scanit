import axios from 'axios';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {API} from '../Helper/HttpService';
import PrefManager from '../Helper/PrefManager';
import Utils from '../Helper/Utils';
import Colors from '../constants/Colors';
import AppFonts from '../constants/Fonts';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import Strings from '../constants/Strings';
import TextFontSize from '../constants/TextFontSize';

const Header = props => {
  const logOut = async () => {
    const isConnected = await Utils.isNetworkAvailable();

    if (isConnected == true) {
      Alert.alert('', 'Are you sure you want to logout?', [
        {
          text: 'No',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Yes',
          onPress: () => {
            const config = {
              method: 'post',
              url: API.LOGOUT,
            };

            axios(config).then(res => {
              PrefManager.removeValue('@userId');
              PrefManager.removeValue('@school_id');
              props.navigation.replace('LoginScreen');
            });
          },
          style: 'cancel',
        },
      ]);
    } else {
      Utils.DialogBox(
        '',
        Strings.no_internet_connection_please_check_your_internetconnection,
      );
    }
  };

  return (
    <>
      {/* <ImageBackground
        source={require('../assets/Rectangle.png')}
        resizeMode="contain"
        style={styles.image}>
        
      </ImageBackground> */}
      <LinearGradient
        start={{x: 0.0, y: 0.1}}
        end={{x: 0.0, y: 1.5}}
        colors={['#E4002B', '#FF94A8']}
        style={[styles.linearGradient, props.linearViewPropsStyle]}>
        <View style={{marginTop: ScaleSizeUtils.hp(2)}}>
          <TouchableOpacity
            onPress={() => {
              props.navigationScreen === 'LoginScreen' ? logOut() : null;
            }}
            style={styles.iconImageView}
            activeOpacity={0.9}>
            {
              <Image
                source={require('../assets/logo2.png')}
                style={styles.iconImage}
              />
            }
          </TouchableOpacity>
          {/* {props.navigationScreen === 'LoginScreen' ? (
            <TouchableOpacity
              onPress={() => {
                logOut();
              }}
              style={styles.logoutView}
              activeOpacity={0.9}>
              {
                <Image
                  source={require('../assets/logout.png')}
                  style={styles.logOutImage}
                />
              }
            </TouchableOpacity>
          ) : null} */}

          <Text style={[styles.headertitle]}>{props.title}</Text>
        </View>
      </LinearGradient>
    </>
  );
};

export default Header;

var styles = StyleSheet.create({
  headertitle: {
    color: Colors.white,
    fontSize: TextFontSize.TEXT_SIZE_LARGE + 3,
    fontFamily: AppFonts.Inter_Bold,
    marginTop: ScaleSizeUtils.hp(8),
    marginLeft: ScaleSizeUtils.hp(2),
  },
  image: {
    height: ScaleSizeUtils.hp(28),
    width: '100%',
    marginTop: ScaleSizeUtils.hp(-1),
  },
  iconImageView: {
    height: ScaleSizeUtils.hp(6),
    width: ScaleSizeUtils.hp(6),
    justifyContent: 'center',
    borderRadius: ScaleSizeUtils.hp(5),
    marginLeft: ScaleSizeUtils.hp(2),
  },
  iconImage: {
    height: ScaleSizeUtils.hp(5),
    width: ScaleSizeUtils.hp(5),
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: ScaleSizeUtils.hp(5),
  },
  logoutView: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginRight: ScaleSizeUtils.hp(2),
  },
  backArrow: {
    height: ScaleSizeUtils.MARGIN_DEFAULT + 5,
    width: ScaleSizeUtils.MARGIN_DEFAULT + 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logOutImage: {
    height: ScaleSizeUtils.hp(4),
    width: ScaleSizeUtils.hp(4),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: ScaleSizeUtils.hp(1),
    tintColor: Colors.white,
  },
  linearGradient: {
    width: '100%',
    alignSelf: 'center',
    height: ScaleSizeUtils.hp(25),
    marginBottom: ScaleSizeUtils.hp(1),
    justifyContent: 'center',
  },
});
