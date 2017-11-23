import React from 'react';
import {Animated, Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {DAY_TEMP_DEW, fetchWeather, WEEK_TEMP_DEW} from "../redux/DataStore";
import bindActionCreators from "redux/es/bindActionCreators";

/**
 * Assumed maximum temperature the thermometer will show.
 */
const MAX_TEMP_RANGE = 40;
/**
 * Assumed minimum temperature the thermometer will show.
 */
const MIN_TEMP_RANGE = -15;
const TAG_TEMP_DEGREES = "&#176;C";

@connect(
  state => ({
    weather: state.weather,
    lastUpdated: state.lastUpdated,
    cacheBuster: state.cacheBuster,
    refreshing: state.refreshing,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(
        {fetchWeather},
        dispatch)
    }
  }),
)

export default class PageTemperature extends AStyledWeatherPage {

  temperature: Number;

  constructor() {
    super();

    // weather
    this.temperature = 0;

    // animation
    this.previousAnimationEndValue = 0;
    this._initAnimation();
  }

  _initAnimation() {
    if (this.animatedValue) {
      this.animatedValue.stopAnimation((value) => {
        this.previousAnimationEndValue = value;
      });
    }
    this.animatedValue = new Animated.Value(this.previousAnimationEndValue);
    this.interpolator = this.animatedValue.interpolate({
      inputRange: [MIN_TEMP_RANGE, MAX_TEMP_RANGE],
      outputRange: [200, 0]
    });
  }

  _animateTo(toDegrees) {
    if (this.previousAnimationEndValue === toDegrees) {
      return;
    }

    this._initAnimation();
    Animated.timing(
      this.animatedValue,
      {
        toValue: toDegrees,
        duration: this.ANIMATION_DURATION,
        useNativeDriver: false,
      }
    ).start(() => {
      this.previousAnimationEndValue = toDegrees;
    });
  }

  _onWeatherUpdated(weather) {
    if (weather.outTemp) {
      this._setTemp(weather.outTemp);
    }
  }

  _setTemp(outTempStr) {
    this.temperature = this._parseTempStr(outTempStr);
    this._animateTo(parseFloat(this.temperature));
  }

  _parseTempStr(outTempStr) {
    const n = outTempStr.indexOf(TAG_TEMP_DEGREES);
    return outTempStr.substring(0, n);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
        <Text>{`Temperature is ${this.temperature}°C`}</Text>
        <View style={styles.widgetBackground}>
          <Animated.View
            style={[
              styles.redBackground,
              {
                position: 'absolute',
                top: this.interpolator,
                bottom: 0,
              }
            ]}
          />
          <Image
            style={[
              styles.widget,
              {
                position: 'absolute',
              }
            ]}
            source={require('../../imgs/widgets/thermometer.png')}
          />
        </View>
        <Text>24 hour temperature</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_TEMP_DEW)}/>
        <Text>7 day temperature</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_TEMP_DEW)}/>
      </ScrollView>
    );
  }

};


const styles = StyleSheet.create({
  ...SharedWeatherPageStyles,
  widgetBackground: {
    width: 200,
    height: 200,
    backgroundColor: '#cccccc',
  },
  redBackground: {
    width: 200,
    backgroundColor: '#fb0000',
  },
});
