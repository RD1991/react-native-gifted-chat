/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View, Keyboard, ViewPropTypes } from 'react-native';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';
import Color from './Color';
import BubbleMenu from './BubbleMenu';

export default class InputToolbar extends React.Component {

  constructor(props) {
    super(props);

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.state = {
      position: 'absolute',
      showMenu: false
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow() {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      });
    }
  }

  keyboardWillHide() {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      });
    }
  }

  renderActions() {
    if (this.props.renderActions) {
      return this.props.renderActions(this.props);
    } else if (this.props.onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    var newProps = {
      ...this.props,
      longPressSendAction: this.longPress
    }
    if (this.props.renderSend) {
      return this.props.renderSend(newProps);
    }
    if (this.state.showMenu) {
      return this.renderMenu();
    } else {
      return <Send {...newProps} />;
    }
  }

  renderMenu() {
    return (
        <BubbleMenu
            items={this.props.messagePriorities}
            isOpened={true}
            onMenuPress={(status)=> {
              this.setState({
                showMenu: status
              })
            }}
            onMenuItemPress = {(item, index)=> {
              console.log("Item Pressed :", item + " ?? " + index)
              this.props.onSend({ text: this.messageTxt.trim(), message_priority: item }, true);
              this.messageTxt = "";
              this.setState({
                showMenu: false
              });
            }}
            color={'clear'}
            style={styles.floatButtonStyle}
          />
    )
  }

  longPress = (value) => {
    this.messageTxt = value.text;
    this.setState({
      showMenu: true
    })
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props);
    }

    return <Composer {...this.props} />;
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>{this.props.renderAccessory(this.props)}</View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle, { position: this.state.position }, { backgroundColor: "transparent" }]}>
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
  floatButtonStyle: {
    backgroundColor: "#FFFFFF"
  }
});

InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
  onPressActionButton: () => {},
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style,
};
