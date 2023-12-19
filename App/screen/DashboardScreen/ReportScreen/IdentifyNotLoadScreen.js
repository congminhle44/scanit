//
//

import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Linking,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import QRCodeScanner from 'react-native-qrcode-scanner';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
import {
  barCodeScaner,
  clearBarCodeScanner,
  getReport,
  cleargetReport,
} from '../../../redux/nonAuth/action';
import {connect} from 'react-redux';
import PrefManager from '../../../Helper/PrefManager';
import Utils from '../../../Helper/Utils';
import ProgressLoader from '../../../components/ProgressLoader';
import axios from 'axios';
import ReportHeader from '../../../components/ReportHeader';
import {FlatList} from 'react-native-gesture-handler';
import AppFonts from '../../../constants/Fonts';
import TextFontSize from '../../../constants/TextFontSize';
import commonStyle from '../../../Styles/commonStyle';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const IdentifyNotLoadScreen = props => {
  const {navigation} = props;
  const {houseID, schoolID} = props.route.params;
  useEffect(() => {
    props.cleargetReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    props.getReport(`?school=${schoolID}&house=${houseID}&type=2`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{backgroundColor: Colors.lightPinkColor}}>
      <ProgressLoader loading={props.loading} />
      <ReportHeader title="Identified not loaded" navigation={navigation} />
      <View style={{padding: 10, backgroundColor: Colors.white}}>
        {props.reportData.length > 0 ? (
          props.reportData.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.stats}
            </Text>
          ))
        ) : (
          <Text style={commonStyle.noRecordfound}>{'No record found :('}</Text>
        )}
      </View>
      {/* <FlatList
        data={props.reportData}
        contentContainerStyle={{padding: 10, backgroundColor: Colors.white}}
        ListEmptyComponent={() => {
          return (
            <Text style={commonStyle.noRecordfound}>
              {'No record found :('}
            </Text>
          );
        }}
        renderItem={({item, index}) => {
          return <Text style={styles.itemText}>{item.stats}</Text>;
        }}
      /> */}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    reportData: state.nonAuth.reportData,
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getReport: data => {
      dispatch(getReport(data));
    },
    cleargetReport: data => {
      dispatch(cleargetReport(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IdentifyNotLoadScreen);

const styles = StyleSheet.create({
  itemText: {
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
  },
});
