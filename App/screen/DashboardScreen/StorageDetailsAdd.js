import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {API} from '../../Helper/HttpService';
import PrefManager from '../../Helper/PrefManager';
import Utils from '../../Helper/Utils';
import Button from '../../components/Button';
import ErrorBox from '../../components/ErrorBox';
import ProgressLoader from '../../components/ProgressLoader';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';

const StorageDetailsAdd = props => {
  const {navigation, data, bag_type, bag_Name} = props.route.params;
  const [bagID, setBagID] = useState('');
  const contentWidth = useWindowDimensions().width;
  const [loading, setLoading] = useState(false);
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
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

  useEffect(() => {
    getUserDetails();
    PrefManager.getValue('@bag_ID').then(BAG => {
      setBagID(BAG);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = async () => {
    PrefManager.getValue('@userId');
  };

  const MyStatusBar = ({backgroundColor, ...props}) => (
    <View style={[styles.statusBar, {backgroundColor}]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );

  const itemCallApi = async type => {
    await PrefManager.getValue('@StorageObject').then(async StorageObject => {
      PrefManager.getValue('@Transit').then(async Transit => {
        let datas = JSON.parse(StorageObject);
        let Transits = JSON.parse(Transit);

        var dataPayload = {
          bag_id: bagID,
          baglocation: bag_Name === 'transit' ? Transits['id'] : datas['id'],
          forceugly: 0,
          redeliver: 'M',
          newstatus: bag_Name === 'transit' ? 3 : 5,
          order_id: 0,
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
            data: dataPayload,
          };

          axios(config).then(res => {
            setLoading(false);
            if (
              (res && res?.data && res?.data?.ret === 0) ||
              (res && res?.data && res?.data?.error === 'ok')
            ) {
              type === 'next'
                ? navigation.replace('StorageScanner', {
                    bag_Name: bag_Name,
                    navigation: props.navigation,
                  })
                : type === 'done'
                ? navigation.goBack()
                : navigation.replace('StorageCreateCustom', {
                    data: data,
                    bagID: bagID,
                    bag_type: data.bag_type,
                    navigation: navigation,
                    bag_Name: bag_Name,
                  });
            } else if (
              (res && res?.data && res?.data?.ret === 1) ||
              (res && res?.data && res?.data?.error !== 'ok')
            ) {
              Platform.OS === 'ios'
                ? Alert.alert(
                    '',
                    res?.data && res?.data?.error,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          navigation.goBack();
                        },
                      },
                    ],
                    {cancelable: false},
                  )
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

  return (
    <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 0 : 50}}>
      <MyStatusBar
        backgroundColor={Colors.lightPinkColor}
        barStyle="light-content"
      />

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

      <ProgressLoader loading={loading} />

      <ScrollView>
        <LinearGradient
          colors={['#E4002B', '#FF94A8']}
          style={styles.linearGradient}>
          <View style={styles.userDetailsView}>
            <Text style={styles.clientNameText}>{data?.client}</Text>
            <Text style={styles.clientNameText}>
              {data?.order_id + ' - ' + bagID}
            </Text>

            <Button
              title={'Next...'}
              onPress={() => {
                itemCallApi('next');
              }}
              textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
            />

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
                    fontSize: TextFontSize.TEXT_SIZE_LARGE,
                    color: Colors.black,
                  },
                  td: {
                    fontFamily: AppFonts.Inter_Bold,
                    fontSize: TextFontSize.TEXT_SIZE_LARGE,
                    color: Colors.black,
                  },
                  img: {display: 'none'},
                }}
                systemFonts={systemFonts}
              />
            </View>
            <Text style={styles.premiumText}>{data?.data?.goldcare}</Text>

            <Button
              title={'Notes & Photos'}
              onPress={() => {
                itemCallApi('notes');
              }}
              buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
              textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
            />

            <Button
              title={'Done'}
              onPress={() => {
                itemCallApi('done');
                // navigation.goBack();
              }}
              buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
              textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
            />
          </View>
        </LinearGradient>
      </ScrollView>
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
    fontFamily: AppFonts.Inter_Medium,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 5,
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

export default StorageDetailsAdd;
