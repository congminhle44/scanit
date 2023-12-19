import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';
import ScaleSizeUtils from '../../constants/ScaleSizeUtils';
import TextFontSize from '../../constants/TextFontSize';

export default function DropDowmSelection(props) {
  const data = [
    {
      id: '01',
      name: 'kkdkd',
    },
    {
      id: '02',
      name: 'kkdkdwqw',
    },
    {
      id: '03',
      name: 'kkdkweed',
    },
    {
      id: '04',
      name: 'kkdkrerd',
    },

    {
      id: '05',
      name: 'kkdrerkd',
    },
    {
      id: '05',
      name: 'kkdrerkd',
    },
    {
      id: '05',
      name: 'kkdrerkd',
    },
    {
      id: '05',
      name: 'kkdrerkd',
    },
  ];

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={props.isOpenPicker}
      statusBarTranslucent={true}
      onRequestClose={() => {
        props.closeDialog();
      }}>
      <KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
        <View style={styles.popupOverlay}>
          <View style={styles.popup}>
            <View style={styles.botomSheetHeader}>
              <TouchableOpacity
                onPress={() => {
                  props.closeDialog();
                }}
                style={[
                  styles.headerSmallButtonView,
                  {marginLeft: ScaleSizeUtils.hp(2)},
                ]}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.closeDialog();
                }}
                style={[
                  styles.headerSmallButtonView,
                  {marginRight: ScaleSizeUtils.hp(2)},
                ]}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: '#f1f1f1',
                marginHorizontal: 20,
                marginVertical: 20,
                borderRadius: 10,
              }}>
              <ScrollView contentContainerStyle={styles.contentContainer}>
                {data.map(item => (
                  <View key={item}>
                    <Text
                      style={{
                        fontSize: 22,
                        marginBottom: 25,
                        color: 'black',
                      }}>
                      {item.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
  },
  popup: {
    backgroundColor: '#051927',
    alignSelf: 'center',
    height: ScaleSizeUtils.DIMEN_MEDIUM * 1.2,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  popupOverlay: {
    backgroundColor: '#00000057',
    flex: 1,
    justifyContent: 'center',
  },
  botomSheetHeader: {
    height: ScaleSizeUtils.hp(5),
    width: '100%',
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  headerSmallButtonView: {
    height: ScaleSizeUtils.hp(4),
    width: ScaleSizeUtils.wp(18),
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: Colors.whiteprimary,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: TextFontSize.TEXT_SIZE_SMALL,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
