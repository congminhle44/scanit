import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import PrefManager from '../../Helper/PrefManager';
import Utils from '../../Helper/Utils';
import commonStyle from '../../Styles/commonStyle';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import {
  addStorage,
  barCodeScaner,
  clearaddStorage,
} from '../../redux/nonAuth/action';
import Button from '../Button';
import ProgressLoader from '../ProgressLoader';
import AddNewStorage from './AddNewStorage';

const MoveScreenComponents = props => {
  const {navigation} = props;
  // iconPress = () => {
  //   navigation.navigate('BagAddManualScreen');
  // };
  // iconWithtextPress = () => {
  //   Alert.alert('iconWithtextPress');
  // };

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [transferOutOpen, setTransferOutOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [bagID, setBagID] = useState('');
  const [bagIDInput, setBagIDInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bagName, setBagName] = useState('move');

  const CloseModal = () => {
    setModalVisible(false);
  };

  const createStorage = item => {
    setLoading(true);
    var data = {
      storage: item,
    };
    setLoading(false);
    props.addStorage(data);
  };

  const callUsingBagID = () => {
    var data = {
      bag_id: bagIDInput,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      order_id: '0',
      redeliver: 'N',
      savethis: 0,
    };

    var isValid = true;

    if (Utils.isStringNull(bagIDInput)) {
      isValid = false;
      Alert.alert('', 'Please enter bag id.');
    }

    bagIDInput.length > 0
      ? props.barCodeScaner(data)
      : Alert.alert('', 'Please enter bag id.');

    setTimeout(() => {
      bagIDInput.length > 1 ? setTransferOutOpen(false) : null;
      bagIDInput.length > 1 ? setOpenModal(false) : null;
    }, 1000);
  };

  useEffect(() => {
    PrefManager.getValue('@bag_ID').then(id => {
      setBagID(id);
    });
    setBagIDInput('');

    if (
      (props?.storageCreate &&
        props?.storageCreate &&
        props?.storageCreate?.ret === 0) ||
      (props?.storageCreate &&
        props?.storageCreate &&
        props?.storageCreate?.error === 'ok')
    ) {
      CloseModal();
    } else if (
      (props?.storageCreate &&
        props?.storageCreate &&
        props?.storageCreate?.ret === 1) ||
      (props?.storageCreate &&
        props?.storageCreate &&
        props?.storageCreate?.error !== 'ok')
    ) {
      CloseModal();
    }

    if (
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 0) ||
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.error === 'ok')
    ) {
      props.navigation.navigate('MoveDetailsAdd', {
        bag_Name: bagName,
        data: props?.barcodeScanData?.data,
        bagID: bagID,
        bag_type: props?.barcodeScanData?.data?.bag_type,
        navigation: props.navigation,
      });
    } else if (
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 1) ||
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.error === '')
    ) {
      Alert.alert('', props?.barcodeScanData?.data?.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.storageCreate, props?.barcodeScanData]);

  const setTextFields = text => {
    setText(text);
  };

  return (
    <View style={{marginTop: 10}}>
      <ProgressLoader loading={loading} />
      {openModal === false ? (
        <View style={styles.mainViewContainer}>
          <TouchableOpacity
            onPress={() => {
              setOpenModal(true);
              setTransferOutOpen(true);
            }}>
            <ImageBackground
              source={require('../../assets/RectangleBg.png')}
              resizeMode="contain"
              style={styles.imageBg}>
              <Image
                source={require('../../assets/move.png')}
                style={[styles.innerImage, {tintColor: Colors.black}]}
              />
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('MoveBarcodeScanner', {
                bag_Name: 'move',
                navigation: navigation,
              });
            }}>
            <ImageBackground
              source={require('../../assets/RectangleFetchBg.png')}
              resizeMode="contain"
              style={styles.imageRectBg}>
              <Image
                source={require('../../assets/barcodes.png')}
                style={styles.detailsInnerBtnImg}
              />
              <Text style={styles.detailsBtnText}>Move</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}

      {openModal === false ? (
        <Text style={styles.bigBtnText}>
          {Strings.use_the_big_button_to_enter}
        </Text>
      ) : null}

      {openModal === false ? (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={{marginTop: ScaleSizeUtils.hp(2), alignSelf: 'center'}}>
          <ImageBackground
            source={require('../../assets/RectangleFetchBg.png')}
            resizeMode="contain"
            style={styles.butonViewContainer}>
            <Text style={styles.ButtonText}>Add New Storage</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      {transferOutOpen === true ? (
        <View style={{padding: ScaleSizeUtils.hp(2)}}>
          <Text style={styles.userName}>{Strings.bag_id}</Text>
          <View
            style={[
              commonStyle.textInputMainView,
              {marginTop: ScaleSizeUtils.hp(2)},
            ]}>
            <TextInput
              value={bagIDInput}
              style={commonStyle.textInputstyle}
              onChangeText={text => {
                setBagIDInput(text);
                // setBagID(text);
                PrefManager.setValue('@bag_ID', text);
              }}
              keyboardType="numeric"
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter your ID"
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Lookup Bag'}
              onPress={() => {
                PrefManager.getValue('@bag_ID').then(id => {
                  callUsingBagID(id);
                });
              }}
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Back'}
              onPress={() => {
                setTransferOutOpen(false), setOpenModal(false);
              }}
            />
          </View>

          <Text style={styles.bigBtnText}>{Strings.please_add_bag_id}</Text>
        </View>
      ) : null}

      {modalVisible && (
        <AddNewStorage
          isOpenPicker={modalVisible}
          onOKPress={item => {
            createStorage(item);
          }}
          closeDialog={() => {
            CloseModal();
          }}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    loading: state.nonAuth.loading,
    storageCreate: state.nonAuth.storageCreate,
    barcodeScanData: state.nonAuth.barcodeScanData,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    addStorage: data => {
      dispatch(addStorage(data));
    },
    barCodeScaner: data => {
      dispatch(barCodeScaner(data));
    },
    clearaddStorage: data => {
      dispatch(clearaddStorage(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoveScreenComponents);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
  },
  iconView: {
    width: ScaleSizeUtils.wp('20%'),
    height: ScaleSizeUtils.hp('5%'),
    backgroundColor: Colors.dark_gray,
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  iconTextView: {
    width: ScaleSizeUtils.wp('60%'),
    height: ScaleSizeUtils.hp('7%'),
    marginLeft: ScaleSizeUtils.wp('4%'),
    backgroundColor: Colors.dark_gray,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  TextView: {
    width: ScaleSizeUtils.wp('80%'),
    height: ScaleSizeUtils.hp('5%'),
    marginLeft: ScaleSizeUtils.wp('3%'),
    backgroundColor: Colors.dark_gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  textHead: {
    marginLeft: ScaleSizeUtils.wp('20%'),
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  space: {
    marginTop: 30,
  },
  mainViewContainer: {
    flexDirection: 'row',
    padding: ScaleSizeUtils.hp(1),
    width: '80%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  imageBg: {
    justifyContent: 'center',
    height: ScaleSizeUtils.hp(7),
    width: ScaleSizeUtils.hp(9),
  },
  imageRectBg: {
    flexDirection: 'row',
    height: ScaleSizeUtils.hp(7),
    width: ScaleSizeUtils.hp(30),
  },
  butonViewContainer: {
    height: ScaleSizeUtils.hp(7),
    width: ScaleSizeUtils.hp(30),
    justifyContent: 'center',
  },
  innerImage: {
    height: ScaleSizeUtils.hp(3),
    width: ScaleSizeUtils.hp(3),
    alignSelf: 'center',
  },
  detailsInnerBtnImg: {
    height: ScaleSizeUtils.hp(3),
    width: ScaleSizeUtils.hp(3),
    alignSelf: 'center',
    marginLeft: ScaleSizeUtils.hp(3),
  },
  detailsBtnText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    color: Colors.black,
    alignSelf: 'center',
    marginLeft: ScaleSizeUtils.hp(1),
  },
  ButtonText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  bigBtnText: {
    fontFamily: AppFonts.Inter_Regular,
    width: '75%',
    fontSize: TextFontSize.TEXT_SIZE_REGULAR - 3,
    color: Colors.placeHolderColor,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.hp(5),
    marginLeft: ScaleSizeUtils.hp(1),
  },
  userName: {
    color: Colors.lightPinkColor,
    width: '60%',
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    fontFamily: AppFonts.Inter_SemiBold,
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT,
  },
});
