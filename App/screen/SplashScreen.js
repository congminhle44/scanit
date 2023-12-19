import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {DotsLoader} from 'react-native-indicator';
import PrefManager from '../Helper/PrefManager';
import Colors from '../constants/Colors';

function SplashScreen(props) {
  const {navigation} = props;

  useEffect(() => {
    const redirectScreen = async () => {
      PrefManager.getValue('@userId').then(id => {
        setTimeout(() => {
          id
            ? navigation.replace('DashboardScreen')
            : navigation.replace('LoginScreen');
        }, 3000);
      });
    };

    redirectScreen();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />
      <DotsLoader size={20} color={Colors.offWhite} />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
});
