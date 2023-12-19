import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';

const IconHeaderView = ({iconView, title, iconOnPress, iconWithtextPress}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity onPress={() => iconOnPress()} style={styles.iconView}>
        {iconView}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => iconWithtextPress()}
        style={styles.iconTextView}>
        <View
          style={{
            width: ScaleSizeUtils.wp('10%'),
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            left: -10,
          }}>
          {iconView}
        </View>
        <View
          style={{
            width: ScaleSizeUtils.wp('30%'),
            alignItems: 'center',
          }}>
          <Text style={styles.textHead}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default IconHeaderView;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
  },
  iconView: {
    width: ScaleSizeUtils.wp('20%'),
    height: ScaleSizeUtils.hp('5%'),
    backgroundColor: Colors.dark_gray,
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  iconTextView: {
    width: ScaleSizeUtils.wp('60%'),
    height: ScaleSizeUtils.hp('5%'),
    marginLeft: ScaleSizeUtils.wp('4%'),
    backgroundColor: Colors.dark_gray,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  textHead: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    left: -20,
  },
});
