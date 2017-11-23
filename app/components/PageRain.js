import React from 'react';
import {Animated, Image, ScrollView, StyleSheet, Text, View} from "react-native";
import {connect} from "react-redux";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {fetchWeather} from "../redux/DataStore";
import * as Images from "../Images";
import {DAY_RAIN, MONTH_RAIN} from "../Images";
import bindActionCreators from "redux/es/bindActionCreators";

/**
 * Assumed maximum rain rate the meter will show.
 */
const MAX_RAIN_RANGE = 15;
/**
 * Assumed minimum rain rate the meter will show.
 */
const NO_RAIN = parseFloat(0.0);
const MIN_RAIN_RANGE = NO_RAIN;
const TAG_RAIN_MILLIS = " mm/hr";

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

export default class PageRain extends AStyledWeatherPage {

  rainMillis: Number;
  rainTitle: String;

  constructor() {
    super();

    // weather
    this.rainMillis = MIN_RAIN_RANGE;
    if (parseFloat(this.rainMillis) === NO_RAIN) {
      this.rainTitle = "No rain";
    } else {
      this.rainTitle = `Raining at ${this.rainMillis} mm/hr`;
    }

    // animation
    this.previousAnimationEndValue = MIN_RAIN_RANGE;
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
      inputRange: [MIN_RAIN_RANGE, MAX_RAIN_RANGE],
      outputRange: [200, 0]
    });
  }

  _animateTo(toMillis) {
    if (this.previousAnimationEndValue === toMillis) {
      return;
    }

    this._initAnimation();
    Animated.timing(
      this.animatedValue,
      {
        toValue: toMillis,
        duration: this.ANIMATION_DURATION,
        useNativeDriver: false,
      }
    ).start(() => {
      this.previousAnimationEndValue = toMillis;
    });
  }

  _onWeatherUpdated(weather) {
    if (weather.rainRateNow) {
      this._setRain(weather.rainRateNow);
    }
  }

  _setRain(rainRate) {
    this.rainMillis = this._parseRainStr(rainRate);
    this._animateTo(parseFloat(this.rainMillis));
  }

  _parseRainStr(outTempStr) {
    const n = outTempStr.indexOf(TAG_RAIN_MILLIS);
    return outTempStr.substring(0, n);
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
        <Text>{this.rainTitle}</Text>
        <View style={styles.widgetBackground}>
          <Animated.View
            style={[
              styles.blueBackground,
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
            source={Images.RAIN_GAUGE}
          />
        </View>
        <Text>24 hour rain</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_RAIN)}/>
        <Text>30 day rain</Text>
        <Image
          style={styles.graph}
          source={this.getImage(MONTH_RAIN)}/>
      </ScrollView>
    );
  }

};


const
  styles = StyleSheet.create({
    ...SharedWeatherPageStyles,
    widgetBackground: {
      width: 200,
      height: 200,
      backgroundColor: '#cccccc',
    },
    blueBackground: {
      width: 200,
      backgroundColor: '#1ab6d7',
    },
  });
