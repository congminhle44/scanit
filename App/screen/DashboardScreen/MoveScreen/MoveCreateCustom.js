import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {connect} from 'react-redux';
import PrefManager from '../../../Helper/PrefManager';
import ScaleSizeUtils from '../../../constants/ScaleSizeUtils';

import axios from 'axios';
import {SelectList} from 'react-native-dropdown-select-list';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {API} from '../../../Helper/HttpService';
import Utils from '../../../Helper/Utils';
import Button from '../../../components/Button';
import ErrorBox from '../../../components/ErrorBox';
import ProgressLoader from '../../../components/ProgressLoader';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import TextFontSize from '../../../constants/TextFontSize';
import {barCodeScaner, uploadImages} from '../../../redux/nonAuth/action';
import Strings from '../../../constants/Strings';

const MoveCreateCustom = props => {
  const [navigationa, setNavigation] = useState('LoginScreen');
  const [userName, setUserName] = useState('');

  const contentWidth = useWindowDimensions().width;
  const {navigation, data, bagID, bag_type, bag_Name, locationId} =
    props.route.params;
  const [bagType, setBagType] = useState(bag_type);
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selected, setSelected] = React.useState('');
  const [defalts, setDefault] = useState();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [defaultLocation, setDefaultLocation] = useState('');
  const [bag_ID, setBagID] = useState('');
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [screenNames, setScreenNames] = useState('');

  useEffect(() => {
    setSelected(data?.bag_weight);
    PrefManager.getValue('@bag_ID').then(id => {
      setBagID(id);
    });

    var bagName = props.schooldetail
      .filter(item => item.typed === bag_Name)
      .map(x => x);
    setDefaultLocation(
      bag_Name === 'identify' ? props.schooldetail[0]?.id : bagName[0]?.id,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.barcodeScanData, props.schooldetail]);

  const handlechange = id => {
    setSelected(id);
    setDefault(id);
  };

  const callUsingBagID = async (orderID, id) => {
    var data = {
      bag_id: id,
      bag_notes: notes,
      bag_type: selectedIndex + 1,
      bag_weight: selected,
      baglocation: locationId,
      forceugly: selectedIndex === 0 ? 1 : '',
      redeliver: bag_Name === 'identify' ? 'I' : 'M',
      newstatus:
        bag_Name === 'storage'
          ? 5
          : bag_Name === 'goldcare'
          ? 4
          : bag_Name === 'transit'
          ? 3
          : bag_Name === 'move'
          ? 2
          : 2,
      order_id: orderID,
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

      axios(config)
        .then(res => {
          setLoading(false);
          if (
            (res && res?.data && res?.data?.ret === 0) ||
            (res && res?.data && res?.data?.error === 'ok')
          ) {
            props.navigation.goBack();
          } else if (res && res?.data && res?.data?.ret === 1) {
            setScreenNames('BarCodeScanner');
            setErrorBoxOpen(true);
            setErrorMessage(res?.data && res?.data?.error);
          } else if (res && res?.data && res?.data?.ret === 7) {
            setScreenNames('');
            setErrorBoxOpen(true);
            setErrorMessage(res?.data && res?.data?.error);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error();
        });
    } else {
      setLoading(false);
      Utils.DialogBox(
        '',
        Strings.no_internet_connection_please_check_your_internetconnection,
      );
    }
  };

  const callUsingSaveNext = async (orderID, id) => {
    var data = {
      bag_id: id,
      bag_notes: notes,
      bag_type: selectedIndex + 1,
      bag_weight: selected,
      baglocation: defaultLocation,
      forceugly: selectedIndex === 0 ? 1 : '',
      redeliver: bag_Name === 'identify' ? 'I' : 'M',
      newstatus:
        bag_Name === 'storage'
          ? 5
          : bag_Name === 'goldcare'
          ? 4
          : bag_Name === 'transit'
          ? 3
          : 2,
      order_id: orderID,
      savethis: 1,
    };

    // props.barCodeScaner(data);

    console.log('data==> ' + JSON.stringify(data));

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
          props.navigation.navigate('BarCodeScanner', {
            bag_Name: bag_Name,
            navigation: props.navigation,
          });
        } else if (res && res?.data && res?.data?.ret === 1) {
          setScreenNames('BarCodeScanner');
          setErrorBoxOpen(true);
          setErrorMessage(res?.data && res?.data?.error);
        } else if (res && res?.data && res?.data?.ret === 7) {
          setScreenNames('');
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

  const ImageSelection = async bagID => {
    ImagePicker.openCamera({
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

  return (
    <ScrollView>
      <LinearGradient
        colors={['#E4002B', '#FF94A8']}
        style={styles.linearGradient}>
        <ProgressLoader loading={loading} />
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

        <View style={styles.userDetailsView}>
          <Text style={styles.clientNameText}>
            {data?.client + ': ' + data?.order_id + ' - ' + bagID}
          </Text>
          <View
            style={{marginTop: ScaleSizeUtils.hp(2), justifyContent: 'center'}}>
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
          <Text style={styles.premiumText}>{data?.goldcare}</Text>
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
              <TouchableOpacity
                style={styles.rowViewContainer}
                onPress={() => {
                  setSelectedIndex(index);
                }}>
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
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => {
            return <View style={styles.indicatorViewList}></View>;
          }}
        /> */}

        <View style={{width: '100%', backgroundColor: Colors.white}}>
          <SelectList
            onSelect={() => handlechange(selected)}
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
                        callUsingBagID(data?.order_id, id);
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
                  PrefManager.getValue('@bag_ID').then(id => {
                    ImageSelection(id);
                  });
                }}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />
            </View>
            <Button
              title={'Save and Continue'}
              onPress={() => {
                selectedIndex !== ''
                  ? PrefManager.getValue('@bag_ID').then(id => {
                      callUsingSaveNext(data?.data?.order_id, id);
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

export default connect(mapStateToProps, mapDispatchToProps)(MoveCreateCustom);
