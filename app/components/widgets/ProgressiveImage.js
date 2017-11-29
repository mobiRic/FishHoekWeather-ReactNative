import React, {Component} from 'react';
import {Animated, ImageBackground, View} from "react-native";


export default class ProgressiveImage extends Component {

  ANIMATION_DURATION = 500;

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  // noinspection JSUnusedLocalSymbols
  _onLoadStart(event) {
    this.state.opacity.setValue(0);
  }

  // noinspection JSUnusedLocalSymbols
  _onLoad(event) {
    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: this.ANIMATION_DURATION,
      }).start();
  }

  render() {
    return (
      <View
        width={this.props.style.width}
        height={this.props.style.height}
        backgroundColor={this.props.style.backgroundColor || 'transparent'}
      >
        <ImageBackground
          key={this.props.key}
          style={this.props.style}
          imageStyle={[
            {
              resizeMode: 'contain'
            },
            this.props.style,
          ]}
          source={this.props.placeholder}
        >
          <Animated.Image
            resizeMode={'contain'}
            key={this.props.key}
            style={[
              {
                opacity: this.state.opacity
              },
              this.props.style,
            ]}
            source={this.props.source}
            onLoadStart={(event) => this._onLoadStart(event)}
            onLoad={(event) => this._onLoad(event)}
          />
        </ImageBackground>
      </View>
    );
  }
}