import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import PrefManager from '../../Helper/PrefManager';
import commonStyle from '../../Styles/commonStyle';
import Colors from '../../constants/Colors';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import Strings from '../../constants/Strings';
import AlertModal from '../AlertModal';

const BagAddManualComponents = ({navigation}) => {
  const [bagId, setBagId] = useState('');
  const [bagIDInput, setBagIDInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const CloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{marginTop: 30}}>
      <View
        style={{
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.medium_gray,
          borderRadius: 5,
          marginHorizontal: ScaleSizeUtils.MARGIN_TEN,
        }}>
        <View style={{borderBottomWidth: 1, borderColor: Colors.medium_gray}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                backgroundColor: '#f7f7f7',
                padding: 10,
                width: ScaleSizeUtils.wp('30%'),
              }}>
              <Text
                style={{fontSize: 18, color: Colors.black, fontWeight: 'bold'}}>
                Bag ID
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                name="bagId"
                onChangeText={text => {
                  setBagIDInput(text);
                  PrefManager.setValue('@bag_ID', text);
                }}
                value={bagIDInput}
                style={(commonStyle.textInputstyle, {width: '75%'})}
                // onEndEditing={() => {
                //   checkValidation();
                // }}
                returnKeyType="done"
                keyboardType="numeric"
                placeholderTextColor={Colors.blacklight}
              />
              {bagId.length > 0 ? (
                <TouchableOpacity
                  onPress={() => {
                    setBagIDInput('');
                  }}
                  style={{justifyContent: 'center'}}>
                  <Image
                    source={require('../../assets/close.png')}
                    style={{height: 20, width: 20, alignSelf: 'center'}}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.TextView}>
          <Text style={styles.text}>Lookup Bag</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.exirView}>
          <Text style={styles.text}>Exit</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          textAlign: 'center',
          color: Colors.gray_light,
          marginTop: 20,
          fontSize: 18,
        }}>
        {Strings.enterBagID}
      </Text>
      {modalVisible && (
        <AlertModal
          modalVisible={modalVisible}
          CloseModal={CloseModal}
          header={'Please check your information'}
          title={'Enter a bag ID'}
          buttonText={'OK'}
        />
      )}
    </View>
  );
};

export default BagAddManualComponents;

const styles = StyleSheet.create({
  TextView: {
    width: ScaleSizeUtils.wp('90%'),
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1.2,
    borderColor: Colors.normal_gray,
    borderRadius: 10,
    padding: 25,
    marginBottom: 20,
  },
  exirView: {
    width: ScaleSizeUtils.wp('90%'),
    marginTop: 20,
    backgroundColor: Colors.dark_gray,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.normal_gray,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
});
