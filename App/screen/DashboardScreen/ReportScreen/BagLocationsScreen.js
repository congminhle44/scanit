import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import commonStyle from '../../../Styles/commonStyle';
import ProgressLoader from '../../../components/ProgressLoader';
import ReportHeader from '../../../components/ReportHeader';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import TextFontSize from '../../../constants/TextFontSize';
import {cleargetReport, getReport} from '../../../redux/nonAuth/action';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const BagLocationsScreen = props => {
  const {navigation} = props;
  const {houseID, schoolID} = props.route.params;
  useEffect(() => {
    props.cleargetReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    props.getReport(`?school=${schoolID}&house=${houseID}&type=6`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.reportData]);

  return (
    <View style={{backgroundColor: Colors.lightPinkColor}}>
      <ProgressLoader loading={props.loading} />
      <ReportHeader title="Bag locations" navigation={navigation} />
      <View
        style={{height: '100%', backgroundColor: Colors.white, padding: 10}}>
        {props.reportData.length > 0 ? (
          props.reportData.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.stats}
            </Text>
          ))
        ) : (
          <Text style={commonStyle.noRecordfound}>{'No record found :('}</Text>
        )}
        {/* <FlatList
          data={props.reportData}
          contentContainerStyle={{padding: 10}}
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

export default connect(mapStateToProps, mapDispatchToProps)(BagLocationsScreen);

const styles = StyleSheet.create({
  itemText: {
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
  },
});
