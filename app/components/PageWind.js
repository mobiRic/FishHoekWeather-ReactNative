import React from 'react';
import {Animated, Image, ImageBackground, ScrollView, StyleSheet, Text} from "react-native";
import AStyledWeatherPage, {SharedWeatherPageStyles} from "./AStyledWeatherPage";
import {connect} from "react-redux";
import {fetchWeather} from "../redux/DataStore";
import * as Images from "../Images";
import {DAY_WIND, DAY_WIND_DIR, WEEK_WIND, WEEK_WIND_DIR} from "../Images";
import {bindActionCreators} from "redux";

const TAG_WIND_KNOTS = " knots";
const TAG_WIND_DEGREES = "&#176;";
const COMPASS_DIRECTIONS =
  ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N",];

@connect(
  state => ({
    weather: state.rootReducer.weather,
    lastUpdated: state.rootReducer.lastUpdated,
    cacheBuster: state.rootReducer.cacheBuster,
    refreshing: state.rootReducer.refreshing,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(
        {fetchWeather},
        dispatch)
    }
  }),
)

export default class PageWind extends AStyledWeatherPage {

  windSpeed: Number;
  windDir: Number;
  windCompass: String;

  constructor() {
    super();

    // weather
    this.windSpeed = 0;
    this.windDir = 0;
    this.windCompass = COMPASS_DIRECTIONS[0];

    // animation
    this.previousAnimationEndValue = 0;
    this._initAnimation();
  }

  _initAnimation() {
    // first stop any currently running animations
    if (this.animatedValue) {
      this.animatedValue.stopAnimation((value) => {
        this.previousAnimationEndValue = value;
      });
    }

    // create a new animation
    this.animatedValue = new Animated.Value(this.previousAnimationEndValue);
    this.interpolator = this.animatedValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
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
    if (weather.windSpeed && weather.windDir) {
      this._setWind(weather.windSpeed, weather.windDir);
    }
  }

  _setWind(windSpeedStr, windDirStr) {
    this.windSpeed = this._parseSpeedStr(windSpeedStr);
    this.windDir = this._parseDirStr(windDirStr);
    this.windCompass = this._getCompass(this.windDir);

    this._animateTo(parseFloat(this.windDir));
  }

  _parseSpeedStr(windSpeedStr) {
    const n = windSpeedStr.indexOf(TAG_WIND_KNOTS);
    return windSpeedStr.substring(0, n);
  }

  _parseDirStr(windDirStr) {
    const n = windDirStr.indexOf(TAG_WIND_DEGREES);
    return windDirStr.substring(0, n);
  }

  _getCompass(windDirDegrees) {
    const i = Math.round((parseFloat(windDirDegrees) % 360) / 22.5);
    return COMPASS_DIRECTIONS[i];
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.pageContainer}
        refreshControl={this._getRefreshControl()}
      >
        <Text>{`Wind is ${this.windSpeed} knots from ${this.windDir}° (${this.windCompass})`}</Text>
        <ImageBackground
          style={styles.widget}
          source={Images.WIND_GAUGE}>
          <Animated.Image
            style={[
              styles.widget,
              {transform: [{rotate: this.interpolator}]}
            ]}
            source={Images.WIND_ARROW}
          />
        </ImageBackground>
        <Text>24 hour wind speed</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_WIND)}/>
        <Text>24 hour wind direction</Text>
        <Image
          style={styles.graph}
          source={this.getImage(DAY_WIND_DIR)}/>
        <Text>7 day wind speed</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_WIND)}/>
        <Text>7 day wind direction</Text>
        <Image
          style={styles.graph}
          source={this.getImage(WEEK_WIND_DIR)}/>
      </ScrollView>
    );
  }
};


const styles = StyleSheet.create({
  ...SharedWeatherPageStyles,
});