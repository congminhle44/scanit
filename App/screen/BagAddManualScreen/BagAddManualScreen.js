import React from 'react';
import {StyleSheet} from 'react-native';
import BagAddManualComponents from '../../components/BagAddManualScreen/BagAddManualComponents';
import ThemeProvider from '../../components/ThemeProvider';

const BagAddManualScreen = ({navigation}) => {
  return (
    <ThemeProvider
      scrollviewEnabled={true}
      headerTitle="School Trunk"
      navigation={navigation}
      isBack={false}
      loader={false}
      isHeader={true}
      isFooter={false}
      component={() => {
        return <BagAddManualComponents navigation={navigation} />;
      }}
    />
  );
};

export default BagAddManualScreen;

const styles = StyleSheet.create({});
