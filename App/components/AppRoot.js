import React, {PureComponent} from 'react';
import {View} from 'react-native';

export default class AppRoot extends PureComponent {
  render() {
    return <View>{this.props.children}</View>;
  }
}
