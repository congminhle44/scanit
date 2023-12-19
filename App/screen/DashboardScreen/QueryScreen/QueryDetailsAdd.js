import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import PrefManager from '../../../Helper/PrefManager';
import AppFonts from '../../../constants/Fonts';
import ScaleSizeUtils from '../../../constants/ScaleSizeUtils';
import TextFontSize from '../../../constants/TextFontSize';

import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {API} from '../../../Helper/HttpService';
import Utils from '../../../Helper/Utils';
import Button from '../../../components/Button';
import ErrorBox from '../../../components/ErrorBox';
import Colors from '../../../constants/Colors';
import Strings from '../../../constants/Strings';

const QueryDetailsAdd = props => {
  const [userName, setUserName] = useState('');
  const {navigation, bag_type, bag_Name} = props.route.params;

  const contentWidth = useWindowDimensions().width;
  const [bagType, setBagType] = useState(bag_type);
  const [data, setData] = useState(props?.route?.params?.data);
  const [selected, setSelected] = React.useState('');
  const [markRedelivery, setMarkRedelivery] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bagID, setBagID] = useState('');

  console.log(
    'props?.route?.params?.data==> ' +
      JSON.stringify(props?.route?.params?.data),
  );

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

  useEffect(() => {
    console.log('data,,==> ' + JSON.stringify(data));
    getUserDetails();
    PrefManager.getValue('@bag_ID').then(BAG => {
      setBagID(BAG);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bagType]);

  const getUserDetails = async () => {
    PrefManager.getValue('@userId').then(id => {
      setUserName(id);
    });
  };

  const markAllDelivery = () => {
    setMarkRedelivery(true);
  };

  const callMarkRedelivery = async (orderID, id) => {
    var data = {
      bag_id: id,
      baglocation: 0,
      forceugly: 0,
      order_id: orderID,
      redeliver: 'A',
      newstatus: 7,
      savethis: 0,
    };

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: API.BARCODE_SCAN_LABEL, // `https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
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
          setMarkRedelivery(false);
          setData(res?.data);
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

  const doneButtonCall = async (type, orderID, id) => {
    var datas = {
      bag_id: id,
      baglocation: 0,
      forceugly: 0,
      newstatus: bag_Name === 'query' ? 7 : 0,
      order_id: bag_Name === 'query' ? orderID : 0,
      redeliver: bag_Name === 'query' ? 'Q' : 'D',
      savethis: 0,
    };

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: API.BARCODE_SCAN_LABEL, // `https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: datas,
      };

      axios(config).then(res => {
        setLoading(false);
        if (
          (res && res?.data && res?.data?.ret === 0) ||
          (res && res?.data && res?.data?.error === 'ok')
        ) {
          type === 'next'
            ? navigation.replace('QueryBarcodeScanner', {
                bag_Name: bag_Name,
                navigation: props.navigation,
              })
            : type === 'notes'
            ? navigation.replace('QueryCreateCustom', {
                data: data,
                bagID: bagID,
                bag_type: data.bag_type,
                navigation: navigation,
                bag_Name: bag_Name,
              })
            : navigation.goBack();
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
              navigation.goBack();
            }}
            message={errorMessage}
            navigation={navigation}
          />
        )}

        <ScrollView>
          <LinearGradient
            colors={['#E4002B', '#FF94A8']}
            style={styles.linearGradient}>
            <View style={styles.userDetailsView}>
              <Text style={styles.clientNameText}>{data?.client}</Text>
              <Text style={styles.clientNameText}>
                {data?.order_id + ' - ' + bagID}
              </Text>

              {/* <Button
            title={'Next...'}
            onPress={() => {
              navigation.replace('StorageScanner', {bag_Name: 'storage'});
            }}
            textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
          /> */}

              <View
                style={{
                  marginTop: ScaleSizeUtils.hp(2),
                  justifyContent: 'center',
                }}>
                <RenderHtml
                  contentWidth={contentWidth}
                  source={{
                    html: data?.destination,
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

              <Text style={styles.premiumText}>{data?.data?.goldcare}</Text>

              <View
                style={{
                  marginTop: ScaleSizeUtils.hp(2),
                  justifyContent: 'center',
                }}>
                <RenderHtml
                  contentWidth={contentWidth}
                  source={{
                    html: data?.retmessage,
                  }}
                  tagsStyles={{
                    tr: {
                      fontFamily: AppFonts.Inter_Bold,
                    },
                    b: {
                      fontFamily: AppFonts.Inter_ExtraBold,
                      color: 'black',
                    },
                    td: {
                      fontFamily: AppFonts.Inter_Bold,
                    },
                    img: {display: 'none'},
                  }}
                  systemFonts={systemFonts}
                />
              </View>

              <Button
                title={'Next...'}
                onPress={() => {
                  doneButtonCall('next', data?.order_id, bagID);
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />

              <Button
                title={'Notes & Photos'}
                onPress={() => {
                  doneButtonCall('notes', data?.order_id, bagID);
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />

              <Button
                title={'Done'}
                onPress={() => {
                  doneButtonCall('done', data?.order_id, bagID);
                  navigation.goBack();
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />

              {bag_Name === 'query' ? null : (
                <Button
                  title={'Mark all as Redelivered'}
                  onPress={() => {
                    markAllDelivery();
                  }}
                  buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                  textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
                />
              )}
            </View>
          </LinearGradient>
          {markRedelivery && (
            <Modal
              isVisible={markRedelivery}
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
                    {color: Colors.white, fontFamily: AppFonts.Inter_Bold},
                  ]}>
                  {
                    'Are you sure you want to mark all bags in this order as redelivered?'
                  }
                </Text>

                <View
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setMarkRedelivery(false);
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
                      callMarkRedelivery(data?.order_id, bagID);
                      // setBarCodeScanSuccesModal(false);
                    }}
                    style={[
                      styles.buttonView,
                      {backgroundColor: Colors.white},
                    ]}>
                    <Text style={styles.buttonText}>{'Yes'}</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Modal>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    width: '95%',
    padding: ScaleSizeUtils.hp(1),
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: ScaleSizeUtils.hp(5),
    marginBottom: ScaleSizeUtils.hp(5),
    borderRadius: 5,
  },
  userDetailsView: {
    padding: ScaleSizeUtils.hp(1),
    width: '100%',
    backgroundColor: Colors.white,
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
  indicatorViewList: {
    width: '100%',
    height: 2,
    marginTop: 5,
    backgroundColor: Colors.light_gray,
  },
  rowViewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: '95%',
    alignSelf: 'center',
    marginBottom: ScaleSizeUtils.hp(1),
    justifyContent: 'space-between',
  },
  itemText: {
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.black,
  },
  checkBoxView: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.checkBpxMain,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCheckBox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: Colors.checkBoxInActiveBG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownTextStyles: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
  },
  inputStyles: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
  },
  boxStyles: {
    alignSelf: 'center',
    width: '90%',
    borderWidth: 1.5,
    borderColor: Colors.FooterIcon,
    marginBottom: 10,
  },
  dropdownStyles: {
    alignSelf: 'center',
    width: '90%',
    borderWidth: 1.5,
    borderColor: Colors.FooterIcon,
  },
  dropdown: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    paddingRight: 10,
    lineHeight: 23,
    flex: 2,
    textAlignVertical: 'top',
    width: '90%',
    alignSelf: 'center',
    fontFamily: AppFonts.Inter_Regular,
    color: Colors.black,
    minHeight: ScaleSizeUtils.hp(10),
    maxHeight: ScaleSizeUtils.hp(30),
  },
  inputViewContainer: {
    padding: 5,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
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

export default QueryDetailsAdd;
