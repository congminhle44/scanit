import {NavigationContainer} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Animated, LogBox} from 'react-native';
import BagAddManualScreen from '../screen/BagAddManualScreen/BagAddManualScreen';
import DashboardScreen from '../screen/DashboardScreen/DashboardScreen';
import SplashScreen from '../screen/SplashScreen';

import {Provider} from 'react-redux';
import {configureStore} from '../redux/store';
import BarCodeScanner from '../screen/DashboardScreen/BarCodeScanner';
import BarcodeDetailsAdd from '../screen/DashboardScreen/BarcodeDetailsAdd';
import MoveBarcodeScanner from '../screen/DashboardScreen/MoveScreen/MoveBarcodeScanner';
import MoveCreateCustom from '../screen/DashboardScreen/MoveScreen/MoveCreateCustom';
import MoveDetailsAdd from '../screen/DashboardScreen/MoveScreen/MoveDetailsAdd';
import QueryBarcodeScanner from '../screen/DashboardScreen/QueryScreen/QueryBarcodeScanner';
import QueryCreateCustom from '../screen/DashboardScreen/QueryScreen/QueryCreateCustom';
import QueryDetailsAdd from '../screen/DashboardScreen/QueryScreen/QueryDetailsAdd';
import BagLocationsScreen from '../screen/DashboardScreen/ReportScreen/BagLocationsScreen';
import IdentifyNotLoadScreen from '../screen/DashboardScreen/ReportScreen/IdentifyNotLoadScreen';
import NotYetDelivered from '../screen/DashboardScreen/ReportScreen/NotYetDelivered';
import OrderWithNoBagsScreen from '../screen/DashboardScreen/ReportScreen/OrderWithNoBagsScreen';
import StatusScreen from '../screen/DashboardScreen/ReportScreen/StatusScreen';
import StorageCreateCustom from '../screen/DashboardScreen/StorageCreateCustom';
import StorageDetailsAdd from '../screen/DashboardScreen/StorageDetailsAdd';
import StorageScanner from '../screen/DashboardScreen/StorageScanner';
import SearchUser from '../screen/DashboardScreen/blankOrderIDScreen/SearchUser';
import blankOrderIDScreen from '../screen/DashboardScreen/blankOrderIDScreen/BlankOrderIDScreen';
import LoginScreen from '../screen/LoginScreen/LoginScreen';

// Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);

//Ignore all log notifications
LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const store = configureStore();

export function springyFadeIn() {
  const transitionSpec = {
    timing: Animated.spring,
    tension: 10,
    useNativeDriver: true,
  };
  return {
    transitionSpec,
    screenInterpolator: ({position, scene}) => {
      const {index} = scene;

      const opacity = position.interpolate({
        inputRange: [index - 1, index],
        outputRange: [0, 1],
      });

      return {opacity};
    },
  };
}

const AppNavigator = () => (
  <Stack.Navigator
    navigationOptions={{
      headerVisible: false,
    }}
    presentation="modal"
    animation={springyFadeIn()}
    screenOptions={{
      header: false,
      headerShown: false,
      gestureEnabled: false,
      cardOverlayEnabled: true,
      ...TransitionPresets.SlideFromRightIOS, // <-- The preset causing this issue!
    }}
    initialRouteName={'SplashScreen'}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
    <Stack.Screen name="BagAddManualScreen" component={BagAddManualScreen} />
    <Stack.Screen name="BarcodeDetailsAdd" component={BarcodeDetailsAdd} />
    <Stack.Screen name="BarCodeScanner" component={BarCodeScanner} />
    <Stack.Screen name="StorageScanner" component={StorageScanner} />
    <Stack.Screen name="StorageDetailsAdd" component={StorageDetailsAdd} />
    <Stack.Screen name="StorageCreateCustom" component={StorageCreateCustom} />
    <Stack.Screen name="MoveBarcodeScanner" component={MoveBarcodeScanner} />
    <Stack.Screen name="MoveDetailsAdd" component={MoveDetailsAdd} />
    <Stack.Screen name="MoveCreateCustom" component={MoveCreateCustom} />
    <Stack.Screen name="QueryBarcodeScanner" component={QueryBarcodeScanner} />
    <Stack.Screen name="QueryCreateCustom" component={QueryCreateCustom} />
    <Stack.Screen name="QueryDetailsAdd" component={QueryDetailsAdd} />
    <Stack.Screen name="StatusScreen" component={StatusScreen} />
    <Stack.Screen name="NotYetDelivered" component={NotYetDelivered} />
    <Stack.Screen name="BagLocationsScreen" component={BagLocationsScreen} />
    <Stack.Screen name="blankOrderIDScreen" component={blankOrderIDScreen} />
    <Stack.Screen name="SearchUser" component={SearchUser} />
    <Stack.Screen
      name="IdentifyNotLoadScreen"
      component={IdentifyNotLoadScreen}
    />
    <Stack.Screen
      name="OrderWithNoBagsScreen"
      component={OrderWithNoBagsScreen}
    />
  </Stack.Navigator>
);

const App = props => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
