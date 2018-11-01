import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Easing,
  Animated,
  TouchableOpacity,
  Text
} from "react-native";
import { Icon } from "react-native-elements";

class BubbleMenu extends Component {

  constructor(props) {
    super(props);
    const openMenuValue = 50;
    const opacityValue = 0;
    this.state = {
      openMenu: new Animated.Value(openMenuValue),
      opacity: new Animated.Value(opacityValue),
      show: false,
      items: props.items ? props.items : []
    };
  }

  componentDidMount() {
    if (this.props.isOpened) {
      // setTimeout(() => {this._toggleVisibility(true)}, 1000)
      this._toggleVisibility(true);
    }
  }

  render() {
    const { color, style } = this.props;
    return (
      <Animated.View style={[styles.container, {
        height: this.state.openMenu,
        backgroundColor: this.state.show ? (color) ? color : "#ffffff" : (color) ? color : "#fafafa"
      },style]}>

        <Animated.View style={[styles.items, {
          opacity: this.state.opacity
        }]} pointerEvents={this.state.show ? "auto" : "none"}>
          {this._renderItems()}
        </Animated.View>
        {this._renderOpenBtn()}
      </Animated.View>
    )
  }

  _toggleVisibility(newValue) {
    const openMenuValue = newValue ? (this.state.items.length)*50 + 40 : 50;
    const opacityValue = newValue ? 1 : 0;
    this.setState({ 
      openMenu: new Animated.Value(openMenuValue),
      opacity: new Animated.Value(opacityValue),
      show: newValue 
    });
    let toValue = newValue ? (this.state.items.length)*50 + 40 : 50;
    Animated.parallel([
      Animated[newValue ? "spring" : "timing"](
        this.state.openMenu, {
          toValue,
          delay: newValue ? 0 : 195,
          duration: 195,
          easing: Easing.inOut(Easing.ease)
        }
      ),
      Animated.timing(
        this.state.opacity, {
          toValue: newValue ? 1 : 0,
          delay: newValue ? 195 : 0,
          duration: 195,
          easing: Easing.inOut(Easing.ease)
        }
      )
    ]).start();
  }

  _renderOpenBtn() {
    return (
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          if (this.props.onMenuPress) {
            this.props.onMenuPress(!this.state.show);
          }
          this._toggleVisibility(!this.state.show);}}
      >
        <View>
          <Icon name={ this.state.show ? "close" : "menu"} size={32} color={"#0084FF"} />
        </View>
      </TouchableOpacity>
    );
  }

  _renderItems() {
    let items = Object.values(this.state.items);
    return items.map((item, i) => (
      <TouchableOpacity
        style={[styles.menuItemStyle, {backgroundColor: this.getItemBGColor(item)}]}
        onPress={() => {
          if(this.props.onMenuItemPress) {
            this.props.onMenuItemPress(item,i);
          }
          this._toggleVisibility(!this.state.show);
        }}>
        <Text style={styles.menuItemTxtStyle}>{item}</Text>
      </TouchableOpacity>
    ));
  }

  getItemBGColor(item) {
    if (item == "fyi") {
      return "#28661e";
    } else if (item == "danger") {
      return "red";
    } else {
      return "#0084FF";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50/2,
    justifyContent: 'space-between',
    marginBottom: 3
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    position: "absolute"
  },
  menuItemStyle: {
    height: 40,
    width: 50,
    backgroundColor: '#0084FF',
    borderRadius: 15,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuItemTxtStyle : {
    color: 'white',
  }
});

export default BubbleMenu;