/* eslint no-use-before-define: ["error", { "variables": false }] */
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, Text, View, ViewPropTypes, Image } from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {

  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentMessage.text !== nextProps.currentMessage.text;
  }

  onUrlPress(url) {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          // eslint-disable-next-line
          console.error('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  }

  onPhonePress(phone) {
    const options = ['Call', 'Text', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
          default:
            break;
        }
      },
    );
  }

  onEmailPress(email) {
    Communications.email([email], null, null, null, null);
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
          {this.renderMessageContent()}
      </View>
    );
  }
  
  renderMessageContent() {
    const linkStyle = StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]);
    var priorityImg = this.getMessagePriorityImage();
    if (this.props.position == "right") {
      return (
        <View style={{flexDirection:"row"}}>
          <Image
            style={{width:15,height:15, alignSelf: "center", marginLeft: 5}}
            source={priorityImg}
          />        
          <ParsedText
            style={[
              styles[this.props.position].text,
              this.props.textStyle[this.props.position],
              this.props.customTextStyle,
            ]}
            parse={[
              ...this.props.parsePatterns(linkStyle),
              { type: 'url', style: linkStyle, onPress: this.onUrlPress },
              { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
              { type: 'email', style: linkStyle, onPress: this.onEmailPress },
            ]}
            childrenProps={{ ...this.props.textProps }}
          >
            {this.props.currentMessage.text}
          </ParsedText>
        </View>
      )
    } else {
      return (
        <View style={{flexDirection:"row"}}>      
          <ParsedText
            style={[
              styles[this.props.position].text,
              this.props.textStyle[this.props.position],
              this.props.customTextStyle,
            ]}
            parse={[
              ...this.props.parsePatterns(linkStyle),
              { type: 'url', style: linkStyle, onPress: this.onUrlPress },
              { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
              { type: 'email', style: linkStyle, onPress: this.onEmailPress },
            ]}
            childrenProps={{ ...this.props.textProps }}
          >
            {this.props.currentMessage.text}
          </ParsedText>
          <Image
            style={{width:15,height:15, alignSelf: "center", marginRight: 5}}
            source={priorityImg}
          />  
        </View>
      )
    }
  }

  getMessagePriorityImage = () => {
    if (this.props.currentMessage.message_priority && this.props.currentMessage.message_priority != "") {
      var message_priority = this.props.currentMessage.message_priority
      if (message_priority == "normal") {
        return null;
      } else if (message_priority == "fyi") {
        return require("./images/fyi.png");
      } else if (message_priority == "danger") {
        return require("./images/danger.png");
      } else {
        return null;
      }
    }
    else {
      return null;
    }
  }

}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func,
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
  customTextStyle: {},
  textProps: {},
  parsePatterns: () => [],
};

MessageText.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object,
  customTextStyle: Text.propTypes.style,
};
