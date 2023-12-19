import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SelectList} from 'react-native-dropdown-select-list';
import {TextInput} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import PrefManager from '../../../Helper/PrefManager';
import Button from '../../../components/Button';
import ReportHeader from '../../../components/ReportHeader';
import Colors from '../../../constants/Colors';
import AppFonts from '../../../constants/Fonts';
import ScaleSizeUtils from '../../../constants/ScaleSizeUtils';
import Strings from '../../../constants/Strings';
import TextFontSize from '../../../constants/TextFontSize';
import {
  FetchHouseList,
  barCodeScaner,
  getNameList,
  uploadImages,
} from '../../../redux/nonAuth/action';

const SearchUser = props => {
  const {navigation, route} = props;
  const {data, bagID, bagTypes, bag_Name} = route.params;
  const {FetchHouseList} = props;
  const [selected, setSelected] = React.useState('');
  const [houseID, setHouseID] = useState('');
  const [schoolID, setSchoolID] = useState('');
  const [name, setName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectedItems, setItems] = useState('');
  const [dataa, setData] = useState([]);

  useEffect(() => {
    const fetchHouseList = async () => {
      const id = await PrefManager.getValue('@schoolId');
      FetchHouseList(`?school=${id}`);
    };
    fetchHouseList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let newArray = props?.houseList?.map(item => {
      return {key: item?.data, value: item?.text};
    });
    setData(newArray);

    console.log('nameList===> ' + JSON.stringify(props?.nameList));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlechange = id => {
    PrefManager.setValue('@houseID', id);
    setHouseID(id);
  };

  const searchNameList = async () => {
    const id = await PrefManager.getValue('@schoolId');
    selected !== 0
      ? props.getNameList(`?house=${selected}&name=${name}`)
      : props.getNameList(`?school=${id}&name=${name}`);
  };

  return (
    <View>
      <ReportHeader
        title={'Search user'}
        navigation={navigation}
        linearViewPropsStyle={{marginTop: 10}}
      />
      <View style={{padding: ScaleSizeUtils.MARGIN_TEN}}>
        <View style={styles.dropDownView}>
          <Text style={styles.schoolText}>{Strings.house}</Text>
          <SelectList
            setSelected={val => setSelected(val)}
            onSelect={() => handlechange(selected)}
            data={dataa}
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

          <Text style={styles.schoolText}>{Strings.house}</Text>
          <View style={styles.inputViewContainer}>
            <TextInput
              style={styles.input}
              value={name}
              placeholder={'Name'}
              placeholderTextColor={Colors.black}
              keyboardType={'default'}
              onChangeText={text => {
                setName(text);
              }}
            />
          </View>
        </View>
        <Button
          title={'Search'}
          onPress={() => {
            searchNameList();
          }}
          buttonStyle={{marginTop: ScaleSizeUtils.hp(2)}}
          textStyle={{fontSize: TextFontSize.TEXT_SIZE_MEDIUM}}
        />

        {props?.nameList ? (
          <View
            style={{
              justifyContent: 'center',
              maxHeight: ScaleSizeUtils.hp(30),
              backgroundColor: Colors.lightWhite,
              alignSelf: 'center',
              width: '90%',
              borderRadius: ScaleSizeUtils.hp(2),
            }}>
            {props?.nameList?.length > 0 ? (
              props?.nameList?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    PrefManager.setValue('@ORDER_ID', item?.order_id);
                    setSelectedIndex(index);
                    setItems(item);
                  }}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    borderRadius: 5,
                    height: ScaleSizeUtils.hp(5),
                    marginTop: 5,
                    backgroundColor:
                      selectedIndex === index
                        ? Colors.lightPinkColor
                        : 'transparent',
                  }}>
                  <Text
                    style={[
                      styles.textItemStyle,
                      {
                        color:
                          selectedIndex === index ? Colors.white : Colors.black,
                      },
                    ]}>
                    {item.name + '   '}
                    <Text>{'[' + item.room + '] '}</Text>
                    <Text>{item.order_id}</Text>
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text
                style={[
                  styles.textItemStyle,
                  {justifyContent: 'center', textAlign: 'center'},
                ]}>
                {'No record found :)'}
              </Text>
            )}
            {/* <FlatList
              data={props?.nameList}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      PrefManager.setValue('@ORDER_ID', item?.order_id);
                      setSelectedIndex(index);
                      setItems(item);
                    }}
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 5,
                      height: ScaleSizeUtils.hp(5),
                      marginTop: 5,
                      backgroundColor:
                        selectedIndex === index
                          ? Colors.lightPinkColor
                          : 'transparent',
                    }}>
                    <Text
                      style={[
                        styles.textItemStyle,
                        {
                          color:
                            selectedIndex === index
                              ? Colors.white
                              : Colors.black,
                        },
                      ]}>
                      {item.name + '   '}
                      <Text>{'[' + item.room + '] '}</Text>
                      <Text>{item.order_id}</Text>
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={() => {
                return (
                  <Text
                    style={[
                      styles.textItemStyle,
                      {justifyContent: 'center', textAlign: 'center'},
                    ]}>
                    {'No record found :)'}
                  </Text>
                );
              }}
            /> */}
          </View>
        ) : null}

        <Button
          title={'Select'}
          onPress={() => {
            navigation.navigate('blankOrderIDScreen', {
              searchUser: selectedItems,
              data: data,
              bagID: bagID,
              bagTypes: bagTypes,
              bag_Name: bag_Name,
              buttonCall: true,
            });
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  schoolText: {
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    color: Colors.black,
    fontFamily: AppFonts.Inter_SemiBold,
    marginTop: ScaleSizeUtils.hp(2),
  },
  textItemStyle: {
    fontSize: TextFontSize.TEXT_SIZE_MEDIUM,
    color: Colors.black,
    fontFamily: AppFonts.Inter_Medium,
    textAlign: 'center',
    alignSelf: 'center',
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
  inputViewContainer: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    height: ScaleSizeUtils.hp(6),
    borderColor: Colors.primary,
    borderRadius: 10,
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
  notesText: {
    fontFamily: AppFonts.Inter_Regular,
    fontSize: TextFontSize.TEXT_SIZE_REGULAR + 3,
    color: Colors.black,
    marginLeft: ScaleSizeUtils.hp(3),
    marginTop: ScaleSizeUtils.hp(0.5),
  },
});

const mapStateToProps = state => {
  return {
    nameList: state.nonAuth.nameList,
    loading: state.nonAuth.loading,
    schooldetail: state.nonAuth.Schooldetail,
    houseList: state.nonAuth.houseList,
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
    FetchHouseList: data => {
      dispatch(FetchHouseList(data));
    },
    getNameList: data => {
      dispatch(getNameList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);
