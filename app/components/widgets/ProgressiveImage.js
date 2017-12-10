import React, {Component} from 'react';
import {Animated, ImageBackground, View} from "react-native";


export default class ProgressiveImage extends Component {

  ANIMATION_DURATION = 500;

  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      // placeholder defined in props for this component
      placeholder: this.props.placeholder,
      // currently displayed image
      image: this.props.source,
    };
  }

  componentWillReceiveProps(nextProps) {
    // check for new image
    if (nextProps.source) {
      if (this.state.image.uri !== nextProps.source.uri) {
        // queue new image to be displayed
        this.setState({
          image: nextProps.source,
        });
      }
    }
  }

// noinspection JSUnusedLocalSymbols
  _onLoadStart(event, source) {
    this.state.opacity.setValue(0);
  }

  // noinspection JSUnusedLocalSymbols
  _onLoad(event, source) {
    // start crossfade
    Animated.timing(
      this.state.opacity,
      {
        toValue: 1,
        duration: this.ANIMATION_DURATION,
      }).start(() => this._onCrossfadeComplete(source));
  }

  // noinspection JSUnusedGlobalSymbols
  _onLoadError(event, source) {
    this._onDisplayComplete(source);
  }

  // noinspection JSUnusedGlobalSymbols
  _onCrossfadeComplete(source) {
    // load current image into the background placeholder view
    this.setState({
      placeholder: source,
    });

    this._onDisplayComplete(source);
  }

  // noinspection JSUnusedGlobalSymbols
  _onDisplayComplete(source) {
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
          source={this.state.placeholder}
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
            source={this.state.image}
            onLoadStart={(event) => this._onLoadStart(event, this.state.image)}
            onLoad={(event) => this._onLoad(event, this.state.image)}
          />
        </ImageBackground>
      </View>
    );
  }
}