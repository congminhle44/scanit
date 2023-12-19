import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class ScrollableAvoidKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      style,
      contentContainerStyle,
      keyboardShouldPersistTaps,
      scrollEnabled,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        keyboardOpeningTime={100}
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === 'ios'}
        showsVerticalScrollIndicator={false}
        bounces={false}
        bouncesZoom={false}
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style={[s.container, style]}
        contentContainerStyle={[s.contentContainer, contentContainerStyle]}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        {...this.props}
      />
    );
  }
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default ScrollableAvoidKeyboard;
