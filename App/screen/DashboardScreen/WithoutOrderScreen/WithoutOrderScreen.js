import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {barCodeScaner, getLocationList} from '../../../redux/nonAuth/action';

const WithoutOrderScreen = props => {
  useEffect(() => {}, []);

  return <></>;
};

const mapStateToProps = state => {
  return {
    barcodeScanData: state.nonAuth.barcodeScanData,
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    barCodeScaner: data => {
      dispatch(barCodeScaner(data));
    },
    getLocationList: data => {
      dispatch(getLocationList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WithoutOrderScreen);

const styles = StyleSheet.create({});
