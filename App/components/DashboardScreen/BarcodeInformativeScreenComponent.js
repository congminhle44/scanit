import axios from 'axios';
import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';
import {connect} from 'react-redux';
import {API} from '../../Helper/HttpService';
import PrefManager from '../../Helper/PrefManager';
import Utils from '../../Helper/Utils';
import ErrorBox from '../../components/ErrorBox';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import Button from '../Button';
import ProgressLoader from '../ProgressLoader';
import BarcodeDetailsScreenComponent from './BarcodeDetailsScreenComponent';

const BarcodeInformativeScreenComponent = props => {
  const {data, bagID, navigation} = props;
  const [errorBoxOpen, setErrorBoxOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openBagTypeModal, setOpenBagTypeModal] = useState(false);
  const [bagType, setBagType] = useState(0);
  const [bag_Name, setBagName] = useState('');
  const [loading, setLoading] = useState(false);
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

  // const itemCallApi = async type => {
  //   setErrorBoxOpen(false);
  //   PrefManager.getValue('@ORDER_ID').then(async id => {
  //     var data = {
  //       bag_id: bagID,
  //       bag_notes: '',
  //       bag_type: type,
  //       bag_weight: '0',
  //       baglocation: '0',
  //       forceugly: 1,
  //       newstatus: 0,
  //       order_id: id,
  //       savethis: 1,
  //     };

  //     const isConnected = await Utils.isNetworkAvailable();
  //     setLoading(true);

  //     if (isConnected === true) {
  //       const config = {
  //         method: 'post',
  //         url: `${API.BASE_URL}scanlabel`, // `https://schooltrunk.librisdev.com/sys/scanit/scanlabel`
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         data: data,
  //       };
  //       axios(config)
  //         .then(res => {
  //           setLoading(false);
  //           if (
  //             (res && res?.data && res?.data?.ret === 0) ||
  //             (res && res?.data && res?.data?.error === 'ok')
  //           ) {
  //             props.navigation.replace('BarCodeScanner', {
  //               bag_Name: bag_Name,
  //               navigation: navigation,
  //             });
  //           } else if (
  //             (res && res?.data && res?.data?.ret === 1) ||
  //             (res && res?.data && res?.data?.error !== 'ok')
  //           ) {
  //             setErrorBoxOpen(true);
  //             setErrorMessage(res?.data && res?.data?.error);
  //           }
  //         })
  //         .catch(eror => {
  //           setLoading(false);
  //           console.log('error==> ' + JSON.stringify(eror));
  //         });
  //     } else {
  //       setLoading(false);
  //       Utils.DialogBox(
  //         '',
  //         Strings.no_internet_connection_please_check_your_internetconnection,
  //       );
  //     }
  //   });
  // };

  return (
    <ScrollView>
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

      {openBagTypeModal && (
        <BarcodeDetailsScreenComponent
          navigation={props.navigation}
          data={data}
          bagID={bagID}
          bagTypes={bagType}
          bag_Name={bag_Name}
        />
      )}

      {!openBagTypeModal && (
        <LinearGradient
          colors={['#E4002B', '#FF94A8']}
          style={styles.linearGradient}>
          <View style={styles.userDetailsView}>
            <Text style={styles.clientNameText}>
              {data?.data?.client + ': ' + data?.data?.order_id + ' - ' + bagID}
            </Text>
            <View
              style={{
                marginTop: ScaleSizeUtils.hp(2),
                justifyContent: 'center',
              }}>
              <RenderHtml
                contentWidth={contentWidth}
                source={{
                  html: data?.data?.destination,
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

            <Button
              title={'Trunk/Ugly'}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                setBagType(1);
                // itemCallApi(1);
                setBagName('Trunk/Ugly');
                setOpenBagTypeModal(true);
                props.bagTypeSelection(1);
              }}
            />
            <Button
              title={'Suitcase'}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                setOpenBagTypeModal(true);
                props.bagTypeSelection(2);
                setBagName('Suitcase');
                setBagType(2);
                // itemCallApi(2);
              }}
            />
            <Button
              title={'Crate'}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                props.bagTypeSelection(3);
                setBagType(3);
                setOpenBagTypeModal(true);
                setBagName('Crate');
                // itemCallApi(3);
              }}
            />
            <Button
              title={'Box'}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                setOpenBagTypeModal(true);
                props.bagTypeSelection(4);
                setBagName('Box');
                setBagType(4);
                // itemCallApi(4);
              }}
            />
            <Button
              title={'Duvet'}
              linearViewPropsStyle={styles.buttonContainer}
              textStyle={styles.buttonText}
              onPress={() => {
                setOpenBagTypeModal(true);
                props.bagTypeSelection(5);
                setBagName('Duvet');
                setBagType(5);
                // itemCallApi(5);
              }}
            />

            <View style={{marginTop: ScaleSizeUtils.hp(6)}}>
              <Button
                title={'Exit'}
                linearViewPropsStyle={styles.buttonContainer}
                textStyle={styles.buttonText}
                onPress={() => {
                  setOpenBagTypeModal(true);
                  props.navigation.goBack();
                }}
              />
            </View>
          </View>
        </LinearGradient>
      )}
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
  premiumText: {
    fontFamily: AppFonts.Inter_SemiBold,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 1,
    color: Colors.primary,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: ScaleSizeUtils.hp(2),
    marginBottom: ScaleSizeUtils.hp(2),
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    height: ScaleSizeUtils.hp(5),
    justifyContent: 'center',
    marginBottom: ScaleSizeUtils.hp(2),
    borderRadius: ScaleSizeUtils.hp(1.5),
  },
  buttonText: {
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
  },
});

const mapStateToProps = state => {
  return {
    barcodeScanData: state.nonAuth.barcodeScanData,
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BarcodeInformativeScreenComponent);
