import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {connect} from 'react-redux';
import {API} from '../../../Helper/HttpService';
import PrefManager from '../../../Helper/PrefManager';
import Utils from '../../../Helper/Utils';
import Button from '../../../components/Button';
import ErrorBox from '../../../components/ErrorBox';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import ScaleSizeUtils from '../../../constants/ScaleSizeUtils';
import Strings from '../../../constants/Strings';
import TextFontSize from '../../../constants/TextFontSize';
import {getLocationList} from '../../../redux/nonAuth/action';

const MoveDetailsAdd = props => {
  const [userName, setUserName] = useState('');
  const {navigation, data, bag_type, bag_Name} = props.route.params;
  const [bagType, setBagType] = useState(bag_type);
  const [selected, setSelected] = useState('');
  const [defaultOption, setDefault] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bagID, setBagID] = useState('');

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

  useEffect(() => getDefaultMoveLocation(), []);

  useEffect(() => {
    getUserDetails();
    props.getLocationList(`?page=0&start=0&limit=25`);
    let ArrayData = [];
    props.locationList.map((item, index) => {
      ArrayData.push({
        key: item.data,
        value: item.text,
      });
    });
    setLocationList(ArrayData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bagType]);

  // const onNavigationa = onNavigation => {
  //   setNavigation(onNavigation);
  // };

  const getUserDetails = async () => {
    PrefManager.getValue('@userId').then(id => {
      setUserName(id);
    });
    PrefManager.getValue('@bag_ID').then(BAG => {
      setBagID(BAG);
    });
  };

  const handlechange = id => {
    if (id !== 0) {
      let IDS = id === 0 ? '0' : id;
      const names = locationList.filter(item => item.key === IDS).map(x => x);
      PrefManager.setValue('@moveLocation', JSON.stringify(names[0]));
    }
    setSelected(id);
  };

  const saveLocations = async () => {
    var Data = {
      location_id: selected,
      newstatus: null,
      order_id: 0,
      bag_id: bagID,
      savethis: 1,
    };

    console.log('Data==> ' + JSON.stringify(Data));

    const isConnected = await Utils.isNetworkAvailable();
    setLoading(true);

    if (isConnected == true) {
      const config = {
        method: 'post',
        url: API.SAVE_MORE,
        headers: {
          'Content-Type': 'application/json',
        },
        data: Data,
      };

      axios(config)
        .then(res => {
          setLoading(false);
          if (
            (res && res?.data && res?.data?.ret === 0) ||
            (res && res?.data && res?.data?.error === 'ok')
          ) {
            navigation.replace('MoveBarcodeScanner', {
              bag_Name: 'move',
              navigation: props.navigation,
            });
          } else if (
            (res && res?.data && res?.data?.ret === 1) ||
            (res && res?.data && res?.data?.error !== 'ok')
          ) {
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

  const getDefaultMoveLocation = async () => {
    const defalt = JSON.parse(await PrefManager.getValue('@moveLocation'));
    setDefault(defalt);
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
        <ScrollView>
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
              navigation.replace('StorageScanner', {bag_Name: 'storage',navigation: props.navigation});
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

              <SelectList
                onSelect={() => {
                  handlechange(selected);
                }}
                setSelected={setSelected}
                data={locationList}
                dropdownTextStyles={styles.dropdownTextStyles}
                save="key"
                inputStyles={styles.inputStyles}
                search={false}
                fontFamily={AppFonts.Inter_Regular}
                boxStyles={styles.boxStyles}
                dropdownStyles={styles.dropdownStyles}
                maxHeight={ScaleSizeUtils.hp(20)}
                placeholder={'Select move location'}
                defaultOption={defaultOption}
              />

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
                      color: Colors.black,
                    },
                    b: {
                      fontFamily: AppFonts.Inter_ExtraBold,
                      color: Colors.black,
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
                title={'Save & continue'}
                onPress={() => {
                  saveLocations();
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />

              <Button
                title={'Cancel'}
                onPress={() => {
                  navigation.goBack();
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />

              <Button
                title={'Notes & Photos'}
                onPress={() => {
                  navigation.replace('MoveCreateCustom', {
                    data: data,
                    bagID: bagID,
                    bag_type: data.bag_type,
                    navigation: navigation,
                    bag_Name: 'move',
                    locationId: selected,
                  });
                }}
                buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
                textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
              />
            </View>
          </LinearGradient>
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
    locationList: state.nonAuth.locationList,
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getLocationList: data => {
      dispatch(getLocationList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MoveDetailsAdd);
