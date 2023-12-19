import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import AppFonts from '../constants/Fonts';
import TextFontSize from '../constants/TextFontSize';

export default function Footer({navigation, onNavigate, clearData}) {
  const [active, setActive] = useState(0);

  const list = [
    {
      icon: require('../assets/home.png'),
      navigation: 'LoginScreen',
      lable: 'Home',
    },
    {
      icon: require('../assets/fetch.png'),
      navigation: 'FetchScreen',
      lable: 'Fetch',
    },
    {
      icon: require('../assets/move.png'),
      navigation: 'MoveScreen',
      lable: 'Move',
    },
    {
      icon: require('../assets/delivery.png'),
      navigation: 'DeliverScreen',
      lable: 'Deliver',
    },
    {
      icon: require('../assets/reports.png'),
      navigation: 'ReportScreen',
      lable: 'Reports',
    },
  ];

  const handleClick = (index, screen) => {
    setActive(index);
    onNavigate(screen);
    clearData();
  };

  return (
    <View style={styles.footer}>
      <View style={{flexDirection: 'row'}}>
        {list.map((x, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleClick(index, x.navigation)}
              style={[
                styles.bottomButtons,
                {
                  marginTop: active === index ? -30 : 0,
                },
              ]}>
              <Image
                source={x.icon}
                style={{
                  height: 25,
                  resizeMode: 'contain',
                  tintColor:
                    active === index
                      ? Colors.FooterIcon
                      : Colors.bottomTabInActive,
                  width: 25,
                }}
              />
              <Text
                style={[
                  styles.footerText,
                  {
                    color:
                      active === index
                        ? Colors.FooterIcon
                        : Colors.bottomTabInActive,
                  },
                ]}>
                {x.lable}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    height: 65,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 7,
    flex: 1,
  },
  footerText: {
    color: Colors.FooterIcon,
    alignItems: 'center',
    fontFamily: AppFonts.Inter_Medium,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR - 3,
  },
});
