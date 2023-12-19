import React, {useEffect, useState} from 'react';
import {BackHandler, ScrollView} from 'react-native';
import PrefManager from '../../Helper/PrefManager';
import DashboardScreenComponent from '../../components/DashboardScreen/DashboardScreenComponent';
import DeliverScreenComponents from '../../components/DeliverScreen/DeliverScreenComponents';
import FetchScreenComponents from '../../components/FetchScreen/FetchScreenComponents';
import MoveScreenComponents from '../../components/MoveScreen/MoveScreenComponents';
import ReportScreenComponents from '../../components/ReportScreen/ReportScreenComponents';
import ThemeProvider from '../../components/ThemeProvider';

const DashboardScreen = ({navigation}) => {
  const [navigationa, setNavigation] = useState('LoginScreen');
  const [userName, setUserName] = useState('');

  function handleBackButtonClick() {
    PrefManager.removeValue('@default');
  }

  useEffect(() => {
    getUserDetails();

    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  });

  const onNavigationa = onNavigation => {
    setNavigation(onNavigation);
  };

  const getUserDetails = async () => {
    PrefManager.getValue('@userId').then(id => {
      setUserName(id);
    });
  };

  return (
    <>
      <ThemeProvider
        scrollviewEnabled={true}
        headerTitle={'Hello, ' + userName}
        navigation={navigation}
        isBack={false}
        loader={false}
        onNavigation={onNavigationa}
        navigationScreen={navigationa}
        isHeader={true}
        isFooter={true}
        component={() => {
          return (
            <ScrollView>
              {navigationa == 'LoginScreen' ? (
                <DashboardScreenComponent navigation={navigation} />
              ) : navigationa == 'FetchScreen' ? (
                <FetchScreenComponents navigation={navigation} />
              ) : navigationa == 'MoveScreen' ? (
                <MoveScreenComponents navigation={navigation} />
              ) : navigationa == 'DeliverScreen' ? (
                <DeliverScreenComponents navigation={navigation} />
              ) : navigationa == 'ReportScreen' ? (
                <ReportScreenComponents navigation={navigation} />
              ) : (
                <DashboardScreenComponent navigation={navigation} />
              )}
            </ScrollView>
          );
        }}
      />
    </>
  );
};

export default DashboardScreen;
