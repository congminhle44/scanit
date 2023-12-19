import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import ImageCropPicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {connect} from 'react-redux';
import {API} from '../../../Helper/HttpService';
import PrefManager from '../../../Helper/PrefManager';
import Utils from '../../../Helper/Utils';
import commonStyle from '../../../Styles/commonStyle';
import Button from '../../../components/Button';
import ErrorBox from '../../../components/ErrorBox';
import ProgressLoader from '../../../components/ProgressLoader';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import ScaleSizeUtils from '../../../constants/ScaleSizeUtils';
import Strings from '../../../constants/Strings';
import TextFontSize from '../../../constants/TextFontSize';
import {barCodeScaner, uploadImages} from '../../../redux/nonAuth/action';

const blankOrderIDScreen = props => {
  const {route, navigation} = props;
  const {data, bagID, bagTypes, bag_Name, searchUser, buttonCall} =
    route.params;
  const [selectedIndex, setSelectedIndex] = useState(
    bagTypes === undefined || null ? 0 : bagTypes - 1,
  );
  const [selected, setSelected] = useState('');
  const [defalts, setDefault] = useState();
  const [notes, setNotes] = useState('');
  const [bagType, setBagType] = useState(bagTypes - 1);
  const [loading, setLoading] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState('');
  const [bag_ID, setBagID] = useState('');
  const yourRef = useRef(null);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderID, setOrderID] = useState(searchUser.order_id);
  const [lastButton, setLast] = useState('');
  const [screenNames, setScreenNames] = useState('');
  const contentWidth = useWindowDimensions().width;

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
  const weightArray = [
    {key: 'Normal', value: 'Normal', label: 'Normal'},
    {key: 25, value: '25Kg', label: '25'},
    {key: 26, value: '26Kg', label: '26'},
    {key: 27, value: '27Kg', label: '27'},
    {key: 28, value: '28Kg', label: '28'},
    {key: 29, value: '29Kg', label: '29'},
    {key: 30, value: '30Kg', label: '30'},
    {key: 31, value: '31Kg', label: '31'},
    {key: 32, value: '32Kg', label: '32'},
    {key: 33, value: '33Kg', label: '33'},
    {key: 34, value: '34Kg', label: '34'},
    {key: 35, value: '35Kg', label: '35'},
    {key: 35, value: '35Kg+', label: '35'},
  ];
  const BagList = ['Trunk/Ugly', 'Suitcase', 'Crate', 'Box', 'Duvet'];

  useEffect(() => {
    setLast(buttonCall);
    getBAGID();
    const interval = setInterval(async () => {
      lastButton === true
        ? await PrefManager.getValue('@ORDER_ID').then(id => {
            setOrderID(JSON.parse(JSON.stringify(id)));
            setLast(false);
          })
        : null;
    }, 1000);
    return () => clearInterval(interval);
  }, [orderID, buttonCall, lastButton, bagID]);

  const getBAGID = async () => {
    await PrefManager.getValue('@bag_ID').then(item => {
      console.log('ITEMSSBAGIDDD===> ' + JSON.stringify(item));
      setBagID(item);
    });
  };

  const ImageSelection = async bagID => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      var data = new FormData();
      data.append('files', {
        uri: image.path,
        name: bagID + '_' + image.path.split('/').pop(),
        type: image.mime,
      });
      props.uploadImages(data);
    });
  };

  const isValid = (orderID, selectedIndexs, id) => {
    let isValid = true;

    if (orderID == 'undefined' || orderID == undefined) {
      isValid = false;
      Platform.OS === 'ios'
        ? Alert.alert('', 'Please enter orderId')
        : ToastAndroid.show('Please enter orderId', 1000);
    }
    if (
      selectedIndex == undefined ||
      selectedIndex == 'undefined' ||
      selectedIndex == null ||
      selectedIndex == 'null'
    ) {
      isValid = false;
      Platform.OS === 'ios'
        ? Alert.alert('', 'Please select bag type')
        : ToastAndroid.show('Please select bag type', 1000);
    }

    if (isValid) {
      callUsingSaveNext(orderID, id);
    }
  };

  // const callUsingBagID = async (orderID, id) => {
  //   await PrefManager.getValue('@StorageObject').then(async StorageObject => {
  //     PrefManager.getValue('@Transit').then(async Transit => {
  //       let datas = JSON.parse(StorageObject);
  //       let Transits = JSON.parse(Transit);
  //       const newOrderID = orderID.match(/\d+/);
  //       console.log('orderID=> ' + JSON.stringify(orderID));
  //       var data = {
  //         bag_id: id,
  //         bag_notes: notes,
  //         bag_type: selectedIndex + 1,
  //         bag_weight: selected,
  //         baglocation: 0,
  //         new_order_id: 0,
  //         forceugly: '',
  //         redeliver: '',
  //         newstatus: 0,
  //         new_order_id: orderID.replaceAll('"', ''),
  //         order_id: 0,
  //         savethis: 1,
  //       };

  //       const isConnected = await Utils.isNetworkAvailable();
  //       setLoading(true);
  //       if (isConnected == true) {
  //         const config = {
  //           method: 'post',
  //           url: `${API.BASE_URL}scanlabel`, //`https://schooltrunk.librisdev.com/sys/scanit/scanlabel`,
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           data: data,
  //         };
  //         axios(config).then(res => {
  //           setLoading(false);
  //           if (
  //             (res && res?.data && res?.data?.ret === 0) ||
  //             (res && res?.data && res?.data?.error === 'ok')
  //           ) {
  //             props.navigation.goBack();
  //           } else if (res && res?.data && res?.data?.ret === 1) {
  //             setScreenNames('BarCodeScanner');
  //             setErrorBoxOpen(true);
  //             setErrorMessage(res?.data && res?.data?.error);
  //           } else if (res && res?.data && res?.data?.ret === 7) {
  //             setScreenNames('');
  //             setErrorBoxOpen(true);
  //             setErrorMessage(res?.data && res?.data?.error);
  //           }
  //         });
  //       } else {
  //         setLoading(false);
  //         Utils.DialogBox(
  //           '',
  //           Strings.no_internet_connection_please_check_your_internetconnection,
  //         );
  //       }
  //     });
  //   });
  // };

  const callUsingSaveNext = async (orderID, id) => {
    await PrefManager.getValue('@StorageObject').then(async StorageObject => {
      PrefManager.getValue('@Transit').then(async Transit => {
        let datas = JSON.parse(StorageObject);
        let Transits = JSON.parse(Transit);
        console.log('orderID=> ' + JSON.stringify(orderID));
        const newOrderID = orderID?.match(/\d+/);
        var data = {
          bag_id: id,
          bag_notes: notes,
          bag_type: selectedIndex + 1,
          bag_weight: selected,
          baglocation: 0,
          forceugly: '',
          redeliver: '',
          newstatus: 0,
          new_order_id: orderID.replaceAll('"', ''),
          order_id: 0,
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
              props.navigation.replace('BarCodeScanner', {
                bag_Name: bag_Name,
                navigation: props.navigation,
              });
            } else if (res && res?.data && res?.data?.ret === 1) {
              setErrorBoxOpen(true);
              setErrorMessage(res?.data && res?.data?.error);
            } else if (res && res?.data && res?.data?.ret === 7) {
              Platform.OS === 'ios'
                ? Alert.alert('', res?.data && res?.data?.error)
                : setErrorBoxOpen(true);
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
      });
    });
  };

  const getLastUserOrderID = async () => {
    await PrefManager.getValue('@ORDER_ID').then(id => {
      let ids = JSON.parse(JSON.stringify(id));
      console.log('ORDER_IDssss==> ' + ids.match(/\d+/));
      let newOrderID = ids.match(/\d+/);
      setOrderID(newOrderID[0]);
    });
  };

  return (
    <ScrollView>
      {/* <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.lightPinkColor,
        }}></SafeAreaView> */}
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.lightPinkColor}
      />
      <LinearGradient
        colors={['#E4002B', '#FF94A8']}
        style={styles.linearGradient}>
        <ProgressLoader loading={props.loading} />
        {errorBoxOpen && (
          <ErrorBox
            errorModalOpen={errorBoxOpen}
            closeModal={() => {
              setErrorBoxOpen(false);
            }}
            screenName={screenNames}
            bag_name={bag_Name}
            message={errorMessage}
            navigation={navigation}
          />
        )}

        <View style={styles.userDetailsView}>
          <Text style={styles.clientNameText}>
            {data?.client + ': ' + data?.order_id + ' - ' + bag_ID}
          </Text>

          <View
            style={[
              commonStyle.textInputMainView,
              {
                marginTop: ScaleSizeUtils.hp(2),
                flexDirection: 'row',
                width: '100%',
              },
            ]}>
            <Text
              style={[
                styles.premiumText,
                {
                  marginTop: ScaleSizeUtils.hp(0),
                  width: '30%',
                },
              ]}>
              {'Order ID: '}
            </Text>
            <TextInput
              value={orderID}
              style={[commonStyle.textInputstyle, {width: '70%'}]}
              onChangeText={text => {
                setOrderID(text);
                PrefManager.setValue('@ORDER_ID', text);
              }}
              keyboardType={'numeric'}
              placeholderTextColor={Colors.placeHolderColor}
              placeholder="Enter order id"
            />
          </View>

          <View
            style={{marginTop: ScaleSizeUtils.hp(2), justifyContent: 'center'}}>
            <RenderHtml
              contentWidth={contentWidth}
              source={{
                html: data?.destination,
              }}
              tagsStyles={{
                table: {},
                tr: {
                  fontFamily: AppFonts.Inter_Bold,
                  color: Colors.black,
                },
                td: {
                  fontFamily: AppFonts.Inter_Bold,
                  color: Colors.black,
                },
              }}
              systemFonts={systemFonts}
            />
          </View>
          <Text style={styles.premiumText}>{data?.goldcare}</Text>

          <View style={{flexDirection: 'row', width: '90%'}}>
            <Button
              title={'Search'}
              buttonStyle={{width: '55%'}}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                navigation.navigate('SearchUser', {
                  data: data,
                  bagID: bag_ID,
                  bagTypes: bagTypes,
                  bag_Name: bag_Name,
                });
              }}
            />

            <Button
              title={'Use Last'}
              buttonStyle={{width: '55%'}}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                setLast(true);
                getLastUserOrderID();
              }}
            />
          </View>
        </View>

        <View style={styles.indicatorView}></View>
        <View style={{backgroundColor: Colors.white}}>
          {BagList.map((item, index) => (
            <View key={index} style={styles.rowViewContainer}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedIndex(index);
                }}
                style={styles.checkBoxView}>
                <View
                  style={[
                    styles.activeCheckBox,
                    {
                      backgroundColor:
                        selectedIndex === index
                          ? Colors.blue
                          : Colors.checkBoxInActiveBG,
                    },
                  ]}></View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* <FlatList
          data={BagList}
          contentContainerStyle={{backgroundColor: Colors.white}}
          renderItem={({item, index}) => {
            return (
              <View style={styles.rowViewContainer}>
                <Text style={styles.itemText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIndex(index);
                  }}
                  style={styles.checkBoxView}>
                  <View
                    style={[
                      styles.activeCheckBox,
                      {
                        backgroundColor:
                          selectedIndex === index
                            ? Colors.blue
                            : Colors.checkBoxInActiveBG,
                      },
                    ]}></View>
                </TouchableOpacity>
              </View>
            );
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.indicatorViewList}></View>;
          }}
        /> */}

        <View style={{width: '100%', backgroundColor: Colors.white}}>
          <SelectList
            // onSelect={() => handlechange(selected)}
            setSelected={setSelected}
            data={weightArray}
            dropdownTextStyles={styles.dropdownTextStyles}
            save="key"
            inputStyles={styles.inputStyles}
            search={false}
            fontFamily={AppFonts.Inter_Regular}
            boxStyles={styles.boxStyles}
            dropdownStyles={styles.dropdownStyles}
            maxHeight={ScaleSizeUtils.hp(20)}
            defaultOption={defalts}
            placeholder={selected + 'Kg'}
          />

          <View style={styles.inputViewContainer}>
            <TextInput
              style={styles.input}
              value={notes}
              placeholder={'Notes'}
              keyboardType={'default'}
              onChangeText={text => {
                setNotes(text);
              }}
              multiline={true}
            />
          </View>

          {data?.bag_notes ? (
            <View
              style={{
                justifyContent: 'center',
                maxHeight: ScaleSizeUtils.hp(30),
                backgroundColor: Colors.lightWhite,
                width: '90%',
                alignSelf: 'center',
                borderRadius: ScaleSizeUtils.hp(2),
              }}>
              <Text style={styles.notesText}>{'Notes :'}</Text>
              <ScrollView
                ref={yourRef}
                onContentSizeChange={() => yourRef.current.scrollToEnd()}
                onLayout={() => yourRef.current.scrollToEnd()}>
                <RenderHtml
                  contentWidth={contentWidth}
                  source={{
                    html: data?.bag_notes,
                  }}
                  tagsStyles={{
                    body: {
                      fontFamily: AppFonts.Inter_Regular,
                      marginLeft: ScaleSizeUtils.hp(3),
                      color: Colors.black,
                      lineHeight: 20,
                      marginBottom: 30,
                    },
                  }}
                  systemFonts={systemFonts}
                />
              </ScrollView>
            </View>
          ) : null}

          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button
                title={'Done'}
                buttonStyle={{width: '45%'}}
                onPress={() => {
                  selectedIndex !== ''
                    ? PrefManager.getValue('@bag_ID').then(id => {
                        console.log('BAG_ID=> ' + JSON.stringify(bag_ID));
                        console.log('BAG_ID=> ' + JSON.stringify(orderID));
                        // callUsingBagID(orderID, bag_ID);
                        isValid(orderID, selectedIndex, bag_ID);
                        // callUsingSaveNext(orderID, bag_ID);
                      })
                    : Alert.alert('', 'Please select radio button.');
                  // props.navigation.goBack();
                }}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />
              <Button
                title={'Photo'}
                buttonStyle={{width: '45%'}}
                onPress={() => {
                  ImageSelection(bag_ID);
                }}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />
            </View>
            <Button
              title={'Save and Continue'}
              onPress={() => {
                selectedIndex !== ''
                  ? PrefManager.getValue('@bag_ID').then(id => {
                      console.log('BAG_ID=> ' + JSON.stringify(bag_ID));
                      console.log('BAG_ID=> ' + JSON.stringify(orderID));
                      // callUsingSaveNext(orderID, bag_ID);
                      isValid(orderID, selectedIndex, bag_ID);
                    })
                  : Alert.alert('', 'Please select radio button.');
              }}
              textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
            />
          </View>

          <Button
            title={'Cancel No Save'}
            onPress={() => {
              props.navigation.goBack();
            }}
            textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
            buttonStyle={{marginBottom: ScaleSizeUtils.hp(1)}}
          />
        </View>
      </LinearGradient>
    </ScrollView>
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
  notesText: {
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 3,
    color: Colors.black,
    marginLeft: ScaleSizeUtils.hp(3),
    marginTop: ScaleSizeUtils.hp(0.5),
  },
  indicatorView: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(1, 1, 1, 0.4)',
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
  buttonText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.white,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    barcodeScanData: state.nonAuth.barcodeScanData,
    loading: state.nonAuth.loading,
    schooldetail: state.nonAuth.Schooldetail,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    barCodeScaner: data => {
      dispatch(barCodeScaner(data));
    },
    uploadImages: data => {
      dispatch(uploadImages(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(blankOrderIDScreen);
