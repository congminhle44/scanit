import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import commonStyle from '../../../Styles/commonStyle';
import ProgressLoader from '../../../components/ProgressLoader';
import ReportHeader from '../../../components/ReportHeader';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import TextFontSize from '../../../constants/TextFontSize';
import {cleargetReport, getReport} from '../../../redux/nonAuth/action';

const NotYetDelivered = props => {
  const {navigation} = props;
  const {houseID, schoolID} = props.route.params;
  useEffect(() => {
    props.cleargetReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    props.getReport(`?school=${schoolID}&house=${houseID}&type=4`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{backgroundColor: Colors.lightPinkColor}}>
      <ProgressLoader loading={props.loading} />
      <ReportHeader title="Not Yet Redelivered" navigation={navigation} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NotYetDelivered);

const styles = StyleSheet.create({
  itemText: {
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
  },
});
