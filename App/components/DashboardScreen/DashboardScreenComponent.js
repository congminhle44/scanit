import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {connect} from 'react-redux';
import {API} from '../../Helper/HttpService';
import PrefManager from '../../Helper/PrefManager';
import Colors from '../../constants/Colors';
import AppFonts from '../../constants/Fonts';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import TextFontSize from '../../constants/TextFontSize';
import {
  ClearSchoolDetails,
  FetchHouseList,
  FetchSchooldetail,
  FetchSchoollist,
} from '../../redux/nonAuth/action';
const DashboardScreenComponent = props => {
  const {
    schoollist,
    schooldetail,
    FetchSchooldetail,
    FetchSchoollist,
    ClearSchoolDetails,
    FetchHouseList,
  } = props;
  const [data, setData] = useState([]);
  const [schoolname, setSchoolname] = useState('');
  const [selected, setSelected] = React.useState('');
  const [defalts, setDefault] = useState();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    ClearSchoolDetails();
    FetchSchoollist();
    getDefaultData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newArray = schoollist.map(item => {
      return {key: item.data, value: item.text};
    });
    setData(newArray);

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        setDefault({});
        PrefManager.removeValue('@default');
        AsyncStorage.removeItem('@default');
        PrefManager.removeValue('@schoolId');
        console.log('App has come to the foreground!');
      } else {
        setDefault({});
        console.log('App has come to the background!');
        AsyncStorage.removeItem('@default');
        PrefManager.removeValue('@default');
        PrefManager.removeValue('@schoolId');
      }

      appState.current = nextAppState;
      setDefault({});
      PrefManager.removeValue('@default');
      AsyncStorage.removeItem('@default');
      PrefManager.removeValue('@schoolId');
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [schoollist]);

  const getDefaultData = async () => {
    const defalt = JSON.parse(await PrefManager.getValue('@default'));
    setDefault(defalt);
  };

  const handlechange = async id => {
    console.log('IDD=> ' + JSON.stringify(id));
    FetchHouseList(`?school=${id}`);
    if (id !== 0) {
      let IDS = id === 0 ? '0' : id;
      FetchSchooldetail(`?school=${IDS}&page=${0}&start=${0}&limit=${25}`);
      const name = schoollist
        .filter(item => item.data === IDS)
        .map(x => x.text);
      const names = data.filter(item => item.key === IDS).map(x => x);
      PrefManager.setValue('@schoolId', IDS);
      PrefManager.setValue('@default', JSON.stringify(names[0]));
      await axios
        .get(
          `${API.BASE_URL}defaultlocations?school=${IDS}`,
          // `https://www.schooltrunk.org/sys/scanit/defaultlocations?school=${IDS}`,
        )
        .then(function (response) {
          let StorageObject = response.data.filter(function (el) {
            return el.type === '2';
          });
          PrefManager.setValue(
            '@StorageObject',
            JSON.stringify(StorageObject[0]),
          );

          let SchoolObject = response.data.filter(function (el) {
            return el.type === '1';
          });
          PrefManager.setValue(
            '@SchoolObject',
            JSON.stringify(SchoolObject[0]),
          );

          let Goldcare = response.data.filter(function (el) {
            return el.type === '3';
          });
          PrefManager.setValue('@Goldcare', JSON.stringify(Goldcare[0]));

          let Transit = response.data.filter(function (el) {
            return el.type === '4';
          });
          PrefManager.setValue('@Transit', JSON.stringify(Transit[0]));
          // handle response
        })
        .catch(function (error) {
          // handle error
        })
        .finally(function () {
          // always executes at the last of any API call
        });
      setSchoolname(name);
    } else {
      PrefManager.setValue('@schoolId', '');
    }
  };

  return (
    <>
      <View style={styles.dropDownView}>
        <Text style={styles.schoolText}>{Strings.school}</Text>
        {/* <ProgressLoader loading={loading} /> */}
        <SelectList
          onSelect={() => handlechange(selected)}
          placeholder="Set school ..."
          setSelected={setSelected}
          data={data}
          dropdownTextStyles={styles.dropdownTextStyles}
          save="key"
          inputStyles={styles.inputStyles}
          search={false}
          fontFamily={AppFonts.Inter_Regular}
          boxStyles={styles.boxStyles}
          dropdownStyles={styles.dropdownStyles}
          maxHeight={ScaleSizeUtils.hp(25)}
          defaultOption={defalts}
        />

        <Text style={styles.schoolMoversText}>
          {Strings.select_school_for_school_movers}
        </Text>
      </View>

      <View style={styles.detailsView}>
        {selected === 0 && schooldetail?.length > 0 && (
          <Text style={styles.header}>
            {
              'Please select a school for mass moves \n (when using unload and load features)'
            }
          </Text>
        )}

        {selected > 0 && (
          <Text
            style={[
              styles.schoolText,
              {
                textAlign: 'center',
                marginBottom: ScaleSizeUtils.hp(2),
                fontSize: TextFontSize.TEXT_SIZE_REGULAR,
              },
            ]}>
            {schoolname}
          </Text>
        )}

        {selected > 0 &&
          schooldetail?.map((x, index) => {
            return (
              <View key={index}>
                {x.typed === 'storage' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: ScaleSizeUtils.hp(2),
                      marginBottom: ScaleSizeUtils.hp(1),
                    }}>
                    <Text style={styles.detailsSubText}>Storage :</Text>
                    <Text style={styles.detailsSubText}>{x.description}</Text>
                  </View>
                )}

                {x.typed === 'goldcare' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: ScaleSizeUtils.hp(2),
                      marginBottom: ScaleSizeUtils.hp(1),
                    }}>
                    <Text style={styles.detailsSubText}>Gold Care :</Text>
                    <Text style={styles.detailsSubText}>{x.description}</Text>
                  </View>
                )}

                {x.typed === 'transit' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: ScaleSizeUtils.hp(2),
                      marginBottom: ScaleSizeUtils.hp(1),
                    }}>
                    <Text style={styles.detailsSubText}>Transit :</Text>
                    <Text style={styles.detailsSubText}>{x.description}</Text>
                  </View>
                )}
              </View>
            );
          })}
      </View>
    </>
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
  header: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: 15,
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
  },
  schoolValueText: {
    width: '90%',
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM - 1,
    color: Colors.black,
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
  detailsView: {
    padding: ScaleSizeUtils.hp(1),
    backgroundColor: Colors.detailsBgColor,
    width: '90%',
    alignSelf: 'center',
    borderRadius: ScaleSizeUtils.hp(2.5),
    borderWidth: 2,
    borderColor: 'rgba(61, 44, 166, 0.1)',
  },
  detailsSubText: {
    fontSize: TextFontSize.TEXT_SIZE_REGULAR,
    color: Colors.black,
    fontFamily: AppFonts.Inter_Regular,
    width: '50%',
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
  dropdown: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapStateToProps = state => {
  return {
    schoollist: state.nonAuth.data,
    schooldetail: state.nonAuth.Schooldetail,
    loading: state.nonAuth.loading,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    FetchSchoollist: data => {
      dispatch(FetchSchoollist(data));
    },
    FetchSchooldetail: data => {
      dispatch(FetchSchooldetail(data));
    },
    ClearSchoolDetails: data => {
      dispatch(ClearSchoolDetails(data));
    },
    FetchHouseList: data => {
      dispatch(FetchHouseList(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardScreenComponent);
