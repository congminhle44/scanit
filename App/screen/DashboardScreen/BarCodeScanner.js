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
import {useSilentSwitch} from 'react-native-volume-manager';
import {connect} from 'react-redux';
import PrefManager from '../../Helper/PrefManager';
import Colors from '../../constants/Colors';
import {barCodeScaner, clearBarCodeScanner} from '../../redux/nonAuth/action';
const screenHeight = Math.round(Dimensions.get('window').height);

const BarCodeScanner = props => {
  const {navigation} = props.route.params;
  // const [bagID, setBagID] = useState('');
  const [flashStart, setFlashStart] = useState(false);
  const status = useSilentSwitch();
  useEffect(() => {}, []);

  const onSuccess = e => {
    callApi(e);
    props.navigation.goBack();
  };
  const callApi = e => {
    props.clearBarCodeScanner();
    var data = e.data.split(':');
    var bagID = data[1];
    var ORderID = data[2];
    // setBagID(bagID);
    PrefManager.setValue('@bag_ID', data[1]);
    var data = {
      bag_id: bagID,
      order_id: ORderID,
      savethis: 0,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      redeliver: 'I',
    };

    props.barCodeScaner(data);
  };

  const changeFlash = item => {
    setFlashStart(!flashStart);
  };

  const startPlayer = async e => {
    const currentMode = await getRingerMode();
    console.log('MODE=> ' + JSON.stringify(status));

    var Sound = require('react-native-sound');
    Sound.setCategory('Playback');
    let uri = require('../../assets/beep.mp3');
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
      <View style={styles.closeContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../../assets/close.png')}
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
                ? require('../../assets/Flashonicon.png')
                : require('../../assets/Flashofficon.png')
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
    clearBarCodeScanner: data => {
      dispatch(clearBarCodeScanner(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScanner);

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
