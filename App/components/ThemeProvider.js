import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';
import {clearBarCodeScanner} from '../redux/nonAuth/action';
import Footer from './Footer';
import Header from './Header';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import commonStyle from '../Styles/commonStyle';
import AppRoot from './AppRoot';

// import Footer from './Footer';

const {width, height} = Dimensions.get('window');

const ThemeProvider = ({
  navigation,
  component,
  loader,
  activeIndex,
  headerTitle,
  isBack,
  isDrawer,
  isHeader,
  isFooter,
  onNavigation,
  navigationScreen,
  clearBarCodeScanner,
}) => {
  const clearData = () => {
    clearBarCodeScanner();
  };

  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  return (
    <View style={styles.container}>
      <MyStatusBar
        backgroundColor={Colors.lightPinkColor}
        barStyle="light-content"
      />
      {isHeader ? (
        <Header
          navigationScreen={navigationScreen}
          navigation={navigation}
          title={headerTitle}
        />
      ) : null}
      <View style={{height: height / 1.07, backgroundColor: Colors.lightWhite}}>
        {component()}
      </View>
      {isFooter ? (
        <Footer
          onNavigate={onNavigation}
          activeIndex={activeIndex}
          navigation={navigation}
          clearData={() => {
            clearData();
          }}
        />
      ) : null}

      <View style={styles.content} />
    </View>
    // <View style={commonStyle.safeAreaViewContainer}>
    // <StatusBar
    //   backgroundColor={Colors.lightPinkColor}
    //   barStyle={'light-content'}
    // />
    // {isHeader ? (
    //   <Header
    //     navigationScreen={navigationScreen}
    //     navigation={navigation}
    //     title={headerTitle}
    //   />
    // ) : null}
    // <View style={{height: height / 1.07, backgroundColor: Colors.lightWhite}}>
    //   {component()}
    // </View>
    // {isFooter ? (
    //   <Footer
    //     onNavigate={onNavigation}
    //     activeIndex={activeIndex}
    //     navigation={navigation}
    //     clearData={() => {
    //       clearData();
    //     }}
    //   />
    // ) : null}
    // </View>
  );
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: 30,
  },
  content: {
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    clearBarCodeScanner: data => {
      dispatch(clearBarCodeScanner(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeProvider);
