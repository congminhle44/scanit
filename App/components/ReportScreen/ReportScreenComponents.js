import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useEffect, useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import {connect} from 'react-redux';
import PrefManager from '../../Helper/PrefManager';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import {FetchHouseList} from '../../redux/nonAuth/action';

const ReportScreenComponents = props => {
  const [selected, setSelected] = React.useState('');
  const [houseID, setHouseID] = useState('');
  const [schoolID, setSchoolID] = useState('');

  const [dataa, setData] = useState([]);

  useEffect(() => {
    const getHouseList = () => {
      let newArray =
        props?.houseList &&
        props?.houseList?.map(item => {
          return {key: item?.data, value: item?.text};
        });
      setData(newArray);
    };
    const getPrefValue = async () => {
      const id = await PrefManager.getValue('@schoolId');
      PrefManager.getValue('@default');
      setSchoolID(id);
      getHouseList();
    };
    getPrefValue();
  }, [props?.houseList]);

  const handlechange = id => {
    if (id !== 0) {
      PrefManager.setValue('@houseID', id);
      setHouseID(id);
    } else {
      PrefManager.setValue('@houseID', '0');
      setHouseID('');
    }
  };

  return (
    <View style={{marginTop: 10}}>
      <View style={styles.dropDownView}>
        <Text style={styles.schoolText}>{Strings.house}</Text>
        <SelectList
          setSelected={val => setSelected(val)}
          onSelect={() => handlechange(selected)}
          data={dataa ? dataa : []}
          placeholder={'Select house'}
          searchPlaceholder={'Set house'}
          dropdownTextStyles={styles.dropdownTextStyles}
          save="key"
          inputStyles={styles.inputStyles}
          search={false}
          fontFamily={AppFonts.Inter_Regular}
          boxStyles={styles.boxStyles}
          dropdownStyles={styles.dropdownStyles}
          maxHeight={ScaleSizeUtils.hp(25)}
        />
      </View>

      {schoolID !== '' ? (
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {
            props.navigation.navigate('StatusScreen', {
              houseID: houseID,
              schoolID: schoolID,
            });
          }}>
          <ImageBackground
            source={require('../../assets/ButtonBG.png')}
            resizeMode="contain"
            style={styles.btnMainViewContainer}>
            <Text style={styles.cancelText}>Status</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      {schoolID !== '' ? (
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {
            props.navigation.navigate('OrderWithNoBagsScreen', {
              houseID: houseID,
              schoolID: schoolID,
            });
          }}>
          <ImageBackground
            source={require('../../assets/ButtonBG.png')}
            resizeMode="contain"
            style={styles.btnMainViewContainer}>
            <Text style={styles.cancelText}>Order with no bags</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      {schoolID !== '' ? (
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {
            props.navigation.navigate('IdentifyNotLoadScreen', {
              houseID: houseID,
              schoolID: schoolID,
            });
          }}>
          <ImageBackground
            source={require('../../assets/ButtonBG.png')}
            resizeMode="contain"
            style={styles.btnMainViewContainer}>
            <Text style={styles.cancelText}>Identified not loaded</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      {schoolID !== '' ? (
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() => {
            props.navigation.navigate('NotYetDelivered', {
              houseID: houseID,
              schoolID: schoolID,
            });
          }}>
          <ImageBackground
            source={require('../../assets/ButtonBG.png')}
            resizeMode="contain"
            style={styles.btnMainViewContainer}>
            <Text style={styles.cancelText}>Not yet redelivered</Text>
          </ImageBackground>
        </TouchableOpacity>
      ) : null}

      {/* {schoolID !== '' ? (<TouchableOpacity
        style={{justifyContent: 'center'}}
        onPress={() => { 
          props.navigation.navigate('BagLocationsScreen', {
            houseID: houseID,
            schoolID: schoolID,
          });
        }}>
        <ImageBackground
          source={require('../../assets/ButtonBG.png')}
          resizeMode="contain"
          style={styles.btnMainViewContainer}>
          <Text style={styles.cancelText}>Bag Locations</Text>
        </ImageBackground>
      </TouchableOpacity>):null} */}
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownView: {
    padding: ScaleSizeUtils.hp(1),
  },
  schoolText: {
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    color: Colors.black,
    fontFamily: AppFonts.Inter_SemiBold,
  },
  schoolValueText: {
    width: '90%',
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM - 1,
    color: Colors.placeHolderColor,
    marginLeft: ScaleSizeUtils.hp(1),
    fontFamily: AppFonts.Inter_Regular,
  },
  schoolMoversText: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.placeHolderColor,
    marginTop: ScaleSizeUtils.hp(1),
    textAlign: 'center',
    fontFamily: AppFonts.Inter_Regular,
  },
  dropdownImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: Colors.FooterIcon,
    transform: [{rotate: '-90deg'}],
  },
  btnMainViewContainer: {
    height: ScaleSizeUtils.hp(7),
    width: ScaleSizeUtils.hp(40),
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: ScaleSizeUtils.hp(1.5),
  },
  cancelText: {
    fontFamily: AppFonts.Inter_Bold,
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM + 2,
    color: Colors.black,
    textAlign: 'center',
    alignSelf: 'center',
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
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.FooterIcon,
  },
  dropdownStyles: {
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1.5,
    borderColor: Colors.FooterIcon,
  },
});

const mapStateToProps = state => {
  return {
    houseList: state.nonAuth.houseList,
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    FetchHouseList: data => {
      dispatch(FetchHouseList(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportScreenComponents);
