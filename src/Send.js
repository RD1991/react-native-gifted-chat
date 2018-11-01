/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewPropTypes } from 'react-native';
import Color from './Color';

export default function Send({ text, containerStyle, onSend, children, textStyle, label, longPressSendAction }) {
  if (text.trim().length > 0) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.container, containerStyle, {backgroundColor: "white", marginBottom: 3}]}
        onPress={() => {
          onSend({ text: text.trim(), message_priority: "normal" }, true);
        }}
        onLongPress={() => {
          longPressSendAction({ text: text.trim() })
        }}
        accessibilityTraits="button"
      >
        <View>{children || <Text style={[styles.text, textStyle]}>{label}</Text>}</View>
      </TouchableOpacity>
    );
  }
  return <View />;
}

const styles = StyleSheet.create({
  container: {
    height: 41,
    justifyContent: 'flex-end',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  children: null,
};

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  children: PropTypes.element,
};
