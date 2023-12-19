//

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {getRingerMode} from 'react-native-ringer-mode';
import {connect} from 'react-redux';
import {API} from '../../../Helper/HttpService';
import PrefManager from '../../../Helper/PrefManager';
import Utils from '../../../Helper/Utils';
import ErrorBox from '../../../components/ErrorBox';
import ProgressLoader from '../../../components/ProgressLoader';
import Colors from '../../../constants/Colors';
import {barCodeScaner, getLocationList} from '../../../redux/nonAuth/action';
import Strings from '../../../constants/Strings';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const MoveBarcodeScanner = props => {
  const {bag_Name, navigation} = props.route.params;
  const [identifyOpen, setIdentifyData] = useState({});
  const [bagID, setBagID] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashStart, setFlashStart] = useState(false);
  const [flash, setFlash] = useState(RNCamera.Constants.FlashMode.off);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('bag_Name==> ' + JSON.stringify(bag_Name));
    props.getLocationList(`?page=0&start=0&limit=25`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSuccess = e => {
    setIdentifyData(e);
    callApi(e);
  };

  const changeFlash = item => {
    setFlashStart(!flashStart);
  };

  const callApi = async e => {
    var data = e.data.split(':');
    var bagID = data[1];
    var ORderID = data[2];
    setBagID(bagID);
    PrefManager.setValue('@bag_ID', data[1]);
    var data = {
      bag_id: bagID,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      redeliver: 'N',
      order_id: 0,
      savethis: 0,
    };
    const isConnected = await Utils.isNetworkAvailable();
    console.log('DATA=> ' + JSON.stringify(data));
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
          props.navigation.replace('MoveDetailsAdd', {
            bag_Name: bag_Name,
            data: res.data,
            bagID: bagID,
            bag_type: res.data?.bag_type,
            navigation: props.navigation,
          });
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

  const startPlayer = async e => {
    const currentMode = await getRingerMode();
    console.log('MODE=> ' + JSON.stringify(currentMode));

    var Sound = require('react-native-sound');
    Sound.setCategory('Playback');
    console.log('ASDASDASDASDASDASD');
    let uri = require('../../../assets/beep.mp3');
    if (currentMode === 1) {
      onSuccess(e);
    } else {
      var whoosh = new Sound(uri, error => {
        whoosh.setVolume(1);
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }

        whoosh.play(success => {
          if (success) {
            whoosh.stop();
            onSuccess(e);
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    }
  };

  return (
    <>
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

      <View style={styles.closeContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../../../assets/close.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          zIndex: 2,
          bottom: 20,
          height: 100,
          width: '100%',
        }}>
        <TouchableOpacity
          style={styles.flashContainer}
          onPress={() => {
            changeFlash(flashStart);
          }}>
          <Image
            source={
              flashStart
                ? require('../../../assets/Flashonicon.png')
                : require('../../../assets/Flashofficon.png')
            }
            style={styles.flashIcon}
          />
        </TouchableOpacity>
      </View>
      <QRCodeScanner
        onRead={e => {
          startPlayer(e);
        }}
        flashMode={
          !flashStart
            ? RNCamera.Constants.FlashMode.off
            : RNCamera.Constants.FlashMode.torch
        }
        cameraStyle={{height: screenHeight}}
      />
      <ProgressLoader loading={loading} />
    </>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(MoveBarcodeScanner);

const styles = StyleSheet.create({
  popupView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  closeContainer: {
    height: 50,
    width: '100%',
    position: 'absolute',
    marginTop: 35,
    justifyContent: 'center',
    zIndex: 3,
  },
  closeIcon: {
    height: 30,
    width: 30,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  flashContainer: {
    height: 50,
    width: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    borderRadius: 50,
    marginRight: 10,
  },
  flashIcon: {
    height: 40,
    width: 40,
    alignSelf: 'center',
    tintColor: Colors.white,
  },
});
