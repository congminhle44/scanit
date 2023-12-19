import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import PrefManager from '../../Helper/PrefManager';
import BarcodeDetailsScreenComponent from '../../components/DashboardScreen/BarcodeDetailsScreenComponent';
import BarcodeInformativeScreenComponent from '../../components/DashboardScreen/BarcodeInformativeScreenComponent';
import ErrorBox from '../../components/ErrorBox';
import Colors from '../../constants/Colors';
import {API} from '../../Helper/HttpService';
import Utils from '../../Helper/Utils';
import axios from 'axios';
import Strings from '../../constants/Strings';

const BarcodeDetailsAdd = props => {
  const [navigationa, setNavigation] = useState('LoginScreen');
  const [userName, setUserName] = useState('');
  const {navigation, data, bag_type, bag_Name} = props.route.params;
  const [bagID, setBagID] = useState('');
  const [bagType, setBagType] = useState(bag_type);
  const [loading, setLoading] = useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getUserDetails();
    PrefManager.getValue('@bag_ID').then(BAG => {
      console.log('BAG==> ' + JSON.stringify(BAG));
      setBagID(BAG);
    });
  }, [bagType]);

  // const onNavigationa = onNavigation => {
  //   setNavigation(onNavigation);
  // };

  const getUserDetails = async () => {
    PrefManager.getValue('@userId').then(id => {
      setUserName(id);
    });
  };

  const itemCallApi = async () => {
    var data = {
      bag_id: bagID,
      bag_notes: '',
      bag_type: bagType,
      bag_weight: 0,
      baglocation: 0,
      forceugly: bag_Name === 'identify' ? 1 : '',
      new_order_id: 0,
      redeliver: bag_Name === 'identify' ? 'I' : 'M',
      newstatus:
        bag_Name === 'storage'
          ? 5
          : bag_Name === 'goldcare'
          ? 4
          : bag_Name === 'transit'
          ? 3
          : 2,
      // order_id: orderID,
      savethis: 1,
    };

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: `${API.BASE_URL}scanlabel`, // `https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config).then(res => {
        setLoading(false);
        if (
          (res && res?.data && res?.data?.ret === 0) ||
          (res && res?.data && res?.data?.error === 'ok')
        ) {
          props.navigation.goBack();
        } else if (
          (res && res?.data && res?.data?.ret === 1) ||
          (res && res?.data && res?.data?.error !== 'ok')
        ) {
          setErrorBoxOpen(true);
          setErrorMessage(res?.data && res?.data?.error);
        }
      });
    } else {
      setLoading(false);
      Utils.DialogBox(
        '',
        Strings.no_internet_connection_please_check_your_internetconnection,
      );
    }
  };

  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );
  return (
    <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 0 : 50}}>
      <MyStatusBar
        backgroundColor={Colors.lightPinkColor}
        barStyle="light-content"
      />

      <View style={{marginTop: Platform.OS === 'ios' ? 30 : 0}}>
        {errorBoxOpen && (
          <ErrorBox
            errorModalOpen={errorBoxOpen}
            closeModal={() => {
              setErrorBoxOpen(false);
            }}
            message={errorMessage}
            navigation={navigation}
          />
        )}

        {bagType !== 0 ? (
          <BarcodeDetailsScreenComponent
            navigation={navigation}
            data={data}
            bagID={bagID}
            bagTypes={bagType}
            bag_Name={bag_Name}
          />
        ) : bagType === '1' || 1 ? (
          <BarcodeInformativeScreenComponent
            navigation={navigation}
            data={data}
            bagID={bagID}
            bagTypes={bagType}
            bag_Name={bag_Name}
            bagTypeSelection={item => {
              //setBagType(item);
            }}
          />
        ) : (
          itemCallApi()
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BarcodeDetailsAdd;
