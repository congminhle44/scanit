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
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import RenderHtml from 'react-native-render-html';
import {connect} from 'react-redux';
import PrefManager from '../../Helper/PrefManager';
import commonStyle from '../../Styles/commonStyle';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import {barCodeScaner} from '../../redux/nonAuth/action';
import Button from '../Button';
import ErrorBox from '../ErrorBox';
import ProgressLoader from '../ProgressLoader';

const FetchScreenComponents = props => {
  const [identifyOpen, setIdentifyOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [goldCareOpen, setGoldCareOpen] = useState(false);
  const [transferOutOpen, setTransferOutOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const contentWidth = useWindowDimensions().width;

  const [barCodeScanSuccesModal, setBarCodeScanSuccesModal] = useState(false);
  const [barCodeScanErrorModal, setBarCodeScanErrorModal] = useState(false);
  const [bagID, setBagID] = useState('');
  const [bagIDInput, setBagIDInput] = useState('');
  const [identifyData, setIdentifyData] = useState({});
  const [bagName, setBagName] = useState('identify');
  const [schoolAvail, setSchoolAvail] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const systemFonts = [
    'Inter-Black',
    'Inter-Bold',
    'Inter-ExtraBold',
    'Inter-ExtraLight',
    'Inter-Light',
    'Inter-Medium',
    'Inter-Regular',
    'Inter-SemiBold',
    'Inter-Thin',
  ];

  const callUsingBagID = () => {
    setErrorModalOpen(false);
    var data = {
      bag_id: bagIDInput,
      savethis: 0,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      order_id: '0',
      redeliver: 'I',
    };

    bagIDInput.length > 0
      ? props.barCodeScaner(data)
      : Alert.alert('', 'Please enter bag id.');
    setTimeout(() => {
      bagIDInput.length > 0 ? setIdentifyOpen(false) : null;
      bagIDInput.length > 0 ? setOpenModal(false) : null;
    }, 1000);
  };

  const callUsingStorage = () => {
    setErrorModalOpen(false);
    var data = {
      bag_id: bagIDInput,
      savethis: 0,
      baglocation: 0,
      forceugly: 0,
      newstatus: 0,
      order_id: '0',
    };

    bagIDInput.length > 0
      ? props.barCodeScaner(data)
      : Alert.alert('', 'Please enter bag id.');
    setTimeout(() => {
      bagIDInput.length > 0 ? setIdentifyOpen(false) : null;
    }, 1000);
  };

  useEffect(() => {
    const getOrderId = async () => {
      let previousID = await PrefManager.getValue('@ORDER_ID');
      bagIDInput.length > 0
        ? PrefManager.setValue(
            '@ORDER_ID',
            JSON.stringify(
              props?.barcodeScanData?.data?.order_id !== 0
                ? props?.barcodeScanData?.data?.order_id
                : previousID,
            ),
          )
        : null;
    };

    PrefManager.getValue('@schoolId').then(id => {
      setSchoolAvail(id);
    });

    if (identifyData) {
      console.log('1');
      setBagIDInput('');

      if (
        props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 0 &&
        props?.barcodeScanData?.data?.error === 'ok' &&
        props?.barcodeScanData?.data?.order_id !== 0
      ) {
        setStorageOpen(false),
          setGoldCareOpen(false),
          setTransferOutOpen(false),
          setOpenModal(false);
        console.log('2');
        getOrderId();
        bagName === 'identify'
          ? props.navigation.navigate('BarcodeDetailsAdd', {
              data: props?.barcodeScanData,
              bagID: bagID,
              bag_type: props?.barcodeScanData?.data?.bag_type,
              navigation: props?.navigation,
              bag_Name: bagName,
            })
          : props.navigation.navigate('StorageDetailsAdd', {
              bag_Name: bagName,
              data: props?.barcodeScanData?.data,
              bagID: bagID,
              bag_type: props?.barcodeScanData?.data?.bag_type,
              navigation: props.navigation,
            });
      } else if (
        props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 0 &&
        props?.barcodeScanData?.data?.error === 'ok' &&
        props?.barcodeScanData?.data?.order_id === 0
      ) {
        console.log('3');
        props.navigation.navigate('blankOrderIDScreen', {
          data: props?.barcodeScanData?.data,
          bagID: bagID,
          bag_type: props?.barcodeScanData?.data?.bag_type,
          navigation: props?.navigation,
          bag_Name: bagName,
          searchUser: {},
          buttonCall: false,
        });
      } else if (
        (props?.barcodeScanData &&
          props?.barcodeScanData?.data &&
          props?.barcodeScanData?.data?.ret == 1) ||
        (props?.barcodeScanData &&
          props?.barcodeScanData?.data &&
          props?.barcodeScanData?.data?.error === 'Invalid bag id')
      ) {
        console.log('4');
        setBarCodeScanErrorModal(true);
      } else if (
        props?.barcodeScanData &&
        props?.barcodeScanData?.data &&
        props?.barcodeScanData?.data?.ret === 4
      ) {
        console.log('5');
        setErrorModalOpen(true);
        setErrorMessage(props?.barcodeScanData?.data?.error);
      }
    }
  }, [
    bagID,
    bagName,
    identifyData,
    props.navigation,
    props?.barcodeScanData,
    bagIDInput.length,
  ]);

  return (
    <View style={{marginTop: 10}}>
      {errorModalOpen && (
        <ErrorBox
          errorModalOpen={errorModalOpen}
          closeModal={() => {
            setErrorModalOpen(false);
          }}
          message={errorMessage}
        />
      )}

      {openModal === false ? (
        <>
          <View style={styles.mainViewContainer}>
            <TouchableOpacity
              onPress={() => {
                setOpenModal(true);
                setIdentifyOpen(true);
                setBagName('identify');
              }}>
              <ImageBackground
                source={require('../../assets/RectangleBg.png')}
                resizeMode="contain"
                style={styles.imageBg}>
                <Image
                  source={require('../../assets/searchedUser.png')}
                  style={styles.innerImage}
                />
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('BarCodeScanner', {
                  bag_Name: 'identify',
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
                <Text style={styles.detailsBtnText}>Identify</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {schoolAvail !== '' ? (
            <View style={styles.mainViewContainer}>
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                  setStorageOpen(true);
                  setBagName('storage');
                }}>
                <ImageBackground
                  source={require('../../assets/RectangleBg.png')}
                  resizeMode="contain"
                  style={styles.imageBg}>
                  <Image
                    source={require('../../assets/homies.png')}
                    style={styles.innerImage}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setStorageBarCodeOpen(true);
                  // setBagName('storage');
                  props.navigation.navigate('StorageScanner', {
                    bag_Name: 'storage',
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
                  <Text style={styles.detailsBtnText}>Storage</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          ) : null}

          {schoolAvail !== '' ? (
            <View style={styles.mainViewContainer}>
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                  setTransferOutOpen(true);
                  setBagName('transit');
                }}>
                <ImageBackground
                  source={require('../../assets/RectangleBg.png')}
                  resizeMode="contain"
                  style={styles.imageBg}>
                  <Image
                    source={require('../../assets/transfff.png')}
                    style={styles.innerImage}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setTransferOutBarCodeOpen(true);
                  // setBagName('transit');
                  props.navigation.navigate('StorageScanner', {
                    bag_Name: 'transit',
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
                  <Text style={styles.detailsBtnText}>Back to Office</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          ) : null}

          {schoolAvail === '' ? (
            <View style={commonStyle.errorBoxContainer}>
              <Text
                style={[
                  commonStyle.error_message,
                  {
                    textAlign: 'center',
                    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
                  },
                ]}>
                {'Please Select school first.'}
              </Text>
            </View>
          ) : null}
        </>
      ) : null}

      <ProgressLoader loading={props.loading} />

      {identifyOpen === true ? (
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
              keyboardType={'numeric'}
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter your ID"
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Lookup Bag'}
              onPress={() => {
                callUsingBagID(bagID);
              }}
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Back'}
              onPress={() => {
                setIdentifyOpen(false), setOpenModal(false);
              }}
            />
          </View>

          <Text style={styles.bigBtnText}>{Strings.please_add_bag_id}</Text>
        </View>
      ) : null}

      {storageOpen === true ? (
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
              keyboardType={'numeric'}
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter your ID"
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Lookup Bag'}
              onPress={() => {
                callUsingStorage(bagID);
              }}
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Back'}
              onPress={() => {
                setStorageOpen(false), setOpenModal(false);
              }}
            />
          </View>
          <Text style={styles.bigBtnText}>{Strings.please_add_bag_id}</Text>
        </View>
      ) : null}

      {goldCareOpen === true ? (
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
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter your ID"
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Lookup Bag'}
              onPress={() => {
                callUsingStorage(bagID);
              }}
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Back'}
              onPress={() => {
                setGoldCareOpen(false), setOpenModal(false);
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
              keyboardType={'numeric'}
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter your ID"
            />
          </View>
          <View style={{marginTop: ScaleSizeUtils.hp(4)}}>
            <Button
              title={'Lookup Bag'}
              onPress={() => {
                callUsingStorage(bagID);
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

      {openModal === false ? (
        <Text style={styles.bigBtnText}>
          {Strings.use_the_big_button_to_enter}
        </Text>
      ) : null}

      <Modal
        isVisible={barCodeScanSuccesModal}
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
          <Text style={styles.clientNameText}>
            {'Client : '} {props?.barcodeScanData?.data?.client}
          </Text>

          <View style={{marginTop: ScaleSizeUtils.hp(2)}}>
            <RenderHtml
              contentWidth={contentWidth}
              source={{
                html: props?.barcodeScanData?.data?.destination,
              }}
              tagsStyles={{
                tr: {
                  fontFamily: AppFonts.Inter_Bold,
                  color: Colors.black,
                },
                td: {
                  fontFamily: AppFonts.Inter_Bold,
                  color: Colors.black,
                },
                img: {display: 'none'},
              }}
              systemFonts={systemFonts}
            />
          </View>

          <Text style={styles.premiumText}>
            {'Goldcare : '} {props?.barcodeScanData?.data?.goldcare}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setBarCodeScanSuccesModal(false);
              props.navigation.navigate('BarcodeDetailsAdd', {
                data: props?.barcodeScanData,
                bagID: bagID,
                bag_type: props?.barcodeScanData?.bag_type,
                navigation: props?.navigation,
                bag_Name: bagName,
              });
            }}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Ok'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Modal>

      <Modal
        isVisible={barCodeScanErrorModal}
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
          <Text style={styles.clientNameText}>{'Invalid Scan'}</Text>

          <TouchableOpacity
            onPress={() => {
              setBarCodeScanErrorModal(false);
            }}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Ok'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Modal>

      <Modal
        isVisible={errorModalOpen}
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
          <Text style={styles.clientNameText}>
            {props?.barcodeScanData?.data?.error}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setErrorModalOpen(false);
              props.navigation.navigate('BarCodeScanner', {
                bag_Name: 'identify',
                navigation: props.navigation,
              });
            }}
            style={styles.buttonView}>
            <Text style={styles.buttonText}>{'Ok'}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  buttonText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 3,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  buttonView: {
    height: 35,
    width: '40%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    marginTop: ScaleSizeUtils.hp(3),
    borderRadius: ScaleSizeUtils.hp(1),
  },
  clientNameText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 2,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
  },
  premiumText: {
    fontFamily: AppFonts.Inter_SemiBold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    color: Colors.black,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.hp(2),
  },
});

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FetchScreenComponents);

{
  /*schoolAvail !== '' ? (
            <View style={styles.mainViewContainer}>
              <TouchableOpacity
                onPress={() => {
                  setOpenModal(true);
                  setGoldCareOpen(true);
                  setBagName('goldcare');
                }}>
                <ImageBackground
                  source={require('../../assets/RectangleBg.png')}
                  resizeMode="contain"
                  style={styles.imageBg}>
                  <Image
                    source={require('../../assets/GoldCare.png')}
                    style={styles.innerImage}
                  />
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setSGoldcareBarCodeOpen(true);
                  // setBagName('goldcare');
                  props.navigation.navigate('StorageScanner', {
                    bag_Name: 'goldcare',
                    navigation: props.navigation
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
                  <Text style={styles.detailsBtnText}>Gold Care</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
              ) : null*/
}
