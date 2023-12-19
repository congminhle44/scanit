import React, {Component} from 'react';

import {Modal, View} from 'react-native';

import {DotsLoader} from 'react-native-indicator';
import Colors from '../constants/Colors';

export default class ProgressLoader extends Component {
  render() {
    return (
      <Modal
        transparent={true}
        animationType={'fade'}
        statusBarTranslucent={true}
        visible={this.props.loading}
        onRequestClose={() => {
          /*this.props.dismissLoader()*/
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#00000057',
          }}>
          <View style={{}}>
            <DotsLoader size={20} color={Colors.white} />
          </View>
        </View>
      </Modal>
    );
  }
}
