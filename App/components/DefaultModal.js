import React, {Component} from 'react';

import {Modal, Text} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import ScaleSizeUtils from '../constants/ScaleSizeUtils';

export default class DefaultModal extends Component {
  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'zoomIn'}
        transparent={true}
        animationOut={'zoomOut'}
        animationInTiming={600}
        animationOutTiming={600}>
        <LinearGradient
          colors={['#E4002B', '#FF94A8']}
          style={{
            height: 100,
            width: '90%',
            alignSelf: 'center',
            borderRadius: ScaleSizeUtils.MARGIN_TEN,
          }}>
          <Text>{'props.title'}</Text>
        </LinearGradient>
      </Modal>
    );
  }
}
