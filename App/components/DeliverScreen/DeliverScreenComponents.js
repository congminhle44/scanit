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
import Modal from 'react-native-modal';
import PrefManager from '../../Helper/PrefManager';
import commonStyle from '../../Styles/commonStyle';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import Button from '../Button';

import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {API} from '../../Helper/HttpService';
import Utils from '../../Helper/Utils';
import {
  addStorage,
  barCodeScaner,
  clearaddStorage,
} from '../../redux/nonAuth/action';
import ErrorBox from '../ErrorBox';
import ProgressLoader from '../ProgressLoader';

const DeliverScreenComponents = props => {
  const [transferOutOpen, setTransferOutOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [bagID, setBagID] = useState('');
  const [bagIDInput, setBagIDInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bagName, setBagName] = useState('query');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelLabelArray, setCancelLabelArray] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    PrefManager.getValue('@bag_ID').then(id => {
      setBagID(id);
    });
    setBagIDInput('');
    console.log(
      'props?.barcodeScanData?.data==> ' +
        JSON.stringify(props?.barcodeScanData?.data),
    );
    if (
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 0) ||
      (props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.error === 'ok')
    ) {
      props.navigation.navigate('QueryDetailsAdd', {
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
  }, [props?.barcodeScanData]);

  const callUsingBagID = () => {
    var data = {
      bag_id: bagID,
      savethis: 0,
    };
    bagID.length > 1
      ? props.barCodeScaner(data)
      : Alert.alert('', 'Please enter bag id.');
    setTimeout(() => {
      bagID.length > 1 ? setTransferOutOpen(false) : null;
      bagID.length > 1 ? setOpenModal(false) : null;
    }, 1000);
  };

  const cancelLabel = () => {
    setOpenModal(true);
    setCancelModalOpen(true);
  };

  const markAllDelivery = async () => {
    var data = {
      bag_id: bagID,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      order_id: '0',
      redeliver: 'Q',
      savethis: 0,
    };

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: `${API.BASE_URL}scanlabel`, //`https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config).then(async res => {
        setLoading(false);
        setCancelModalOpen(false);
        setOpenModal(false);
        setTimeout(() => {
          setCancelModal(true);
        }, 500);
        setCancelLabelArray(res?.data);
      });
    } else {
      setLoading(false);
      Utils.DialogBox(
        '',
        Strings.no_internet_connection_please_check_your_internetconnection,
      );
    }
  };

  const cancelLabelAPI = async bagID => {
    var data = {
      bag_id: bagID,
      bag_notes: null,
      bag_type: null,
      bag_weight: null,
      baglocation: null,
      forceugly: null,
      new_order_id: null,
      newstatus: 10,
      order_id: cancelLabelArray?.order_id,
      savethis: 1,
    };

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: `${API.BASE_URL}scanlabel`, //`https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config).then(res => {
        setLoading(false);
        setCancelModal(false);
        if (
          (res && res?.data && res?.data?.ret === 0) ||
          (res && res?.data && res?.data?.error === 'ok')
        ) {
          setCancelModalOpen(false);
          setOpenModal(false);
          setTimeout(() => {
            setSuccessModalOpen(true);
          }, 500);
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

  return (
    <View style={{marginTop: 10}}>
      <ProgressLoader loading={loading} />
      {errorBoxOpen && (
        <ErrorBox
          errorModalOpen={errorBoxOpen}
          closeModal={() => {
            setErrorBoxOpen(false);
            setTimeout(() => {
              props.navigation.goBack();
            }, 500);
          }}
          message={errorMessage}
        />
      )}

      {openModal === false ? (
        <View style={{marginTop: 10}}>
          <View style={styles.mainViewContainer}>
            <TouchableOpacity
              onPress={() => {
                setBagName('query');
                setOpenModal(true);
                setTransferOutOpen(true);
              }}>
              <ImageBackground
                source={require('../../assets/RectangleBg.png')}
                resizeMode="contain"
                style={styles.imageBg}>
                <Image
                  source={require('../../assets/queryImg.png')}
                  style={[styles.innerImage]}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('QueryBarcodeScanner', {
                  bag_Name: 'query',
                  navigation: props.navigation,
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
                <Text style={styles.detailsBtnText}>Query</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <View style={styles.mainViewContainer}>
            <TouchableOpacity
              onPress={() => {
                setBagName('redeliver');
                setOpenModal(true);
                setTransferOutOpen(true);
              }}>
              <ImageBackground
                source={require('../../assets/RectangleBg.png')}
                resizeMode="contain"
                style={styles.imageBg}>
                <Image
                  source={require('../../assets/redelivery.png')}
                  style={[styles.innerImage]}
                />
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setBagName('redeliver');
                props.navigation.navigate('QueryBarcodeScanner', {
                  bag_Name: 'redeliver',
                  navigation: props.navigation,
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
                <Text style={styles.detailsBtnText}>Redeliver</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          <Text style={styles.bigBtnText}>
            {Strings.use_the_big_button_to_enter}
          </Text>

          <TouchableOpacity
            style={{
              marginTop: ScaleSizeUtils.hp(2),
              marginLeft: ScaleSizeUtils.hp(1),
              alignSelf: 'center',
            }}
            onPress={() => {
              cancelLabel();
            }}>
            <ImageBackground
              source={require('../../assets/ButtonBG.png')}
              resizeMode="contain"
              style={styles.btnMainViewContainer}>
              <Image
                source={require('../../assets/delete.png')}
                style={styles.deleteImg}
              />
              <Text style={styles.cancelText}>Cancel Label</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      ) : null}

      {cancelModalOpen === true ? (
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
                setBagID(text);
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
                markAllDelivery();
              }}
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Back'}
              onPress={() => {
                setOpenModal(false);
                setCancelModalOpen(false);
              }}
            />
          </View>

          <Text style={styles.bigBtnText}>{Strings.please_add_bag_id}</Text>
        </View>
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
                setBagID(text);
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

      {cancelModal && (
        <Modal
          isVisible={cancelModal}
          avoidKeyboard={true}
          presentationStyle="formSheet"
          hideModalContentWhileAnimating={true}
          useNativeDriver={true}
          animationIn={'zoomIn'}
          animationType="fade"
          animationOut={'zoomOut'}
          animationInTiming={1000}
          animationOutTiming={1000}>
          <View
            style={{height: '100%', width: '100%', justifyContent: 'center'}}>
            <LinearGradient
              colors={['#E4002B', '#FF94A8']}
              style={{
                padding: ScaleSizeUtils.MARGIN_DEFAULT,
                width: '90%',
                alignSelf: 'center',
                borderRadius: ScaleSizeUtils.MARGIN_TEN,
              }}>
              <Text
                style={[
                  styles.clientNameText,
                  {
                    color: Colors.white,
                    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 6,
                    fontFamily: AppFonts.Inter_Bold,
                  },
                ]}>
                {'Cancel Bag Label?'}
              </Text>
              <Text
                style={[
                  styles.clientNameText,
                  {color: Colors.white, fontFamily: AppFonts.Inter_Bold},
                ]}>
                {`Are you sure you want to cancel label ${bagID} here allocated to ${
                  cancelLabelArray ? cancelLabelArray?.client : null
                }?`}
              </Text>

              <View
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setCancelModal(false);
                    // setBarCodeScanSuccesModal(false);
                  }}
                  style={[
                    styles.buttonView,
                    {backgroundColor: 'rgba(120,120,120,0.5)'},
                  ]}>
                  <Text style={[styles.buttonText, {color: Colors.white}]}>
                    {'No'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    cancelLabelAPI(bagID);
                  }}
                  style={[styles.buttonView, {backgroundColor: Colors.white}]}>
                  <Text style={styles.buttonText}>{'Yes'}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
      )}

      {successModalOpen && (
        <Modal
          isVisible={successModalOpen}
          animationIn={'zoomIn'}
          animationOut={'zoomOut'}
          animationInTiming={1000}
          animationOutTiming={1000}>
          <LinearGradient
            colors={['#E4002B', '#FF94A8']}
            style={{
              padding: ScaleSizeUtils.MARGIN_DEFAULT,
              width: '90%',
              alignSelf: 'center',
              borderRadius: ScaleSizeUtils.MARGIN_TEN,
            }}>
            <Text
              style={[
                styles.clientNameText,
                {
                  color: Colors.white,
                  fontSize: TextFontSize.TEXT_SIZE_REGULAR + 6,
                  fontFamily: AppFonts.Inter_Bold,
                },
              ]}>
              {'Label Cancelled'}
            </Text>
            <Text
              style={[
                styles.clientNameText,
                {color: Colors.white, fontFamily: AppFonts.Inter_Bold},
              ]}>
              {`Bag ${bagID} has been cancelled`}
            </Text>

            <View
              style={{
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                  setSuccessModalOpen(false);
                }}
                style={[
                  styles.buttonView,
                  {backgroundColor: 'rgba(120,120,120,0.5)'},
                ]}>
                <Text style={[styles.buttonText, {color: Colors.white}]}>
                  {'Ok'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Modal>
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
)(DeliverScreenComponents);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 5,
    elevation: 3,
  },
  space: {
    marginTop: 30,
  },
  TextView: {
    width: ScaleSizeUtils.wp('80%'),
    height: ScaleSizeUtils.hp('5%'),
    marginLeft: ScaleSizeUtils.wp('3%'),
    backgroundColor: Colors.dark_gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.medium_gray,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginRight: ScaleSizeUtils.wp('25%'),
  },
  mainViewContainer: {
    flexDirection: 'row',
    padding: ScaleSizeUtils.hp(1),
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
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
  btnMainViewContainer: {
    flexDirection: 'row',
    height: ScaleSizeUtils.hp(7),
    width: ScaleSizeUtils.hp(40),
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    color: Colors.black,
    textAlign: 'center',
    alignSelf: 'center',
  },
  deleteImg: {
    position: 'absolute',
    left: 0,
    height: 30,
    width: 30,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginLeft: ScaleSizeUtils.hp(2),
  },
  userName: {
    color: Colors.lightPinkColor,
    width: '60%',
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    fontFamily: AppFonts.Inter_SemiBold,
    marginTop: ScaleSizeUtils.MARGIN_DEFAULT,
  },
  clientNameText: {
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 2,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  indicatorView: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(1, 1, 1, 0.4)',
  },
  buttonText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 3,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonView: {
    height: 35,
    width: '20%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: ScaleSizeUtils.hp(3),
    borderRadius: ScaleSizeUtils.hp(1),
  },
});
